package com.fleetmanagement.backend.dao.impl;

import com.fleetmanagement.backend.dao.VehicleDao;
import com.fleetmanagement.backend.entity.Vehicle;
import com.fleetmanagement.backend.entity.VehicleStatus;
import com.fleetmanagement.backend.entity.VehicleType;
import com.fleetmanagement.backend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class VehicleDaoImpl implements VehicleDao {

    private final VehicleRepository vehicleRepository;

    @Autowired
    public VehicleDaoImpl(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    public Vehicle save(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Override
    public Optional<Vehicle> findById(Long id) {
        return vehicleRepository.findById(id);
    }

    @Override
    public List<Vehicle> findAvailableVehiclesPool(VehicleType type) {
        // Here we use the status 'AVAILABLE' from your Enum
        return vehicleRepository.findByVehicleTypeAndStatusAndIsVerifiedTrueAndIsActiveTrue(
            type, 
            VehicleStatus.AVAILABLE
        );
    }

    
    /*
    @Override
    public List<Vehicle> findByOwner(Long ownerId) {
        return vehicleRepository.findByOwnerId(ownerId);
    }
    */

    @Override
    public void deleteById(Long id) {
        vehicleRepository.deleteById(id);
    }
}