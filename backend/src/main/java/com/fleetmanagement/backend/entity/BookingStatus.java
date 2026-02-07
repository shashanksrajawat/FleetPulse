package com.fleetmanagement.backend.entity;

public enum BookingStatus {
    PENDING,              // Booking created, waiting for driver assignment
    DRIVER_ASSIGNED,      // Driver assigned from pool
    CONFIRMED,            // Driver accepted, booking confirmed
    IN_PROGRESS,          // Trip started, currently ongoing
    COMPLETED,            // Trip ended successfully
    CANCELLED,            // Booking cancelled
    VEHICLE_RETURNING,    // Customer dropped, vehicle returning to base
    VEHICLE_RETURNED      // Vehicle back at base, ready for next booking
}
