package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.dto.AppointmentDTO;
import com.hospital.dto.AppointmentBookingRequest;
import com.hospital.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/book")
    public ResponseEntity<ApiResponse<AppointmentDTO>> bookAppointment(
            @RequestBody AppointmentBookingRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Appointment booked successfully",
                appointmentService.bookAppointment(request)));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getPatientAppointments(
            @PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.success("Appointments fetched",
                appointmentService.getPatientAppointments(patientId)));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getDoctorAppointments(
            @PathVariable Long doctorId) {
        return ResponseEntity.ok(ApiResponse.success("Appointments fetched",
                appointmentService.getDoctorAppointments(doctorId)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AppointmentDTO>>> getAllAppointments(
            @RequestParam(required = false) String status) {
        List<AppointmentDTO> appointments = (status != null && !status.isBlank())
                ? appointmentService.getAppointmentsByStatus(status)
                : appointmentService.getAllAppointments();
        return ResponseEntity.ok(ApiResponse.success("Appointments fetched", appointments));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AppointmentDTO>> updateStatus(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success("Status updated",
                appointmentService.updateAppointmentStatus(
                        id,
                        body.get("status"),
                        body.get("reason"),
                        body.get("prescription"),
                        body.get("doctorNotes")
                )));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Void>> cancelAppointment(
            @PathVariable Long id, @RequestBody Map<String, Long> body) {
        String msg = appointmentService.cancelAppointment(id, body.get("patientId"));
        return ResponseEntity.ok(ApiResponse.success(msg));
    }

    @GetMapping("/slots")
    public ResponseEntity<ApiResponse<List<String>>> getAvailableSlots(
            @RequestParam Long doctorId, @RequestParam String date) {
        return ResponseEntity.ok(ApiResponse.success("Available slots",
                appointmentService.getAvailableSlots(doctorId, date)));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getStats() {
        return ResponseEntity.ok(ApiResponse.success("Stats fetched",
                appointmentService.getDashboardStats()));
    }
}
