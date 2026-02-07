package com.fleetmanagement.backend.dao.impl;

import com.fleetmanagement.backend.dao.VehiclePricingDao;
import com.fleetmanagement.backend.entity.VehiclePricing;
import com.fleetmanagement.backend.entity.VehicleType;
import com.fleetmanagement.backend.repository.VehiclePricingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class VehiclePricingDaoImpl implements VehiclePricingDao {

    private final VehiclePricingRepository repository;

    @Autowired
    public VehiclePricingDaoImpl(VehiclePricingRepository repository) {
        this.repository = repository;
    }

    @Override
    public VehiclePricing save(VehiclePricing pricing) {
        return repository.save(pricing);
    }

    @Override
    public Optional<VehiclePricing> findByVehicleType(VehicleType type) {
        return repository.findByVehicleType(type);
    }

    @Override
    public List<VehiclePricing> findAll() {
        return repository.findAll();
    }
}