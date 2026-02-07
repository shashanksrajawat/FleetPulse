package com.fleetmanagement.backend.entity;

public enum DriverStatus {
	ACTIVE,		//available for work
	INACTIVE,	// not available for work
	ON_TRIP,	// currently on a trip
	SUSPENEDED	// suspended by admin
}
