package com.fleetmanagement.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fleetmanagement.backend.dto.BookingRequest;
import com.fleetmanagement.backend.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmBooking(@RequestBody BookingRequest request) {
        try {
            return new ResponseEntity<>(bookingService.createBooking(request), HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @org.springframework.web.bind.annotation.GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBookings(@org.springframework.web.bind.annotation.PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @org.springframework.web.bind.annotation.GetMapping("/driver/{driverId}")
    public ResponseEntity<?> getDriverBookings(@org.springframework.web.bind.annotation.PathVariable Long driverId) {
        return ResponseEntity.ok(bookingService.getDriverBookings(driverId));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@org.springframework.web.bind.annotation.PathVariable Long id) {
        try {
            return ResponseEntity.ok(bookingService.cancelBooking(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}