package com.fleetmanagement.backend.repository;

import com.fleetmanagement.backend.entity.Booking;
import com.fleetmanagement.backend.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    Optional<Booking> findByBookingNumber(String bookingNumber);
    
    List<Booking> findByCustomerId(Long customerId);
    
    // Find bookings that are currently using resources
    List<Booking> findByStatusIn(List<BookingStatus> statuses);
    
    // For the "Queue" - see which drivers are about to become free
    List<Booking> findByDriverIdAndStatus(Long driverId, BookingStatus status);
    
    // Find all bookings for a driver (History)
    List<Booking> findByDriverId(Long driverId);
    
    // Find all bookings for a driver using their User ID (Frontend friendly)
    List<Booking> findByDriver_User_Id(Long userId);

    // Correct: uses the BookingStatus Enum type
    long countByStatus(BookingStatus status);
}