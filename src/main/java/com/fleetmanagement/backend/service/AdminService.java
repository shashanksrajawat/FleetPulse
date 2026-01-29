package com.fleetmanagement.backend.service;

import com.fleetmanagement.backend.dto.VehicleDTO;
import com.fleetmanagement.backend.dto.DriverDTO;
import com.fleetmanagement.backend.dto.BookingDTO;
import com.fleetmanagement.backend.entity.Vehicle;
import com.fleetmanagement.backend.entity.Driver;
import com.fleetmanagement.backend.entity.Booking;
import com.fleetmanagement.backend.entity.VehicleStatus;
import com.fleetmanagement.backend.repository.VehicleRepository;
import com.fleetmanagement.backend.repository.DriverRepository;
import com.fleetmanagement.backend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final BookingRepository bookingRepository;

    // ==========================================
    // VEHICLE LOGIC
    // ==========================================

    public List<VehicleDTO> findAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(this::mapToVehicleDTO)
                .collect(Collectors.toList());
    }

    public VehicleDTO addNewVehicle(VehicleDTO dto) {
        Vehicle vehicle = new Vehicle();
        vehicle.setRegistrationNumber(dto.registrationNumber());
        vehicle.setBrand(dto.brand());
        vehicle.setModel(dto.model());
        vehicle.setVehicleType(dto.vehicleType());
        vehicle.setSeatingCapacity(dto.seatingCapacity());
        vehicle.setImageUrl(dto.imageUrl());
        
        // Corporate Auto-Configuration
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicle.setIsVerified(true); // Company owned assets are pre-verified
        vehicle.setIsActive(true);
        vehicle.setMileage(0); // New asset initialization
        
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return mapToVehicleDTO(savedVehicle);
    }

    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new RuntimeException("Vehicle not found with id: " + id);
        }
        vehicleRepository.deleteById(id);
    }

    // ==========================================
    // DRIVER LOGIC
    // ==========================================

    public void updateDriverVerification(Long driverId, boolean status) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        driver.setIsVerified(status);
        driverRepository.save(driver);
    }

    // ==========================================
    // DASHBOARD & STATS
    // ==========================================

    public Map<String, Long> getSystemStatistics() {
        return Map.of(
            "totalVehicles", vehicleRepository.count(),
            "activeDrivers", driverRepository.countByIsVerifiedTrue(),
            "pendingBookings", bookingRepository.countByStatus("PENDING")
        );
    }

    // ==========================================
    // HELPER MAPPERS (Internal)
    // ==========================================

    private VehicleDTO mapToVehicleDTO(Vehicle vehicle) {
        return new VehicleDTO(
                vehicle.getId(),
                vehicle.getRegistrationNumber(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getVehicleType(),
                vehicle.getSeatingCapacity(),
                vehicle.getStatus(),
                vehicle.getIsVerified(),
                vehicle.getImageUrl()
        );
    }
    
    // Placeholder methods for Drivers and Bookings
    public List<DriverDTO> findAllDrivers() { return List.of(); }
    public List<BookingDTO> getActiveBookings() { return List.of(); }
    public List<BookingDTO> getBookingHistory() { return List.of(); }
}