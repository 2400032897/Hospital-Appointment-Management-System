package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.dto.AppointmentDTO;
import com.hospital.dto.DoctorDTO;
import com.hospital.dto.PatientDTO;
import com.hospital.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard data", adminService.getDashboardStats()));
    }

    @GetMapping("/patients")
    public ResponseEntity<ApiResponse<List<PatientDTO>>> getAllPatients() {
        return ResponseEntity.ok(ApiResponse.success("Patients fetched", adminService.getAllPatients()));
    }

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<DoctorDTO>>> getAllDoctors() {
        return ResponseEntity.ok(ApiResponse.success("Doctors fetched", adminService.getAllDoctors()));
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAllAppointments() {
        return ResponseEntity.ok(ApiResponse.success("Appointments fetched", adminService.getAllAppointments()));
    }

    @PostMapping("/doctors")
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
        return ResponseEntity.ok(ApiResponse.success("Doctor created", adminService.createDoctor(dto, password)));
    }

    @PutMapping("/patients/{id}/toggle")
    public ResponseEntity<ApiResponse<Void>> togglePatient(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(adminService.togglePatientStatus(id)));
    }

    @PutMapping("/doctors/{id}/toggle")
    public ResponseEntity<ApiResponse<Void>> toggleDoctor(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(adminService.toggleDoctorStatus(id)));
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePatient(@PathVariable Long id) {
        adminService.deletePatient(id);
        return ResponseEntity.ok(ApiResponse.success("Patient deleted"));
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id) {
        adminService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor deleted"));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<Map<String, Object>>> generateReport(
            @RequestParam String startDate, @RequestParam String endDate) {
        return ResponseEntity.ok(ApiResponse.success("Report generated",
                adminService.generateReport(startDate, endDate)));
    }
}
