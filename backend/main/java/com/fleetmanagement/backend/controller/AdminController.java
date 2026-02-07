package com.fleetmanagement.backend.controller;

import com.fleetmanagement.backend.dto.VehicleDTO;
import com.fleetmanagement.backend.dto.DriverDTO;
import com.fleetmanagement.backend.dto.BookingDTO;
import com.fleetmanagement.backend.service.AdminService;
import com.fleetmanagement.backend.entity.VehicleType;
import com.fleetmanagement.backend.entity.VehicleStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AdminController manages the high-level fleet operations.
 * Protected by JWT and Role-Based Access Control (RBAC).
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // ==========================================
    // VEHICLE MANAGEMENT (Company Assets)
    // ==========================================

    @GetMapping("/vehicles")
    public ResponseEntity<List<VehicleDTO>> getAllVehicles() {
        return ResponseEntity.ok(adminService.findAllVehicles());
    }

    @PostMapping("/vehicles/add")
    public ResponseEntity<VehicleDTO> addCompanyVehicle(@RequestBody VehicleDTO vehicleDTO) {
        // Company-owned vehicles are verified by default upon entry
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminService.addNewVehicle(vehicleDTO));
    }

    @DeleteMapping("/vehicles/{id}")
    public ResponseEntity<Void> decommissionVehicle(@PathVariable Long id) {
        adminService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // DRIVER MANAGEMENT (Personnel)
    // ==========================================

    @GetMapping("/drivers")
    public ResponseEntity<List<DriverDTO>> getAllDrivers() {
        return ResponseEntity.ok(adminService.findAllDrivers());
    }

    @PatchMapping("/drivers/{id}/approve")
    public ResponseEntity<Void> approveDriver(@PathVariable Long id) {
        adminService.updateDriverVerification(id, true);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/drivers/{id}/suspend")
    public ResponseEntity<Void> suspendDriver(@PathVariable Long id) {
        adminService.updateDriverVerification(id, false);
        return ResponseEntity.ok().build();
    }

    // ==========================================
    // BOOKING OVERSIGHT (Logistics)
    // ==========================================

    @GetMapping("/bookings/current")
    public ResponseEntity<List<BookingDTO>> getActiveBookings() {
        return ResponseEntity.ok(adminService.getActiveBookings());
    }

    @GetMapping("/bookings/history")
    public ResponseEntity<List<BookingDTO>> getPastBookings() {
        return ResponseEntity.ok(adminService.getBookingHistory());
    }

    // ==========================================
    // SYSTEM HEALTH / DASHBOARD
    // ==========================================

    @GetMapping("/stats")
    public ResponseEntity<?> getFleetStats() {
        return ResponseEntity.ok(adminService.getSystemStatistics());
    }
}