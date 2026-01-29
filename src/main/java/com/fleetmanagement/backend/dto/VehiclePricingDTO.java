package com.fleetmanagement.backend.dto;

import com.fleetmanagement.backend.entity.VehicleType;
import java.math.BigDecimal;

public record VehiclePricingDTO(
    Long id,
    VehicleType vehicleType,
    BigDecimal pricePerKm,
    BigDecimal pricePerDay,
    BigDecimal basePrice
) {}