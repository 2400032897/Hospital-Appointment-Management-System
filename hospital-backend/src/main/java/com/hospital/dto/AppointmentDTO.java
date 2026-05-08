package com.hospital.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AppointmentDTO {
    private Long id;
    private Long patientId;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private Long departmentId;
    private String departmentName;
    private LocalDate appointmentDate;
    private String timeSlot;
    private String symptoms;
    private String notes;
    private String status;
    private String prescription;
    private String doctorNotes;
    private String rejectionReason;
    private LocalDateTime createdAt;

    public AppointmentDTO() {}

    public AppointmentDTO(Long id, Long patientId, String patientName, String patientEmail, String patientPhone, Long doctorId, String doctorName, String doctorSpecialization, Long departmentId, String departmentName, LocalDate appointmentDate, String timeSlot, String symptoms, String notes, String status, String prescription, String doctorNotes, String rejectionReason, LocalDateTime createdAt) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientEmail = patientEmail;
        this.patientPhone = patientPhone;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.doctorSpecialization = doctorSpecialization;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.symptoms = symptoms;
        this.notes = notes;
        this.status = status;
        this.prescription = prescription;
        this.doctorNotes = doctorNotes;
        this.rejectionReason = rejectionReason;
        this.createdAt = createdAt;
    }

    public static AppointmentDTOBuilder builder() {
        return new AppointmentDTOBuilder();
    }

    public static class AppointmentDTOBuilder {
        private Long id;
        private Long patientId;
        private String patientName;
        private String patientEmail;
        private String patientPhone;
        private Long doctorId;
        private String doctorName;
        private String doctorSpecialization;
        private Long departmentId;
        private String departmentName;
        private LocalDate appointmentDate;
        private String timeSlot;
        private String symptoms;
        private String notes;
        private String status;
        private String prescription;
        private String doctorNotes;
        private String rejectionReason;
        private LocalDateTime createdAt;

        public AppointmentDTOBuilder id(Long id) { this.id = id; return this; }
        public AppointmentDTOBuilder patientId(Long patientId) { this.patientId = patientId; return this; }
        public AppointmentDTOBuilder patientName(String patientName) { this.patientName = patientName; return this; }
        public AppointmentDTOBuilder patientEmail(String patientEmail) { this.patientEmail = patientEmail; return this; }
        public AppointmentDTOBuilder patientPhone(String patientPhone) { this.patientPhone = patientPhone; return this; }
        public AppointmentDTOBuilder doctorId(Long doctorId) { this.doctorId = doctorId; return this; }
        public AppointmentDTOBuilder doctorName(String doctorName) { this.doctorName = doctorName; return this; }
        public AppointmentDTOBuilder doctorSpecialization(String doctorSpecialization) { this.doctorSpecialization = doctorSpecialization; return this; }
        public AppointmentDTOBuilder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
        public AppointmentDTOBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public AppointmentDTOBuilder appointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; return this; }
        public AppointmentDTOBuilder timeSlot(String timeSlot) { this.timeSlot = timeSlot; return this; }
        public AppointmentDTOBuilder symptoms(String symptoms) { this.symptoms = symptoms; return this; }
        public AppointmentDTOBuilder notes(String notes) { this.notes = notes; return this; }
        public AppointmentDTOBuilder status(String status) { this.status = status; return this; }
        public AppointmentDTOBuilder prescription(String prescription) { this.prescription = prescription; return this; }
        public AppointmentDTOBuilder doctorNotes(String doctorNotes) { this.doctorNotes = doctorNotes; return this; }
        public AppointmentDTOBuilder rejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; return this; }
        public AppointmentDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public AppointmentDTO build() {
            return new AppointmentDTO(id, patientId, patientName, patientEmail, patientPhone, doctorId, doctorName, doctorSpecialization, departmentId, departmentName, appointmentDate, timeSlot, symptoms, notes, status, prescription, doctorNotes, rejectionReason, createdAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }
    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public String getDoctorSpecialization() { return doctorSpecialization; }
    public void setDoctorSpecialization(String doctorSpecialization) { this.doctorSpecialization = doctorSpecialization; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; }
    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPrescription() { return prescription; }
    public void setPrescription(String prescription) { this.prescription = prescription; }
    public String getDoctorNotes() { return doctorNotes; }
    public void setDoctorNotes(String doctorNotes) { this.doctorNotes = doctorNotes; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
