package com.fleetmanagement.backend.repository;

import com.fleetmanagement.backend.entity.Vehicle;
import com.fleetmanagement.backend.entity.VehicleStatus;
import com.fleetmanagement.backend.entity.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

//remove this
// The "Pool" Query: 
    // Finds vehicles that are of the right type, marked as AVAILABLE, 
    // verified by admin, and not disabled by the owner.
    List<Vehicle> findByVehicleTypeAndStatusAndIsVerifiedTrueAndIsActiveTrue(
        VehicleType vehicleType, 
        VehicleStatus status
    );

//add this for queuing
// Find AVAILABLE vehicles of a specific type, ordered by oldest update (longest idle)
    List<Vehicle> findByVehicleTypeAndStatusAndIsVerifiedTrueAndIsActiveTrueOrderByUpdatedAtAsc(
        VehicleType type, VehicleStatus status
    );

    //to be implemented later
   // List<Vehicle> findByOwnerId(Long ownerId);

    boolean existsByRegistrationNumber(String registrationNumber);
}