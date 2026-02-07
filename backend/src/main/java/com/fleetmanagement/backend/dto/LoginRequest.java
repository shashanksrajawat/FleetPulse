package com.fleetmanagement.backend.dto;

//1. Shared Login (Used by Everyone)
public record LoginRequest(
 String email, 
 String password
) {}