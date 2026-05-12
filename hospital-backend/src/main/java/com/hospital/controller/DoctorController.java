package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.dto.DoctorDTO;
import com.hospital.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getAllDoctors(
            @RequestParam(required = false) String search) {
        List<DoctorDTO> doctors = (search != null && !search.isBlank())
                ? doctorService.searchDoctors(search)
                : doctorService.getAllDoctors();
        return ResponseEntity.ok(ApiResponse.success("Doctors fetched", doctors));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorDTO>> getDoctor(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Doctor fetched", doctorService.getDoctorById(id)));
    }

    @GetMapping("/available")
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getAvailableDoctors() {
        return ResponseEntity.ok(ApiResponse.success("Available doctors", doctorService.getAvailableDoctors()));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getDoctorsByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(ApiResponse.success("Doctors in department", doctorService.getDoctorsByDepartment(departmentId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DoctorDTO>> createDoctor(@RequestBody Map<String, Object> body) {
        DoctorDTO dto = new DoctorDTO();
        dto.setName((String) body.get("name"));
        dto.setEmail((String) body.get("email"));
        dto.setPhone((String) body.get("phone"));
        dto.setSpecialization((String) body.get("specialization"));
        dto.setQualification((String) body.get("qualification"));
        dto.setExperience(body.get("experience") != null ? Integer.parseInt(body.get("experience").toString()) : 0);
        dto.setBio((String) body.get("bio"));
        dto.setConsultationFee((String) body.get("consultationFee"));
        dto.setAvailableDays((String) body.get("availableDays"));
        dto.setAvailableTimeStart((String) body.get("availableTimeStart"));
        dto.setAvailableTimeEnd((String) body.get("availableTimeEnd"));
        if (body.get("departmentId") != null) {
            dto.setDepartmentId(Long.parseLong(body.get("departmentId").toString()));
        }
        String password = (String) body.getOrDefault("password", "Doctor@123");
        return ResponseEntity.ok(ApiResponse.success("Doctor created", doctorService.createDoctor(dto, password)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorDTO>> updateDoctor(
            @PathVariable Long id, @RequestBody DoctorDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Doctor updated", doctorService.updateDoctor(id, dto)));
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<ApiResponse<Void>> toggleAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(doctorService.toggleAvailability(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor deleted"));
    }
}
