package com.fleetmanagement.backend.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record DriverRegisterRequest(
    
    // ✅ Validation annotations on DTO
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    String firstName,
    
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    String lastName,
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
    String password,
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    String phoneNumber,
    
    @NotBlank(message = "License number is required")
    @Size(min = 5, max = 20, message = "License number must be between 5 and 20 characters")
    String licenseNumber,
    
    @NotNull(message = "License expiry date is required")
    @Future(message = "License must not be expired")
    LocalDate licenseExpiryDate,
    
    @NotNull(message = "Experience years is required")
    @Min(value = 0, message = "Experience cannot be negative")
    @Max(value = 50, message = "Experience seems unrealistic")
    Integer experienceYears,
    
    @NotNull(message = "Monthly salary is required")
    @DecimalMin(value = "0.01", message = "Salary must be greater than 0")
    @DecimalMax(value = "1000000.00", message = "Salary seems unrealistic")
    BigDecimal monthlySalary
    
) {}