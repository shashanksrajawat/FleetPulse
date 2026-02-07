package com.fleetmanagement.backend.dto;

import com.fleetmanagement.backend.entity.VehicleType;
import java.time.LocalDateTime;

// What the React Home page sends
public record EstimationRequest(
    String source,
    String destination,
    VehicleType vehicleType,
    LocalDateTime scheduledTime
) {}


