package com.fleetmanagement.backend.dao.impl;

import com.fleetmanagement.backend.dao.DriverDao;
import com.fleetmanagement.backend.entity.Driver;
import com.fleetmanagement.backend.entity.DriverStatus;
import com.fleetmanagement.backend.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class DriverDaoImpl implements DriverDao {

    private final DriverRepository driverRepository;

    @Autowired
    public DriverDaoImpl(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    @Override
    public Driver save(Driver driver) {
        // This handles both Create and Update operations
        return driverRepository.save(driver);
    }

    @Override
    public Optional<Driver> findById(Long id) {
        return driverRepository.findById(id);
    }

    @Override
    public Optional<Driver> findByUserId(Long userId) {
        return driverRepository.findByUserId(userId);
    }

    @Override
    public List<Driver> findAll() {
        return driverRepository.findAll();
    }

    @Override
    public List<Driver> findAvailableDrivers() {
        // FIXED: Now uses ordering by lastActiveAt (FIFO queue)
        return driverRepository.findByStatusAndIsAvailableTrueOrderByLastActiveAtAsc(DriverStatus.ACTIVE);
    }

    @Override
    public void deleteById(Long id) {
        driverRepository.deleteById(id);
    }

    @Override
    public Optional<Driver> getNextAvailableDriver() {
        // Get the driver at the "Front" of the queue (Waiting the longest)
        return driverRepository.findByStatusAndIsAvailableTrueOrderByLastActiveAtAsc(DriverStatus.ACTIVE)
                .stream().findFirst();
    }
    
    /*
     * will check later
    @Override
    public boolean existsByLicense(String licenseNumber) {
        return driverRepository.existsByLicenseNumber(licenseNumber);
    }
    */
}