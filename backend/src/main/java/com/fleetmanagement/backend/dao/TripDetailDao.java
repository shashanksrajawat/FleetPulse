package com.fleetmanagement.backend.dao;

import com.fleetmanagement.backend.entity.TripDetail;
import java.util.Optional;

public interface TripDetailDao {
    TripDetail save(TripDetail tripDetail);
    Optional<TripDetail> findByBookingId(Long bookingId);
}