package com.hospital.dto;

public class AppointmentBookingRequest {
    private Long patientId;
    private Long doctorId;
    private Long departmentId;
    private String appointmentDate; // "yyyy-MM-dd"
    private String timeSlot;
    private String symptoms;
    private String notes;

    public AppointmentBookingRequest() {}

    public AppointmentBookingRequest(Long patientId, Long doctorId, Long departmentId, String appointmentDate, String timeSlot, String symptoms, String notes) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.departmentId = departmentId;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
        this.symptoms = symptoms;
        this.notes = notes;
    }

    public static AppointmentBookingRequestBuilder builder() {
        return new AppointmentBookingRequestBuilder();
    }

    public static class AppointmentBookingRequestBuilder {
        private Long patientId;
        private Long doctorId;
        private Long departmentId;
        private String appointmentDate;
        private String timeSlot;
        private String symptoms;
        private String notes;

        public AppointmentBookingRequestBuilder patientId(Long patientId) { this.patientId = patientId; return this; }
        public AppointmentBookingRequestBuilder doctorId(Long doctorId) { this.doctorId = doctorId; return this; }
        public AppointmentBookingRequestBuilder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
        public AppointmentBookingRequestBuilder appointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; return this; }
        public AppointmentBookingRequestBuilder timeSlot(String timeSlot) { this.timeSlot = timeSlot; return this; }
        public AppointmentBookingRequestBuilder symptoms(String symptoms) { this.symptoms = symptoms; return this; }
        public AppointmentBookingRequestBuilder notes(String notes) { this.notes = notes; return this; }
        public AppointmentBookingRequest build() {
            return new AppointmentBookingRequest(patientId, doctorId, departmentId, appointmentDate, timeSlot, symptoms, notes);
        }
    }

    // Getters and Setters
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }
    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
    public String getSymptoms() { return symptoms; }
    public void setSymptoms(String symptoms) { this.symptoms = symptoms; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
