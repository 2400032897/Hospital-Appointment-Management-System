package com.hospital.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PatientDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String bloodGroup;
    private Boolean active;
    private LocalDateTime createdAt;

    public PatientDTO() {}

    public PatientDTO(Long id, String name, String email, String phone, LocalDate dateOfBirth, String gender, String address, String bloodGroup, Boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.address = address;
        this.bloodGroup = bloodGroup;
        this.active = active;
        this.createdAt = createdAt;
    }

    public static PatientDTOBuilder builder() {
        return new PatientDTOBuilder();
    }

    public static class PatientDTOBuilder {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private LocalDate dateOfBirth;
        private String gender;
        private String address;
        private String bloodGroup;
        private Boolean active;
        private LocalDateTime createdAt;

        public PatientDTOBuilder id(Long id) { this.id = id; return this; }
        public PatientDTOBuilder name(String name) { this.name = name; return this; }
        public PatientDTOBuilder email(String email) { this.email = email; return this; }
        public PatientDTOBuilder phone(String phone) { this.phone = phone; return this; }
        public PatientDTOBuilder dateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; return this; }
        public PatientDTOBuilder gender(String gender) { this.gender = gender; return this; }
        public PatientDTOBuilder address(String address) { this.address = address; return this; }
        public PatientDTOBuilder bloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; return this; }
        public PatientDTOBuilder active(Boolean active) { this.active = active; return this; }
        public PatientDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public PatientDTO build() {
            return new PatientDTO(id, name, email, phone, dateOfBirth, gender, address, bloodGroup, active, createdAt);
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
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
