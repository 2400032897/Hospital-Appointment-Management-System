package com.hospital.service;

import com.hospital.dto.DoctorDTO;
import com.hospital.entity.Department;
import com.hospital.entity.Doctor;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorService(DoctorRepository doctorRepository, 
                         DepartmentRepository departmentRepository, 
                         PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public DoctorDTO getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        return mapToDTO(doctor);
    }

    public List<DoctorDTO> getAllDoctors() {
        return doctorRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DoctorDTO> getAvailableDoctors() {
        return doctorRepository.findByAvailableTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DoctorDTO> getDoctorsByDepartment(Long departmentId) {
        return doctorRepository.findByDepartmentId(departmentId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<DoctorDTO> searchDoctors(String query) {
        return doctorRepository
                .findBySpecializationContainingIgnoreCaseOrNameContainingIgnoreCase(query, query)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public DoctorDTO createDoctor(DoctorDTO dto, String password) {
        if (doctorRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + dto.getEmail());
        }
        Doctor doctor = Doctor.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(password))
                .phone(dto.getPhone())
                .specialization(dto.getSpecialization())
                .qualification(dto.getQualification())
                .experience(dto.getExperience() != null ? dto.getExperience() : 0)
                .bio(dto.getBio())
                .consultationFee(dto.getConsultationFee())
                .availableDays(dto.getAvailableDays())
                .availableTimeStart(dto.getAvailableTimeStart())
                .availableTimeEnd(dto.getAvailableTimeEnd())
                .build();

        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", dto.getDepartmentId()));
            doctor.setDepartment(dept);
        }
        return mapToDTO(doctorRepository.save(doctor));
    }

    public DoctorDTO updateDoctor(Long id, DoctorDTO dto) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        if (dto.getName() != null) doctor.setName(dto.getName());
        if (dto.getPhone() != null) doctor.setPhone(dto.getPhone());
        if (dto.getSpecialization() != null) doctor.setSpecialization(dto.getSpecialization());
        if (dto.getQualification() != null) doctor.setQualification(dto.getQualification());
        if (dto.getExperience() != null) doctor.setExperience(dto.getExperience());
        if (dto.getBio() != null) doctor.setBio(dto.getBio());
        if (dto.getConsultationFee() != null) doctor.setConsultationFee(dto.getConsultationFee());
        if (dto.getAvailableDays() != null) doctor.setAvailableDays(dto.getAvailableDays());
        if (dto.getAvailableTimeStart() != null) doctor.setAvailableTimeStart(dto.getAvailableTimeStart());
        if (dto.getAvailableTimeEnd() != null) doctor.setAvailableTimeEnd(dto.getAvailableTimeEnd());
        if (dto.getAvailable() != null) doctor.setAvailable(dto.getAvailable());
        if (dto.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(dto.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", dto.getDepartmentId()));
            doctor.setDepartment(dept);
        }
        return mapToDTO(doctorRepository.save(doctor));
    }

    public String toggleAvailability(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        doctor.setAvailable(!doctor.getAvailable());
        doctorRepository.save(doctor);
        return "Availability updated to: " + (doctor.getAvailable() ? "Available" : "Unavailable");
    }

    public String toggleDoctorStatus(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", id));
        doctor.setActive(!doctor.getActive());
        doctorRepository.save(doctor);
        return "Doctor status updated";
    }

    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doctor", "id", id);
        }
        doctorRepository.deleteById(id);
    }

    public long getTotalDoctors() {
        return doctorRepository.count();
    }

    public DoctorDTO mapToDTO(Doctor doctor) {
        return DoctorDTO.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .specialization(doctor.getSpecialization())
                .qualification(doctor.getQualification())
                .experience(doctor.getExperience())
                .bio(doctor.getBio())
                .departmentId(doctor.getDepartment() != null ? doctor.getDepartment().getId() : null)
                .departmentName(doctor.getDepartment() != null ? doctor.getDepartment().getName() : null)
                .available(doctor.getAvailable())
                .active(doctor.getActive())
                .consultationFee(doctor.getConsultationFee())
                .availableDays(doctor.getAvailableDays())
                .availableTimeStart(doctor.getAvailableTimeStart())
                .availableTimeEnd(doctor.getAvailableTimeEnd())
                .createdAt(doctor.getCreatedAt())
                .build();
    }
}
