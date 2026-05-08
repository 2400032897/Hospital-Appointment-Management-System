package com.hospital.service;

import com.hospital.dto.AppointmentBookingRequest;
import com.hospital.dto.AppointmentDTO;
import com.hospital.entity.Appointment;
import com.hospital.entity.Department;
import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final NotificationService notificationService;

    public AppointmentService(AppointmentRepository appointmentRepository, 
                              PatientRepository patientRepository, 
                              DoctorRepository doctorRepository, 
                              DepartmentRepository departmentRepository, 
                              NotificationService notificationService) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.notificationService = notificationService;
    }

    private static final List<String> TIME_SLOTS = List.of(
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
            "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
            "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
            "04:00 PM", "04:30 PM", "05:00 PM"
    );

    public AppointmentDTO bookAppointment(AppointmentBookingRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", request.getPatientId()));
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", request.getDoctorId()));

        LocalDate date = LocalDate.parse(request.getAppointmentDate());

        // Check slot availability
        List<Appointment> existing = appointmentRepository
                .findByDoctorIdAndAppointmentDate(request.getDoctorId(), date);
        boolean slotTaken = existing.stream()
                .anyMatch(a -> a.getTimeSlot().equals(request.getTimeSlot())
                        && !a.getStatus().equals("CANCELLED"));
        if (slotTaken) {
            throw new IllegalArgumentException("The selected time slot is already booked");
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .department(department)
                .appointmentDate(date)
                .timeSlot(request.getTimeSlot())
                .symptoms(request.getSymptoms())
                .notes(request.getNotes())
                .status("PENDING")
                .build();

        Appointment saved = appointmentRepository.save(appointment);

        // Send notifications
        notificationService.createNotification(patient.getEmail(), "PATIENT",
                "Appointment Booked",
                "Your appointment with Dr. " + doctor.getName() + " on " + date + " at " + request.getTimeSlot() + " is pending approval.",
                "APPOINTMENT");
        notificationService.createNotification(doctor.getEmail(), "DOCTOR",
                "New Appointment Request",
                "Patient " + patient.getName() + " has requested an appointment on " + date + " at " + request.getTimeSlot(),
                "APPOINTMENT");

        return mapToDTO(saved);
    }

    public List<AppointmentDTO> getPatientAppointments(Long patientId) {
        return appointmentRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<AppointmentDTO> getDoctorAppointments(Long doctorId) {
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateAsc(doctorId)
                .stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    public AppointmentDTO updateAppointmentStatus(Long id, String status, String reason, String prescription, String doctorNotes) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));

        appointment.setStatus(status.toUpperCase());
        if (reason != null) appointment.setRejectionReason(reason);
        if (prescription != null) appointment.setPrescription(prescription);
        if (doctorNotes != null) appointment.setDoctorNotes(doctorNotes);

        Appointment saved = appointmentRepository.save(appointment);

        // Notify patient
        String msg = switch (status.toUpperCase()) {
            case "APPROVED" -> "Your appointment with Dr. " + appointment.getDoctor().getName() +
                    " on " + appointment.getAppointmentDate() + " has been APPROVED!";
            case "REJECTED" -> "Your appointment has been rejected. Reason: " + reason;
            case "CANCELLED" -> "Your appointment on " + appointment.getAppointmentDate() + " has been cancelled.";
            case "COMPLETED" -> "Your appointment has been marked as completed.";
            default -> "Your appointment status has been updated to: " + status;
        };
        notificationService.createNotification(appointment.getPatient().getEmail(), "PATIENT",
                "Appointment " + status, msg, "APPOINTMENT");

        return mapToDTO(saved);
    }

    public String cancelAppointment(Long id, Long patientId) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        if (!appointment.getPatient().getId().equals(patientId)) {
            throw new IllegalArgumentException("You can only cancel your own appointments");
        }
        if (appointment.getStatus().equals("COMPLETED")) {
            throw new IllegalArgumentException("Cannot cancel a completed appointment");
        }
        appointment.setStatus("CANCELLED");
        appointmentRepository.save(appointment);
        return "Appointment cancelled successfully";
    }

    public List<String> getAvailableSlots(Long doctorId, String date) {
        LocalDate localDate = LocalDate.parse(date);
        List<Appointment> booked = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, localDate);
        Set<String> bookedSlots = booked.stream()
                .filter(a -> !a.getStatus().equals("CANCELLED"))
                .map(Appointment::getTimeSlot)
                .collect(Collectors.toSet());
        return TIME_SLOTS.stream()
                .filter(slot -> !bookedSlots.contains(slot))
                .collect(Collectors.toList());
    }

    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new LinkedHashMap<>();
        stats.put("total", appointmentRepository.count());
        stats.put("pending", appointmentRepository.countByStatus("PENDING"));
        stats.put("approved", appointmentRepository.countByStatus("APPROVED"));
        stats.put("completed", appointmentRepository.countByStatus("COMPLETED"));
        stats.put("cancelled", appointmentRepository.countByStatus("CANCELLED"));
        stats.put("rejected", appointmentRepository.countByStatus("REJECTED"));
        stats.put("today", appointmentRepository.countByAppointmentDate(LocalDate.now()));
        return stats;
    }

    public AppointmentDTO mapToDTO(Appointment a) {
        return AppointmentDTO.builder()
                .id(a.getId())
                .patientId(a.getPatient().getId())
                .patientName(a.getPatient().getName())
                .patientEmail(a.getPatient().getEmail())
                .patientPhone(a.getPatient().getPhone())
                .doctorId(a.getDoctor().getId())
                .doctorName(a.getDoctor().getName())
                .doctorSpecialization(a.getDoctor().getSpecialization())
                .departmentId(a.getDepartment() != null ? a.getDepartment().getId() : null)
                .departmentName(a.getDepartment() != null ? a.getDepartment().getName() : null)
                .appointmentDate(a.getAppointmentDate())
                .timeSlot(a.getTimeSlot())
                .symptoms(a.getSymptoms())
                .notes(a.getNotes())
                .status(a.getStatus())
                .prescription(a.getPrescription())
                .doctorNotes(a.getDoctorNotes())
                .rejectionReason(a.getRejectionReason())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
