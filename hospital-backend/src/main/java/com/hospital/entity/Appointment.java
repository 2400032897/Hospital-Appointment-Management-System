package com.hospital.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false)
    private String timeSlot;

    @Column(columnDefinition = "TEXT")
    private String symptoms;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED, CANCELLED, COMPLETED

    @Column(columnDefinition = "TEXT")
    private String prescription;

    @Column(columnDefinition = "TEXT")
    private String doctorNotes;

    private String rejectionReason;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Appointment() {}

    public Appointment(Long id, Patient patient, Doctor doctor, Department department, LocalDate appointmentDate, String timeSlot, String symptoms, String notes, String status, String prescription, String doctorNotes, String rejectionReason) {
        this.id = id;
        this.patient = patient;
        this.doctor = doctor;
        this.department = department;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.symptoms = symptoms;
        this.notes = notes;
        this.status = status != null ? status : "PENDING";
        this.prescription = prescription;
        this.doctorNotes = doctorNotes;
        this.rejectionReason = rejectionReason;
    }

    public static AppointmentBuilder builder() {
        return new AppointmentBuilder();
    }

    public static class AppointmentBuilder {
        private Long id;
        private Patient patient;
        private Doctor doctor;
        private Department department;
        private LocalDate appointmentDate;
        private String timeSlot;
        private String symptoms;
        private String notes;
        private String status = "PENDING";
        private String prescription;
        private String doctorNotes;
        private String rejectionReason;

        public AppointmentBuilder id(Long id) { this.id = id; return this; }
        public AppointmentBuilder patient(Patient patient) { this.patient = patient; return this; }
        public AppointmentBuilder doctor(Doctor doctor) { this.doctor = doctor; return this; }
        public AppointmentBuilder department(Department department) { this.department = department; return this; }
        public AppointmentBuilder appointmentDate(LocalDate appointmentDate) { this.appointmentDate = appointmentDate; return this; }
        public AppointmentBuilder timeSlot(String timeSlot) { this.timeSlot = timeSlot; return this; }
        public AppointmentBuilder symptoms(String symptoms) { this.symptoms = symptoms; return this; }
        public AppointmentBuilder notes(String notes) { this.notes = notes; return this; }
        public AppointmentBuilder status(String status) { this.status = status; return this; }
        public AppointmentBuilder prescription(String prescription) { this.prescription = prescription; return this; }
        public AppointmentBuilder doctorNotes(String doctorNotes) { this.doctorNotes = doctorNotes; return this; }
        public AppointmentBuilder rejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; return this; }
        public Appointment build() {
            return new Appointment(id, patient, doctor, department, appointmentDate, timeSlot, symptoms, notes, status, prescription, doctorNotes, rejectionReason);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
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
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
