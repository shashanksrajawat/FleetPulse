package com.fleetmanagement.backend.dao;

import com.fleetmanagement.backend.entity.Driver;
import com.fleetmanagement.backend.entity.DriverStatus;
import java.util.List;
import java.util.Optional;

public interface DriverDao {
    Driver save(Driver driver);
    Optional<Driver> findById(Long id);
    Optional<Driver> findByUserId(Long userId);
    List<Driver> findAll();
    List<Driver> findAvailableDrivers();
    void deleteById(Long id);
    Optional<Driver> getNextAvailableDriver();
}