package com.fleetmanagement.backend.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Unique booking reference number for tracking (e.g., BK20260128001)
    @Column(nullable = false, unique = true, length = 50)
    private String bookingNumber;
    
    // ========== USER RELATIONSHIPS ==========
    
    // The customer who made the booking
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;
    
    // The vehicle booked for this trip
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    // The driver assigned to this booking (can be null initially, assigned from pool later)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;
    
    // ========== LOCATION DETAILS ==========
    
    // Source/Pickup location
    @Column(nullable = false, length = 500)
    private String sourceLocation;
    

    // Destination/Drop location
    @Column(nullable = false, length = 500)
    private String destinationLocation;

    
    // ========== DISTANCE & TIME ==========
    
    // Total distance in kilometers (calculated via Google Maps API or similar)
    @Column(nullable = false)
    private BigDecimal totalDistanceKm;
    
    // Estimated time for one-way trip in hours (based on distance and average speed)
    @Column
    private BigDecimal estimatedTripDurationHours;
    
    // Return distance from destination back to company base (City A)
    // This is the distance from City B back to City A
    @Column
    private BigDecimal returnDistanceKm;
    
    // Estimated return trip duration in hours
    // Time needed for vehicle to return to base before next booking
    @Column
    private BigDecimal estimatedReturnDurationHours;
    
    // Total downtime = trip duration + return duration
    // Vehicle unavailable for this total time
    @Column
    private BigDecimal totalVehicleDowntimeHours;
    
    // ========== PRICING ==========
    
    // Estimated price shown to customer before booking confirmation
    // Calculated as: basePrice + (pricePerKm * distance) + (pricePerDay * days)
    @Column(nullable = false)
    private BigDecimal estimatedPrice;
    
    // Final price calculated after trip completion
    // May differ from estimated if actual distance/time varies
    @Column
    private BigDecimal finalPrice;
    
    // Additional charges (tolls, parking, extra hours, etc.)
    @Column
    private BigDecimal additionalCharges;
    
    // Discount applied (promo codes, loyalty points, etc.)
    @Column
    private BigDecimal discount;
    
    // Tax amount (GST, etc.)
    @Column
    private BigDecimal taxAmount;
    
    // Total amount to be paid = finalPrice + additionalCharges + taxAmount - discount
    @Column
    private BigDecimal totalAmount;
    
    // ========== TRIP TIMING ==========
    
    // When customer wants to start the trip
    @Column(nullable = false)
    private LocalDateTime scheduledStartTime;
    
    // When trip actually started (driver picked up customer)
    @Column
    private LocalDateTime actualStartTime;
    
    // Expected end time based on estimated duration
    @Column
    private LocalDateTime expectedEndTime;
    
    // When trip actually ended (customer dropped off)
    @Column
    private LocalDateTime actualEndTime;
    
    // When vehicle is expected back at base (City A)
    // = actualEndTime + estimatedReturnDurationHours
    @Column
    private LocalDateTime expectedVehicleReturnTime;
    
    // When vehicle actually returned to base
    @Column
    private LocalDateTime actualVehicleReturnTime;
    
    // ========== BOOKING STATUS ==========
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private BookingStatus status;
    
    // ========== PAYMENT DETAILS ==========
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus paymentStatus;
    
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private PaymentMethod paymentMethod;
    
    // Payment transaction ID from payment gateway
    @Column(length = 100)
    private String paymentTransactionId;
    
    // ========== ADDITIONAL INFO ==========

    
    // Reason for cancellation if booking is cancelled
    @Column(length = 500)
    private String cancellationReason;
    
    // Who cancelled - CUSTOMER, DRIVER, ADMIN
    @Column(length = 20)
    private String cancelledBy;
    
    // When booking was cancelled
    @Column
    private LocalDateTime cancelledAt;
    
    // Customer rating for this trip (1-5)
    @Column
    private Integer customerRating;
    
    // Customer review/feedback
    @Column(length = 1000)
    private String customerReview;
    
    // ========== AUDIT FIELDS ==========
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        
        // Auto-generate booking number
        if (bookingNumber == null) {
            bookingNumber = generateBookingNumber();
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Helper method to generate unique booking number
    private String generateBookingNumber() {
        // Format: BK + YYYYMMDD + RandomNumber
        // Example: BK20260128001
        return "BK" + LocalDateTime.now().format(
            java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd")
        ) + String.format("%03d", (int)(Math.random() * 1000));
    }
}

// ========== ENUMS ==========


enum PaymentMethod {
    CASH,
    CARD,
    UPI
}
