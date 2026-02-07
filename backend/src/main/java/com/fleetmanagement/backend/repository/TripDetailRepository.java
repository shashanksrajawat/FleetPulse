package com.fleetmanagement.backend.repository;

import com.fleetmanagement.backend.entity.TripDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripDetailRepository extends JpaRepository<TripDetail, Long> {
    // Basic CRUD methods (save, findById, etc.) are inherited from JpaRepository
}