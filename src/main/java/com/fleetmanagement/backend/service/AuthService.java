package com.fleetmanagement.backend.service;

import com.fleetmanagement.backend.dao.UserDao;
import com.fleetmanagement.backend.dao.DriverDao;
import com.fleetmanagement.backend.dto.DriverRegisterRequest;
import com.fleetmanagement.backend.dto.LoginRequest;
import com.fleetmanagement.backend.dto.LoginResponse;
import com.fleetmanagement.backend.dto.RegisterRequest;
import com.fleetmanagement.backend.entity.Driver;
import com.fleetmanagement.backend.entity.User;
import com.fleetmanagement.backend.entity.UserRole;
import com.fleetmanagement.backend.security.JwtService;
import com.fleetmanagement.backend.entity.DriverStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private JwtService jwtService;

	private final UserDao userDao;
    private final DriverDao driverDao;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserDao userDao, DriverDao driverDao) {
        this.userDao = userDao;
        this.driverDao = driverDao;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    /**
     * REGISTER CUSTOMER or VEHICLE_OWNER
     */
    public User registerUser(RegisterRequest request) {
        if (userDao.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPhoneNumber(request.phoneNumber());
        user.setRole(request.role()); // CUSTOMER or VEHICLE_OWNER
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setIsActive(true);

        return userDao.save(user);
    }

    /**
     * REGISTER DRIVER (Two-Table Logic)
     */
    @Transactional
    public User registerDriver(DriverRegisterRequest request) {
        if (userDao.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }
        
        // 1. Create and Save the User (The login credentials)
        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPhoneNumber(request.phoneNumber());
        user.setRole(UserRole.DRIVER);
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setIsActive(true);
        
        User savedUser = userDao.save(user);
        
        // 2. Create and Save the Driver Info (The Queue details)
        Driver driverInfo = new Driver();
        driverInfo.setUser(savedUser); // Link to the user we just saved
        driverInfo.setLicenseNumber(request.licenseNumber());
        driverInfo.setLicenseExpiryDate(request.licenseExpiryDate()); // ✅ Added
        driverInfo.setExperienceYears(request.experienceYears()); // ✅ Added
        driverInfo.setMonthlySalary(request.monthlySalary()); // ✅ Added
        driverInfo.setRating(0.0); // ✅ Added
        driverInfo.setTotalTrips(0); // ✅ Added
        driverInfo.setTotalEarnings(BigDecimal.ZERO); // ✅ Added
        driverInfo.setStatus(DriverStatus.ACTIVE);
        driverInfo.setIsAvailable(true);
        driverInfo.setIsBackgroundVerified(false); // ✅ Added
        driverInfo.setIsDocumentVerified(false); // ✅ Added
        driverInfo.setLastActiveAt(LocalDateTime.now()); // Initialize FIFO position
        
        driverDao.save(driverInfo);
        
        return savedUser;
    }




public LoginResponse login(LoginRequest request) {
        User user = userDao.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        // In a full app, you generate a real JWT here. 
        // For now, we mock the token string.

	// GENERATE THE REAL TOKEN
    String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        String mockToken = "eyJhbGciOiJIUzI1NiJ9.mock_token_for_" + user.getEmail();

        return new LoginResponse(
            token, 
            user.getEmail(), 
            user.getRole().name(), 
            user.getId()
        );
    }






}