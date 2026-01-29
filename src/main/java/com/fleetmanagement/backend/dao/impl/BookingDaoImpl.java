package com.fleetmanagement.backend.dao.impl;

import com.fleetmanagement.backend.dao.BookingDao;
import com.fleetmanagement.backend.entity.Booking;
import com.fleetmanagement.backend.entity.BookingStatus;
import com.fleetmanagement.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Repository
public class BookingDaoImpl implements BookingDao {

    private final BookingRepository bookingRepository;

    @Autowired
    public BookingDaoImpl(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public Booking save(Booking booking) {
        return bookingRepository.save(booking);
    }

    @Override
    public Optional<Booking> findByBookingNumber(String bookingNumber) {
        return bookingRepository.findByBookingNumber(bookingNumber);
    }

    @Override
    public List<Booking> findActiveBookings() {
        return bookingRepository.findByStatusIn(Arrays.asList(
            BookingStatus.PENDING, 
            BookingStatus.DRIVER_ASSIGNED, 
            BookingStatus.CONFIRMED, 
            BookingStatus.IN_PROGRESS,
            BookingStatus.VEHICLE_RETURNING
        ));
    }

    /*
     * this is fro later stages i guess.
    @Override
    public void updateStatus(Long bookingId, BookingStatus status) {
        bookingRepository.findById(bookingId).ifPresent(booking -> {
            booking.setStatus(status);
            bookingRepository.save(booking);
        });
    }
    */
    
    
    //later fix this
    @Override
    public void updateStatus(Long bookingId, BookingStatus status) {
     
    }
    

    @Override
    public Optional<Booking> findById(Long id) {
        return bookingRepository.findById(id);
    }
}