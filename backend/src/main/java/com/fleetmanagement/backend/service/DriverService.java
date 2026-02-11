package com.fleetmanagement.backend.service;

import com.fleetmanagement.backend.dao.*;
import com.fleetmanagement.backend.dto.BookingDTO;
import com.fleetmanagement.backend.dto.TripEndRequestDTO;
import com.fleetmanagement.backend.dto.TripStartRequestDTO;
import com.fleetmanagement.backend.entity.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DriverService {

    private final BookingDao bookingDao;
    private final DriverDao driverDao;
    private final VehicleDao vehicleDao;
    private final BookingService bookingService; // To reuse re-assignment logic
    private final TripDetailDao tripDetailDao;
    private final SettlementDao settlementDao;
    private final CompanyBankDao companyBankDao;

    public DriverService(BookingDao bookingDao, DriverDao driverDao,
            VehicleDao vehicleDao, BookingService bookingService,
            TripDetailDao tripDetailDao, SettlementDao settlementDao,
            CompanyBankDao companyBankDao) {
        this.bookingDao = bookingDao;
        this.driverDao = driverDao;
        this.vehicleDao = vehicleDao;
        this.bookingService = bookingService;
        this.tripDetailDao = tripDetailDao;
        this.settlementDao = settlementDao;
		this.companyBankDao = companyBankDao;
    }

    // DASHBOARD: See assigned booking
    public List<BookingDTO> getAssignedBookings(Long userId) {
        return bookingDao.findByDriverUserId(userId).stream()
                .filter(b -> b.getStatus() == BookingStatus.DRIVER_ASSIGNED || b.getStatus() == BookingStatus.CONFIRMED
                        || b.getStatus() == BookingStatus.IN_PROGRESS)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // NEW: Get Driver Trip History (Completed/Cancelled)
    // Added for Driver Dashboard History Tab
    public List<BookingDTO> getDriverTripHistory(Long userId) {
        return bookingDao.findByDriverUserId(userId).stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED || b.getStatus() == BookingStatus.CANCELLED)
                .sorted((b1, b2) -> b2.getCreatedAt().compareTo(b1.getCreatedAt())) // Newest first
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // PROFILE: Get Driver Profile
    public Driver getDriverProfile(Long userId) {
        return driverDao.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Driver profile not found for user: " + userId));
    }

    @Transactional
    public void acceptBooking(Long bookingId) {
        Booking booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingDao.save(booking);

        // 2. Initialize TripDetail Entry (Ready for startTrip later)
        if (tripDetailDao.findByBookingId(bookingId).isEmpty()) {
            TripDetail details = new TripDetail();
            details.setBooking(booking);
            // startKm is null until startTrip is called
            tripDetailDao.save(details);
            System.out.println("TripDetail initialized for Booking: " + booking.getBookingNumber());
        }
    }

    @Transactional
    public void driverCancelBooking(Long bookingId) {
        Booking booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // 1. Validate Window
        long minutesSinceAssignment = ChronoUnit.MINUTES.between(booking.getCreatedAt(), LocalDateTime.now());
        if (minutesSinceAssignment > 60) {
            throw new RuntimeException("Cancellation window expired. Contact Admin.");
        }

        // 2. Release Driver ONLY
        Driver driver = booking.getDriver();
        if (driver != null) {
            driver.setIsAvailable(true);
            driver.setStatus(DriverStatus.ACTIVE);
            driverDao.save(driver);
        }

        // 3. Delegate the heavy lifting to BookingService
        // We pass the ID and let BookingService handle the swap silently
        bookingService.assignResourcesAutomatically(bookingId);
    }

    // the driver reached the user and started the trip
    @Transactional
    public void startTrip(TripStartRequestDTO request) {
        // We now use findByBookingId because the record was created at acceptance
        TripDetail details = tripDetailDao.findByBookingId(request.bookingId())
                .orElseThrow(() -> new RuntimeException("Trip not initialized. Driver must accept trip first."));

        Booking booking = details.getBooking();

        // Update Metrics
        details.setStartKm(request.startKm());
        booking.setStatus(BookingStatus.IN_PROGRESS);
        booking.setActualStartTime(LocalDateTime.now());

        bookingDao.save(booking);
        tripDetailDao.save(details);
    }

    // when the drivers ends the ride
    @Transactional
    public void completeTrip(TripEndRequestDTO request) {
        TripDetail details = tripDetailDao.findByBookingId(request.bookingId())
                .orElseThrow(() -> new RuntimeException("TripDetail not found."));

        Booking booking = details.getBooking();

        if (booking.getStatus() != BookingStatus.IN_PROGRESS) {
            throw new RuntimeException("Trip is not in progress.");
        }

        // 1. Set basic end metrics
        LocalDateTime endTime = LocalDateTime.now();
        details.setEndKm(request.endKm());
        booking.setActualEndTime(endTime);
        booking.setActualVehicleReturnTime(endTime);
        booking.setAdditionalCharges(request.additionalCharges());

        // 2. Perform math (Helper)
        calculateFinalPrice(booking, details);
        // the settlement
        calculateInternalSettlement(booking);

        // 3. FIFO Release (Helper)
        releaseResources(booking);

        // 4. Close the lifecycle
        booking.setStatus(BookingStatus.COMPLETED);
        booking.setPaymentStatus(PaymentStatus.PAID);

        // 5. Save
        bookingDao.save(booking);
        tripDetailDao.save(details);

        // No return statement needed
    }

    // calcualte the final price and update the booking object
    private void calculateFinalPrice(Booking booking, TripDetail details) {
        // 1. Distance Calculation
        // Find how many extra KMs were driven beyond the initial estimate
        BigDecimal actualDistance = details.getEndKm().subtract(details.getStartKm());
        BigDecimal estimatedDistance = booking.getTotalDistanceKm();

        BigDecimal basePrice = booking.getEstimatedPrice();

        // If they drove more than estimated, add an extra charge (e.g., 15 INR per km)
        if (actualDistance.compareTo(estimatedDistance) > 0) {
            BigDecimal extraKm = actualDistance.subtract(estimatedDistance);
            BigDecimal extraCharge = extraKm.multiply(new BigDecimal("15.00"));
            basePrice = basePrice.add(extraCharge);
        }

        // 2. The 24-Hour Day Surcharge Logic
        // Using Duration to find the exact hours between Start and End
        long totalHours = java.time.Duration.between(booking.getActualStartTime(), booking.getActualEndTime())
                .toHours();
        BigDecimal timeSurcharge = BigDecimal.ZERO;

        if (totalHours >= 24) {
            long extraDays = totalHours / 24;
            // Adding 2000 INR for every full 24-hour block
            timeSurcharge = new BigDecimal("2000.00").multiply(BigDecimal.valueOf(extraDays));
        }

        // 3. Update the Booking Entity Fields
        BigDecimal subTotal = basePrice.add(timeSurcharge);
        booking.setFinalPrice(subTotal);

        // Add additional charges (tolls/parking) provided by driver
        BigDecimal additional = booking.getAdditionalCharges() != null ? booking.getAdditionalCharges()
                : BigDecimal.ZERO;

        // Tax Calculation (Example: 18% GST)
        BigDecimal tax = subTotal.add(additional).multiply(new BigDecimal("0.18"));
        booking.setTaxAmount(tax);

        // Final Total: (Base + Surcharge + Additional + Tax) - Discount
        BigDecimal discount = booking.getDiscount() != null ? booking.getDiscount() : BigDecimal.ZERO;
        BigDecimal totalAmount = subTotal.add(additional).add(tax).subtract(discount);

        booking.setTotalAmount(totalAmount);
    }

    private void releaseResources(Booking booking) {
        // Release Driver
        Driver driver = booking.getDriver();
        driver.setIsAvailable(true);
        driver.setStatus(DriverStatus.ACTIVE);
        driver.setLastActiveAt(LocalDateTime.now()); // Move to the end of the FIFO queue

        // Release Vehicle
        Vehicle vehicle = booking.getVehicle();
        vehicle.setStatus(VehicleStatus.AVAILABLE);

        driverDao.save(driver);
        vehicleDao.save(vehicle);
    }

    // handle the internal settlement
    private void calculateInternalSettlement(Booking booking) {
        // 1. Calculate the Breakage
        BigDecimal revenueToSplit = booking.getFinalPrice();
        BigDecimal driverShare = revenueToSplit.multiply(new BigDecimal("0.35"));
        BigDecimal companyProfit = revenueToSplit.multiply(new BigDecimal("0.25"));
        BigDecimal maintenanceShare = revenueToSplit.multiply(new BigDecimal("0.40"));

        // 2. Create and Save Settlement (Audit Record)
        Settlement settlement = Settlement.builder()
                .booking(booking)
                .totalRevenue(booking.getTotalAmount())
                .driverShare(driverShare)
                .companyProfit(companyProfit)
                .maintenanceShare(maintenanceShare)
                .build();
        settlementDao.save(settlement);

        // 3. Update Driver Stats (Trip Count + Earnings)
        Driver driver = booking.getDriver();
        driver.setTotalTrips(driver.getTotalTrips() + 1);
        driver.setTotalEarnings(driver.getTotalEarnings().add(driverShare));
        driverDao.save(driver);

        // 4. Atomic Update - Prevents race conditions!
        companyBankDao.incrementBankBalances(companyProfit, maintenanceShare, booking.getTotalAmount());
    }

    private BookingDTO mapToDTO(Booking b) {
        return new BookingDTO(
                b.getId(), b.getBookingNumber(), b.getCustomer().getFirstName() + " " + b.getCustomer().getLastName(),
                b.getVehicle() != null ? b.getVehicle().getRegistrationNumber() : "PENDING",
                b.getDriver() != null ? b.getDriver().getUser().getFirstName() : "PENDING",
                b.getSourceLocation(), b.getDestinationLocation(),
                b.getTotalAmount() != null ? b.getTotalAmount() : b.getEstimatedPrice(),
                b.getStatus(), b.getPaymentStatus(), b.getScheduledStartTime());
    }
}