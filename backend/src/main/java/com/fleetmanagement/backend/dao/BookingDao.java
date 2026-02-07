package com.fleetmanagement.backend.dao;

import com.fleetmanagement.backend.entity.Booking;
import com.fleetmanagement.backend.entity.BookingStatus;
import java.util.List;
import java.util.Optional;

public interface BookingDao {
    Booking save(Booking booking);
    Optional<Booking> findById(Long id);
    Optional<Booking> findByBookingNumber(String bookingNumber);
    List<Booking> findActiveBookings(); // Returns IN_PROGRESS, DRIVER_ASSIGNED, etc.
    void updateStatus(Long bookingId, BookingStatus status);
    
    // New methods for History/Dashboards
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByDriverUserId(Long userId);
    List<Booking> findByDriverId(Long driverId);
    
    //for admin purpose
    List<Booking> findBookingHistory();
}