package com.fleetmanagement.backend.dao;

import com.fleetmanagement.backend.entity.VehiclePricing;
import com.fleetmanagement.backend.entity.VehicleType;
import java.util.List;
import java.util.Optional;

public interface VehiclePricingDao {
    VehiclePricing save(VehiclePricing pricing);
    Optional<VehiclePricing> findByVehicleType(VehicleType type);
    List<VehiclePricing> findAll();
}