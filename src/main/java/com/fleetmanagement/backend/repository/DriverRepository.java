package com.fleetmanagement.backend.repository;

import com.fleetmanagement.backend.entity.Driver;
import com.fleetmanagement.backend.entity.DriverStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {
// Find driver by the linked User's ID
    Optional<Driver> findByUserId(Long userId);   

//this is the cahnge for implementing queue.
// Find all ACTIVE & AVAILABLE drivers, ordered by who has been waiting the longest
List<Driver> findByStatusAndIsAvailableTrueOrderByLastActiveAtAsc(DriverStatus status); 

    // Updated to match your specific Enum statuses
    List<Driver> findByStatusAndIsAvailableTrue(DriverStatus status);

	// Check if license is already registered
    boolean existsByLicenseNumber(String licenseNumber);

}