package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.dto.PatientDTO;
import com.hospital.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientDTO>> getPatient(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Patient fetched", patientService.getPatientById(id)));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ApiResponse<PatientDTO>> getPatientByEmail(@PathVariable String email) {
        return ResponseEntity.ok(ApiResponse.success("Patient fetched", patientService.getPatientByEmail(email)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PatientDTO>>> getAllPatients(
            @RequestParam(required = false) String search) {
        List<PatientDTO> patients = (search != null && !search.isBlank())
                ? patientService.searchPatients(search)
                : patientService.getAllPatients();
        return ResponseEntity.ok(ApiResponse.success("Patients fetched", patients));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PatientDTO>> updatePatient(
            @PathVariable Long id, @RequestBody PatientDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Patient updated", patientService.updatePatient(id, dto)));
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        String msg = patientService.changePassword(id, body.get("oldPassword"), body.get("newPassword"));
        return ResponseEntity.ok(ApiResponse.success(msg));
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<Void>> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(patientService.togglePatientStatus(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok(ApiResponse.success("Patient deleted"));
    }
}
