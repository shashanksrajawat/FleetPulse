package com.fleetmanagement.backend.service;

import com.fleetmanagement.backend.dao.*;
import com.fleetmanagement.backend.dto.*;
import com.fleetmanagement.backend.entity.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingDao bookingDao;
    private final VehicleDao vehicleDao;
    private final DriverDao driverDao;
    private final VehiclePricingDao pricingDao;
    private final UserDao userDao;
    private final DistanceService distanceService;

    public BookingService(BookingDao bookingDao, VehicleDao vehicleDao, DriverDao driverDao,
            VehiclePricingDao pricingDao, UserDao userDao, DistanceService distanceService) {
        this.bookingDao = bookingDao;
        this.vehicleDao = vehicleDao;
        this.driverDao = driverDao;
        this.pricingDao = pricingDao;
        this.userDao = userDao;
        this.distanceService = distanceService;
    }

    // PHASE 1: Public Estimate (No login required)
    public EstimationResponse getEstimation(EstimationRequest request) {
        Double distance = distanceService.getDistanceInKm(request.source(), request.destination());

        VehiclePricing pricing = pricingDao.findByVehicleType(request.vehicleType())
                .orElseThrow(() -> new RuntimeException("Pricing not set for " + request.vehicleType()));

        BigDecimal total = pricing.getBasePrice()
                .add(pricing.getPricePerKm().multiply(BigDecimal.valueOf(distance)));

        return new EstimationResponse(distance, pricing.getBasePrice(), pricing.getPricePerKm(), total, "INR");
    }
    
    
    //helper method to check only one active booking
    private void verifyNoActiveBookings(Long userId) {
        // Uses existing BookingDao.findByCustomerId(userId)
        List<Booking> userBookings = bookingDao.findByCustomerId(userId);
        
        boolean hasActive = userBookings.stream()
                .anyMatch(b -> b.getStatus() != BookingStatus.COMPLETED && 
                               b.getStatus() != BookingStatus.CANCELLED);

        if (hasActive) {
            throw new RuntimeException("Active Booking Detected: You can only have one active trip at a time.");
        }
    }
    
    
    

    // PHASE 2: Commitment (Requires Login Verification)
    @Transactional
    public Booking createBooking(BookingRequest request) {
        // 1. Validate User
        User customer = userDao.findById(request.customerId())
                .orElseThrow(() -> new RuntimeException("Authentication Error: User session invalid."));

        if (!customer.getIsActive()) {
            throw new RuntimeException("Account is disabled. Please contact support.");
        }

        // 2. HELPER CALL: Constraint Check (One booking at a time)
        verifyNoActiveBookings(request.customerId());

        // 3. Round Trip Distance & Price Calculation
        Double oneWayDistance = distanceService.getDistanceInKm(request.sourceLocation(), request.destinationLocation());
        Double roundTripDistance = oneWayDistance * 2; 

        VehiclePricing pricing = pricingDao.findByVehicleType(request.vehicleType())
                .orElseThrow(() -> new RuntimeException("Pricing error: Vehicle type not supported."));
        
        BigDecimal finalEstimatedPrice = pricing.getBasePrice()
                .add(pricing.getPricePerKm().multiply(BigDecimal.valueOf(roundTripDistance)));

        // 4. Resource Allocation (FIFO from pool)
        Driver driver = driverDao.findAvailableDrivers().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No drivers available in the queue."));

        Vehicle vehicle = vehicleDao.findAvailableVehiclesPool(request.vehicleType()).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No " + request.vehicleType() + " available right now."));

        // 5. Create Entity
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setDriver(driver);
        booking.setVehicle(vehicle);
        booking.setSourceLocation(request.sourceLocation());
        booking.setDestinationLocation(request.destinationLocation() + " (Round Trip)");
        booking.setTotalDistanceKm(BigDecimal.valueOf(roundTripDistance));
        booking.setReturnDistanceKm(BigDecimal.valueOf(oneWayDistance));
        booking.setEstimatedPrice(finalEstimatedPrice);
        booking.setScheduledStartTime(request.scheduledStartTime());
        
        // Immediate confirmation as resources are locked
        booking.setStatus(BookingStatus.DRIVER_ASSIGNED);
        booking.setPaymentStatus(PaymentStatus.PENDING);

        // 6. Lock Resources
        vehicle.setStatus(VehicleStatus.BOOKED);
        driver.setStatus(DriverStatus.ON_TRIP);
        driver.setIsAvailable(false);
        driver.setLastActiveAt(LocalDateTime.now());

        vehicleDao.save(vehicle);
        driverDao.save(driver);
        
        // 7. Persist using your BookingDao
        return bookingDao.save(booking);
    }
    
    

    // PHASE 3: Retrieval
    public java.util.List<Booking> getUserBookings(Long userId) {
        return bookingDao.findByCustomerId(userId);
    }

    // UPDATED: Now takes UserID from frontend and finds Driver Bookings
    public java.util.List<Booking> getDriverBookings(Long userId) {
        return bookingDao.findByDriverUserId(userId);
    }

    @Transactional
    public Booking cancelBooking(Long bookingId) {
        Booking booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled");
        }

        // Check 5-hour window
        long hoursSinceBooking = java.time.temporal.ChronoUnit.HOURS.between(booking.getCreatedAt(),
                LocalDateTime.now());
        if (hoursSinceBooking > 5) {
            throw new RuntimeException("Cancellation failed: strict 5-hour cancellation policy applies.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancelledBy("CUSTOMER");
        booking.setCancellationReason("Customer requested cancellation");

        // Release Vehicle
        if (booking.getVehicle() != null) {
            Vehicle vehicle = booking.getVehicle();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleDao.save(vehicle);
        }

        // Release Driver
        if (booking.getDriver() != null) {
            Driver driver = booking.getDriver();
            driver.setStatus(DriverStatus.ACTIVE);
            driver.setIsAvailable(true);
            driverDao.save(driver);
        }

        System.out.println("Booking is CANCELLED for Booking ID: " + bookingId);
        return bookingDao.save(booking);
    }
    
    //if the driver cancels it automatic reaasignment of the driver
    @Transactional
    public void assignResourcesAutomatically(Long bookingId) {
        Booking booking = bookingDao.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // We keep the vehicle already attached to the booking. 
        // We ONLY find a new driver.
        Driver newDriver = driverDao.findAvailableDrivers()
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("Re-assignment failed: No other drivers available."));

        // Update the Booking with the new driver
        booking.setDriver(newDriver);
        booking.setStatus(BookingStatus.DRIVER_ASSIGNED);

        // Update New Driver Status
        newDriver.setIsAvailable(false);
        newDriver.setStatus(DriverStatus.ON_TRIP);
        newDriver.setLastActiveAt(LocalDateTime.now());

        driverDao.save(newDriver);
        bookingDao.save(booking);
        
        System.out.println("Driver swapped silently. Vehicle " + 
            booking.getVehicle().getRegistrationNumber() + " remains assigned.");
    }
    
    
}