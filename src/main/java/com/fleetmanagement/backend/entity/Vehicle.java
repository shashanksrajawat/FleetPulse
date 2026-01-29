package com.fleetmanagement.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 20)
    private String registrationNumber;
    
    @Column(nullable = false, length = 50)
    private String brand;  // toyota, honda, swift...
    
    @Column(nullable = false, length = 50)
    private String model; // camry, civic
    
    @Column(nullable = false)
    private Integer year;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VehicleType vehicleType;
    
    @Column(length = 20)
    private String color;
    
    @Column(nullable = false)
    private Integer seatingCapacity;   
    
    @Column(nullable = false)
    private Integer mileage;
    
    @Column(length = 30)
    private String insuranceNumber;
    
    @Column
    private LocalDateTime insuranceExpiryDate;
    
    @Column(length = 30)
    private String rcNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private VehicleStatus status;
    
    @Column
    private String imageUrl;

    
    @Column(nullable = false)
    private Boolean isVerified = false;	// the admin verifies it
    
    @Column(nullable = false)
    private Boolean isActive = true; // currently available for use by vehicle_owner 
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}