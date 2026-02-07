package com.fleetmanagement.backend.dao;

import com.fleetmanagement.backend.entity.User;
import java.util.List;
import java.util.Optional;

public interface UserDao {
    User save(User user);
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    List<User> findAllActiveUsers();
    void deleteById(Long id);
    boolean existsByEmail(String email);
}
