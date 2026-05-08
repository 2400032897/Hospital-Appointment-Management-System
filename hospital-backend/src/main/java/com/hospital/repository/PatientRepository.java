package com.hospital.repository;

import com.hospital.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Patient> findByResetPasswordToken(String token);
    List<Patient> findByNameContainingIgnoreCase(String name);
    long countByActive(Boolean active);
}
