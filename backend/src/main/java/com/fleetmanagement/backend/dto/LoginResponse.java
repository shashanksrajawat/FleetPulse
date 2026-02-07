package com.fleetmanagement.backend.dto;

public record LoginResponse(
		String token,
		String email,
		String role,
		Long userId,
		String firstName,
		String lastName,
		String phoneNumber,
		boolean isActive) {
}