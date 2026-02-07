package com.fleetmanagement.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record TripEndRequestDTO(
    @NotNull(message = "Booking ID is required")
    Long bookingId,

    @NotNull(message = "Ending KM reading is required")
    @PositiveOrZero(message = "KM reading cannot be negative")
    BigDecimal endKm,

    @PositiveOrZero(message = "Additional charges cannot be negative")
    BigDecimal additionalCharges // For tolls, parking, etc.
) {}