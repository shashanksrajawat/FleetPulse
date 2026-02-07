package com.fleetmanagement.backend.dao;

import com.fleetmanagement.backend.entity.Vehicle;
import com.fleetmanagement.backend.entity.VehicleStatus;
import com.fleetmanagement.backend.entity.VehicleType;
import java.util.List;
import java.util.Optional;

public interface VehicleDao {
    Vehicle save(Vehicle vehicle);
    Optional<Vehicle> findById(Long id);
    List<Vehicle> findAvailableVehiclesPool(VehicleType type);
  //  List<Vehicle> findByOwner(Long ownerId);		to be added later 
    void deleteById(Long id);
}