package com.fleetmanagement.backend.controller;

import com.fleetmanagement.backend.dto.BookingDTO;
import com.fleetmanagement.backend.dto.UserResponseDTO;
import com.fleetmanagement.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") 
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    
    @GetMapping("/{id}/dashboard/active-booking")
    public ResponseEntity<BookingDTO> getDashboardBooking(@PathVariable Long id) {
        return userService.getActiveBooking(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build()); 
                // Returns 204 No Content if they have no active booking
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getProfile(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateProfile(@PathVariable Long id, @RequestBody UserResponseDTO data) {
        return ResponseEntity.ok(userService.updateProfile(id, data));
    }

    @GetMapping("/{id}/bookings")
    public ResponseEntity<List<BookingDTO>> getMyBookings(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getMyBookingHistory(id));
    }

    @PostMapping("/{userId}/bookings/{bookingId}/cancel")
    public ResponseEntity<String> cancelBooking(@PathVariable Long userId, @PathVariable Long bookingId) {
        userService.cancelTrip(userId, bookingId);
        return ResponseEntity.ok("Booking cancellation processed successfully.");
    }
}