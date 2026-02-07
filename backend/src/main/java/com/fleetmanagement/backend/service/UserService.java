package com.fleetmanagement.backend.service;

import com.fleetmanagement.backend.dao.UserDao;
import com.fleetmanagement.backend.dto.BookingDTO;
import com.fleetmanagement.backend.dto.UserResponseDTO;
import com.fleetmanagement.backend.entity.Booking;
import com.fleetmanagement.backend.entity.BookingStatus;
import com.fleetmanagement.backend.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserDao userDao;
    private final BookingService bookingService;

    public UserService(UserDao userDao, BookingService bookingService) {
        this.userDao = userDao;
        this.bookingService = bookingService;
    }

    public UserResponseDTO getProfile(Long userId) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return mapToDTO(user);
    }

    @Transactional
    public UserResponseDTO updateProfile(Long userId, UserResponseDTO data) {
        User user = userDao.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFirstName(data.firstName());
        user.setLastName(data.lastName());
        user.setPhoneNumber(data.phoneNumber());
        
        return mapToDTO(userDao.save(user));
    }

    public List<BookingDTO> getMyBookingHistory(Long userId) {
        return bookingService.getUserBookings(userId).stream()
                .map(this::mapToBookingDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelTrip(Long userId, Long bookingId) {
        // Security check: Ensure the booking actually belongs to the user requesting cancellation
        Booking booking = bookingService.getUserBookings(userId).stream()
                .filter(b -> b.getId().equals(bookingId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Booking not found or unauthorized"));

        bookingService.cancelBooking(booking.getId());
    }

    private UserResponseDTO mapToDTO(User user) {
        return new UserResponseDTO(
                user.getId(), 
                user.getFirstName(), 
                user.getLastName(), 
                user.getEmail(), 
                user.getPhoneNumber(),
                user.getRole(),
                user.getIsActive(), 
                user.getCreatedAt()
        );
    }

    private BookingDTO mapToBookingDTO(Booking b) {
        return new BookingDTO(
                b.getId(), 
                b.getBookingNumber(), 
                b.getCustomer().getFirstName() + " " + b.getCustomer().getLastName(),
                b.getVehicle() != null ? b.getVehicle().getRegistrationNumber() : "PENDING",
                b.getDriver() != null ? b.getDriver().getUser().getFirstName() : "PENDING",
                b.getSourceLocation(), 
                b.getDestinationLocation(),
                b.getTotalAmount() != null ? b.getTotalAmount() : b.getEstimatedPrice(),
                b.getStatus(), 
                b.getPaymentStatus(), 
                b.getScheduledStartTime()
        );
    }
    
          
 // DASHBOARD ENDPOINT: Returns the single active booking
    public Optional<BookingDTO> getActiveBooking(Long userId) {
        return bookingService.getUserBookings(userId).stream()
                .filter(b -> b.getStatus() != BookingStatus.COMPLETED && 
                             b.getStatus() != BookingStatus.CANCELLED)
                .findFirst() // Ensures we only get the current one
                .map(this::mapToBookingDTO);
    }

      
}
