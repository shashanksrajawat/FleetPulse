package com.fleetmanagement.backend.dto;

import com.fleetmanagement.backend.entity.DriverStatus;
import java.math.BigDecimal;
import java.time.LocalDate;

public record DriverDTO(
    Long id,
    Long userId,
    String fullName, // Combined firstName and lastName
    String email,
    String licenseNumber,
    LocalDate licenseExpiryDate,
    Integer experienceYears,
    Double rating,
    DriverStatus status,
    Boolean isAvailable,
    Boolean isDocumentVerified
) {}