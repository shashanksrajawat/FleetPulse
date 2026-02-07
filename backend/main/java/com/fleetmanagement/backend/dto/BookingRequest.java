package com.fleetmanagement.backend.dto;

import com.fleetmanagement.backend.entity.VehicleType;
import java.time.LocalDateTime;

public record BookingRequest(
    Long customerId,
    String sourceLocation,
    String destinationLocation,
    VehicleType vehicleType,
    LocalDateTime scheduledStartTime,
    Double distance // Received from the frontend Map API
) {}