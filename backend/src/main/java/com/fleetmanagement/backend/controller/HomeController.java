package com.fleetmanagement.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fleetmanagement.backend.dto.EstimationResponse;
import com.fleetmanagement.backend.dto.EstimationRequest;
import com.fleetmanagement.backend.service.BookingService;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class HomeController {
    private final BookingService bookingService;

    public HomeController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/estimate")
    public ResponseEntity<EstimationResponse> getEstimate(@RequestBody EstimationRequest request) {
        return ResponseEntity.ok(bookingService.getEstimation(request));
    }
}