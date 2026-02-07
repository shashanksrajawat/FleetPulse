package com.fleetmanagement.backend.dto;

import java.math.BigDecimal;

//What the Backend sends back to the Home page
public record EstimationResponse(
 Double distanceKm,
 BigDecimal basePrice,
 BigDecimal pricePerKm,
 BigDecimal totalEstimatedPrice,
 String currency
) {}