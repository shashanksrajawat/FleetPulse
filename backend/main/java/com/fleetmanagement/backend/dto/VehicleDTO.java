package com.fleetmanagement.backend.dto;

import com.fleetmanagement.backend.entity.VehicleStatus;
import com.fleetmanagement.backend.entity.VehicleType;
import java.time.LocalDateTime;

public record VehicleDTO(
    Long id,
    String registrationNumber,
    String brand,
    String model,
    VehicleType vehicleType,
    Integer seatingCapacity,
    VehicleStatus status,
    Boolean isVerified,
    String imageUrl
) {}
