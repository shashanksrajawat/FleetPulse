package com.fleetmanagement.backend.dto;

import com.fleetmanagement.backend.entity.BookingStatus;
import com.fleetmanagement.backend.entity.PaymentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingDTO(
    Long id,
    String bookingNumber,
    String customerName,
    String vehiclePlate,
    String driverName,
    String sourceLocation,
    String destinationLocation,
    BigDecimal totalAmount,
    BookingStatus status,
    PaymentStatus paymentStatus,
    LocalDateTime scheduledStartTime
) {}