package com.hospital.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;
    private String specialization;
    private String qualification;

    @Column(nullable = false)
    private Integer experience = 0;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String profileImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    private Boolean available = true;

    @Column(nullable = false)
    private String role = "DOCTOR";

    private Boolean active = true;

    private String consultationFee;

    private String availableDays;
    private String availableTimeStart;
    private String availableTimeEnd;

    private String resetPasswordToken;
    private LocalDateTime resetPasswordExpiry;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Doctor() {}

    public Doctor(Long id, String name, String email, String password, String phone, String specialization, String qualification, Integer experience, String bio, String profileImage, Department department, Boolean available, String role, Boolean active, String consultationFee, String availableDays, String availableTimeStart, String availableTimeEnd) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.specialization = specialization;
        this.qualification = qualification;
        this.experience = experience;
        this.bio = bio;
        this.profileImage = profileImage;
        this.department = department;
        this.available = available;
        this.role = role;
        this.active = active;
        this.consultationFee = consultationFee;
        this.availableDays = availableDays;
        this.availableTimeStart = availableTimeStart;
        this.availableTimeEnd = availableTimeEnd;
    }

    // Builder-like static method
    public static DoctorBuilder builder() {
        return new DoctorBuilder();
    }

    public static class DoctorBuilder {
        private Long id;
        private String name;
        private String email;
        private String password;
        private String phone;
        private String specialization;
        private String qualification;
        private Integer experience = 0;
        private String bio;
        private String profileImage;
        private Department department;
        private Boolean available = true;
        private String role = "DOCTOR";
        private Boolean active = true;
        private String consultationFee;
        private String availableDays;
        private String availableTimeStart;
        private String availableTimeEnd;

        public DoctorBuilder id(Long id) { this.id = id; return this; }
        public DoctorBuilder name(String name) { this.name = name; return this; }
        public DoctorBuilder email(String email) { this.email = email; return this; }
        public DoctorBuilder password(String password) { this.password = password; return this; }
        public DoctorBuilder phone(String phone) { this.phone = phone; return this; }
        public DoctorBuilder specialization(String specialization) { this.specialization = specialization; return this; }
        public DoctorBuilder qualification(String qualification) { this.qualification = qualification; return this; }
        public DoctorBuilder experience(Integer experience) { this.experience = experience; return this; }
        public DoctorBuilder bio(String bio) { this.bio = bio; return this; }
        public DoctorBuilder profileImage(String profileImage) { this.profileImage = profileImage; return this; }
        public DoctorBuilder department(Department department) { this.department = department; return this; }
        public DoctorBuilder available(Boolean available) { this.available = available; return this; }
        public DoctorBuilder role(String role) { this.role = role; return this; }
        public DoctorBuilder active(Boolean active) { this.active = active; return this; }
        public DoctorBuilder consultationFee(String consultationFee) { this.consultationFee = consultationFee; return this; }
        public DoctorBuilder availableDays(String availableDays) { this.availableDays = availableDays; return this; }
        public DoctorBuilder availableTimeStart(String availableTimeStart) { this.availableTimeStart = availableTimeStart; return this; }
        public DoctorBuilder availableTimeEnd(String availableTimeEnd) { this.availableTimeEnd = availableTimeEnd; return this; }
        public Doctor build() {
            return new Doctor(id, name, email, password, phone, specialization, qualification, experience, bio, profileImage, department, available, role, active, consultationFee, availableDays, availableTimeStart, availableTimeEnd);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
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
    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }
    public Boolean getAvailable() { return available; }
    public void setAvailable(Boolean available) { this.available = available; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
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
    public String getResetPasswordToken() { return resetPasswordToken; }
    public void setResetPasswordToken(String resetPasswordToken) { this.resetPasswordToken = resetPasswordToken; }
    public LocalDateTime getResetPasswordExpiry() { return resetPasswordExpiry; }
    public void setResetPasswordExpiry(LocalDateTime resetPasswordExpiry) { this.resetPasswordExpiry = resetPasswordExpiry; }
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
