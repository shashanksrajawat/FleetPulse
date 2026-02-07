package com.fleetmanagement.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record TripStartRequestDTO(
    @NotNull(message = "Booking ID is required")
    Long bookingId,

  //  @NotBlank(message = "OTP is required to start the trip")
   // String otp,

    @NotNull(message = "Starting KM reading is required")
    @PositiveOrZero(message = "KM reading cannot be negative")
    BigDecimal startKm
) {}