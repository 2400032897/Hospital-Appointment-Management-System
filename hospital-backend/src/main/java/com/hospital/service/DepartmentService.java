package com.hospital.service;

import com.hospital.dto.DepartmentDTO;
import com.hospital.entity.Department;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;

    public DepartmentService(DepartmentRepository departmentRepository, DoctorRepository doctorRepository) {
        this.departmentRepository = departmentRepository;
        this.doctorRepository = doctorRepository;
    }

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public DepartmentDTO getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        return mapToDTO(department);
    }

    public DepartmentDTO createDepartment(DepartmentDTO dto) {
        if (departmentRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("Department already exists: " + dto.getName());
        }
        Department department = Department.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .icon(dto.getIcon())
                .build();
        return mapToDTO(departmentRepository.save(department));
    }

    public DepartmentDTO updateDepartment(Long id, DepartmentDTO dto) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        if (dto.getName() != null) department.setName(dto.getName());
        if (dto.getDescription() != null) department.setDescription(dto.getDescription());
        if (dto.getIcon() != null) department.setIcon(dto.getIcon());
        if (dto.getActive() != null) department.setActive(dto.getActive());
        return mapToDTO(departmentRepository.save(department));
    }

    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department", "id", id);
        }
        departmentRepository.deleteById(id);
    }

    private DepartmentDTO mapToDTO(Department dept) {
        int doctorCount = doctorRepository.findByDepartmentId(dept.getId()).size();
        return DepartmentDTO.builder()
                .id(dept.getId())
                .name(dept.getName())
                .description(dept.getDescription())
                .icon(dept.getIcon())
                .active(dept.getActive())
                .doctorCount(doctorCount)
                .createdAt(dept.getCreatedAt())
                .build();
    }
}
