package com.fleetmanagement.backend.dto;

import java.time.LocalDateTime;

import com.fleetmanagement.backend.entity.UserRole;

public record UserResponseDTO(
	    Long id,
	    String firstName,
	    String lastName,
	    String email,
	    String phoneNumber,
	    UserRole role,
	    Boolean isActive,
	    LocalDateTime createdAt
	) {}