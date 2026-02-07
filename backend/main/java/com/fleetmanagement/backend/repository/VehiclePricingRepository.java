package com.fleetmanagement.backend.repository;

import com.fleetmanagement.backend.entity.VehiclePricing;
import com.fleetmanagement.backend.entity.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VehiclePricingRepository extends JpaRepository<VehiclePricing, Long> {
    
    // Crucial for the Booking calculation logic
    Optional<VehiclePricing> findByVehicleType(VehicleType vehicleType);
}