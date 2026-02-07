package com.fleetmanagement.backend.dto;

import java.math.BigDecimal;

public record TripSummaryDTO(
    String bookingNumber,
    BigDecimal distanceTravelled,
    BigDecimal basePrice,
    BigDecimal additionalCharges,
    BigDecimal finalTotalAmount,
    String status
) {}