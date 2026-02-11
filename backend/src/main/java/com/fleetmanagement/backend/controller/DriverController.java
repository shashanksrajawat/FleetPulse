
package com.fleetmanagement.backend.controller;

import com.fleetmanagement.backend.dto.BookingDTO;
import com.fleetmanagement.backend.entity.Driver;
import com.fleetmanagement.backend.service.DriverService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<Driver> getProfile(@PathVariable Long userId) {
        Driver driver = driverService.getDriverProfile(userId);
        return ResponseEntity.ok(driver);
    }

    // Dashboard: Returns assigned trips for the logged-in driver
    @GetMapping("/{userId}/dashboard")
    public ResponseEntity<List<BookingDTO>> getDashboard(@PathVariable Long userId) {
        return ResponseEntity.ok(driverService.getAssignedBookings(userId));
    }

    @PostMapping("/bookings/{bookingId}/accept")
    public ResponseEntity<String> acceptTrip(@PathVariable Long bookingId) {
        driverService.acceptBooking(bookingId);
        return ResponseEntity.ok("Trip accepted. Please start the trip when you reach the customer.");
    }

    @PostMapping("/trip/start")
    public ResponseEntity<String> startTrip(@RequestBody com.fleetmanagement.backend.dto.TripStartRequestDTO request) {
        driverService.startTrip(request);
        return ResponseEntity.ok("Trip started successfully.");
    }

    @PostMapping("/trip/end")
    public ResponseEntity<String> completeTrip(@RequestBody com.fleetmanagement.backend.dto.TripEndRequestDTO request) {
        driverService.completeTrip(request);
        return ResponseEntity.ok("Trip completed successfully. Resources released.");
    }

    @PostMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<String> cancelTrip(@PathVariable Long bookingId) {
        driverService.driverCancelBooking(bookingId);
        return ResponseEntity.ok("Trip cancelled and reassigned silently.");
    }

    // NEW: History Endpoint (Restored)
    @GetMapping("/{userId}/history")
    public ResponseEntity<List<BookingDTO>> getTripHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(driverService.getDriverTripHistory(userId));
    }
}