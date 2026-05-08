package com.hospital.repository;

import com.hospital.entity.Doctor;
import com.hospital.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Doctor> findByResetPasswordToken(String token);
    List<Doctor> findByAvailableTrue();
    List<Doctor> findByDepartment(Department department);
    List<Doctor> findByDepartmentId(Long departmentId);
    List<Doctor> findBySpecializationContainingIgnoreCaseOrNameContainingIgnoreCase(String spec, String name);
    List<Doctor> findByActiveTrue();
    long countByActive(Boolean active);
}
