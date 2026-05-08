package com.hospital.dto;

import java.time.LocalDateTime;

public class DoctorDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String specialization;
    private String qualification;
    private Integer experience;
    private String bio;
    private Long departmentId;
    private String departmentName;
    private Boolean available;
    private Boolean active;
    private String consultationFee;
    private String availableDays;
    private String availableTimeStart;
    private String availableTimeEnd;
    private LocalDateTime createdAt;

    public DoctorDTO() {}

    public DoctorDTO(Long id, String name, String email, String phone, String specialization, String qualification, Integer experience, String bio, Long departmentId, String departmentName, Boolean available, Boolean active, String consultationFee, String availableDays, String availableTimeStart, String availableTimeEnd, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.specialization = specialization;
        this.qualification = qualification;
        this.experience = experience;
        this.bio = bio;
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.available = available;
        this.active = active;
        this.consultationFee = consultationFee;
        this.availableDays = availableDays;
        this.availableTimeStart = availableTimeStart;
        this.availableTimeEnd = availableTimeEnd;
        this.createdAt = createdAt;
    }

    public static DoctorDTOBuilder builder() {
        return new DoctorDTOBuilder();
    }

    public static class DoctorDTOBuilder {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String specialization;
        private String qualification;
        private Integer experience;
        private String bio;
        private Long departmentId;
        private String departmentName;
        private Boolean available;
        private Boolean active;
        private String consultationFee;
        private String availableDays;
        private String availableTimeStart;
        private String availableTimeEnd;
        private LocalDateTime createdAt;

        public DoctorDTOBuilder id(Long id) { this.id = id; return this; }
        public DoctorDTOBuilder name(String name) { this.name = name; return this; }
        public DoctorDTOBuilder email(String email) { this.email = email; return this; }
        public DoctorDTOBuilder phone(String phone) { this.phone = phone; return this; }
        public DoctorDTOBuilder specialization(String specialization) { this.specialization = specialization; return this; }
        public DoctorDTOBuilder qualification(String qualification) { this.qualification = qualification; return this; }
        public DoctorDTOBuilder experience(Integer experience) { this.experience = experience; return this; }
        public DoctorDTOBuilder bio(String bio) { this.bio = bio; return this; }
        public DoctorDTOBuilder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
        public DoctorDTOBuilder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
        public DoctorDTOBuilder available(Boolean available) { this.available = available; return this; }
        public DoctorDTOBuilder active(Boolean active) { this.active = active; return this; }
        public DoctorDTOBuilder consultationFee(String consultationFee) { this.consultationFee = consultationFee; return this; }
        public DoctorDTOBuilder availableDays(String availableDays) { this.availableDays = availableDays; return this; }
        public DoctorDTOBuilder availableTimeStart(String availableTimeStart) { this.availableTimeStart = availableTimeStart; return this; }
        public DoctorDTOBuilder availableTimeEnd(String availableTimeEnd) { this.availableTimeEnd = availableTimeEnd; return this; }
        public DoctorDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public DoctorDTO build() {
            return new DoctorDTO(id, name, email, phone, specialization, qualification, experience, bio, departmentId, departmentName, available, active, consultationFee, availableDays, availableTimeStart, availableTimeEnd, createdAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }
    public Integer getExperience() { return experience; }
    public void setExperience(Integer experience) { this.experience = experience; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public String getConsultationFee() { return consultationFee; }
    public void setConsultationFee(String consultationFee) { this.consultationFee = consultationFee; }
    public String getAvailableDays() { return availableDays; }
    public void setAvailableDays(String availableDays) { this.availableDays = availableDays; }
    public String getAvailableTimeStart() { return availableTimeStart; }
    public void setAvailableTimeStart(String availableTimeStart) { this.availableTimeStart = availableTimeStart; }
    public String getAvailableTimeEnd() { return availableTimeEnd; }
    public void setAvailableTimeEnd(String availableTimeEnd) { this.availableTimeEnd = availableTimeEnd; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
