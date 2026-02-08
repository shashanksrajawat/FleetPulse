package com.fleetmanagement.backend.entity;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "drivers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Driver {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @Column(nullable = false, unique = true, length = 20)
    private String licenseNumber;
    
    @Column(nullable = false)
    private LocalDate licenseExpiryDate;
       
    @Column(nullable = false)
    private Integer experienceYears;    
    
    @Column
    private Double rating; // Average rating (0.00 to 5.00)
    
    @Column(nullable = false)
    private Integer totalTrips = 0;
    
    @Column
    private BigDecimal monthlySalary; // Monthly salary expectation or earned
    
    @Column
    private BigDecimal totalEarnings = BigDecimal.ZERO; // Lifetime earnings
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DriverStatus status;
    
    @Column(nullable = false)
    private Boolean isAvailable = true;
    
    
    /*
     * later will decide depending on the time left
    // Identity/Verification Documents
    @Column(length = 20)
    private String aadhaarNumber;
    
    @Column(length = 20)
    private String panNumber;
    
    @Column
    private String licenseDocumentUrl; // Uploaded license document
    
    @Column
    private String aadhaarDocumentUrl;
    
    @Column
    private String panDocumentUrl;
    
    @Column
    private String policeVerificationDocumentUrl;
    
    */
    
    @Column(nullable = false)
    private Boolean backgroundVerified = false;
    
    @Column(nullable = false)
    private Boolean documentVerified = false;
    
 
    @Column
    private LocalDateTime lastActiveAt;
    
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

