package com.fleetmanagement.backend.dto;

import com.fleetmanagement.backend.entity.UserRole;
import jakarta.validation.constraints.*;

/**
 * Registration request DTO for CUSTOMER and VEHICLE_OWNER roles.
 * DRIVER registration uses a separate DTO (DriverRegisterRequest) 
 * because drivers require additional information.
 */
public record RegisterRequest(
    
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
    
    @NotNull(message = "Role is required")
    UserRole role // Frontend should send CUSTOMER or VEHICLE_OWNER
) {}