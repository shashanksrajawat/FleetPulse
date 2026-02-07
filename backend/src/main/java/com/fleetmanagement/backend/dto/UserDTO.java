package com.fleetmanagement.backend.dto;

import com.fleetmanagement.backend.entity.UserRole;
import java.time.LocalDateTime;

public record UserDTO(
    Long id,
    String email,
    String firstName,
    String lastName,
    String phoneNumber,
    UserRole role,
    Boolean isActive,
    LocalDateTime createdAt
) {}