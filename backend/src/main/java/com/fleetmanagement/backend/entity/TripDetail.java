package com.fleetmanagement.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "trip_details")
@Data
public class TripDetail {

    @Id
    private Long bookingId; // Shared ID with Booking

    @OneToOne
    @MapsId
    @JoinColumn(name = "booking_id")
    private Booking booking;

  //  @Column(nullable = false)
   // private String startOtp; // Generated when driver "Arrives"

    @Column(precision = 10, scale = 2)
    private BigDecimal startKm;

    @Column(precision = 10, scale = 2)
    private BigDecimal endKm;

    // You can also store images of the odometer here later
    // private String startOdometerImageUrl;
    // private String endOdometerImageUrl;
}