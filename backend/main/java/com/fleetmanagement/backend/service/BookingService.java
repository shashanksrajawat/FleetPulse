package com.fleetmanagement.backend.service;

import com.fleetmanagement.backend.dao.*;
import com.fleetmanagement.backend.dto.*;
import com.fleetmanagement.backend.entity.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    // PHASE 2: Commitment (Requires Login Verification)
    @Transactional
    public Booking createBooking(BookingRequest request) {
        
        // --- LOGIN FEATURE / VERIFICATION ---
        // We ensure the customer exists and is active.
        User customer = userDao.findById(request.customerId())
                .orElseThrow(() -> new RuntimeException("Authentication Error: User session invalid. Please login again."));

        if (!customer.getIsActive()) {
            throw new RuntimeException("Account is disabled. Please contact support.");
        }

        // 1. Recalculate Distance & Price (Backend Security)
        Double distance = distanceService.getDistanceInKm(request.sourceLocation(), request.destinationLocation());
        VehiclePricing pricing = pricingDao.findByVehicleType(request.vehicleType())
                .orElseThrow(() -> new RuntimeException("Pricing error."));
        BigDecimal finalEstimatedPrice = pricing.getBasePrice().add(pricing.getPricePerKm().multiply(BigDecimal.valueOf(distance)));

        // 2. FIFO Gents: Get Front of Driver Queue
        Driver driver = driverDao.findAvailableDrivers().stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No drivers currently in the queue. Please wait."));

        // 3. FIFO Fleet: Get Front of Vehicle Queue
        Vehicle vehicle = vehicleDao.findAvailableVehiclesPool(request.vehicleType()).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No " + request.vehicleType() + " available right now."));

        // 4. Create and Save Booking
        Booking booking = new Booking();
        booking.setCustomer(customer);
        booking.setDriver(driver);
        booking.setVehicle(vehicle);
        booking.setSourceLocation(request.sourceLocation());
        booking.setDestinationLocation(request.destinationLocation());
        booking.setTotalDistanceKm(BigDecimal.valueOf(distance));
        booking.setEstimatedPrice(finalEstimatedPrice);
        booking.setScheduledStartTime(request.scheduledStartTime());
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus(PaymentStatus.PENDING);

        // 5. Update Resource Status (Move to REAR of queue later)
        vehicle.setStatus(VehicleStatus.BOOKED);
        driver.setStatus(DriverStatus.ON_TRIP);
        driver.setIsAvailable(false);
        driver.setLastActiveAt(LocalDateTime.now()); // Marks their position at the back of the line

        vehicleDao.save(vehicle);
        driverDao.save(driver);
        return bookingDao.save(booking);
    }
}