package com.hospital.dto;

import java.time.LocalDateTime;

public class DepartmentDTO {
    private Long id;
    private String name;
    private String description;
    private String icon;
    private Boolean active;
    private int doctorCount;
    private LocalDateTime createdAt;

    public DepartmentDTO() {}

    public DepartmentDTO(Long id, String name, String description, String icon, Boolean active, int doctorCount, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.active = active;
        this.doctorCount = doctorCount;
        this.createdAt = createdAt;
    }

    public static DepartmentDTOBuilder builder() {
        return new DepartmentDTOBuilder();
    }

    public static class DepartmentDTOBuilder {
        private Long id;
        private String name;
        private String description;
        private String icon;
        private Boolean active;
        private int doctorCount;
        private LocalDateTime createdAt;

        public DepartmentDTOBuilder id(Long id) { this.id = id; return this; }
        public DepartmentDTOBuilder name(String name) { this.name = name; return this; }
        public DepartmentDTOBuilder description(String description) { this.description = description; return this; }
        public DepartmentDTOBuilder icon(String icon) { this.icon = icon; return this; }
        public DepartmentDTOBuilder active(Boolean active) { this.active = active; return this; }
        public DepartmentDTOBuilder doctorCount(int doctorCount) { this.doctorCount = doctorCount; return this; }
        public DepartmentDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public DepartmentDTO build() {
            return new DepartmentDTO(id, name, description, icon, active, doctorCount, createdAt);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public int getDoctorCount() { return doctorCount; }
    public void setDoctorCount(int doctorCount) { this.doctorCount = doctorCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
