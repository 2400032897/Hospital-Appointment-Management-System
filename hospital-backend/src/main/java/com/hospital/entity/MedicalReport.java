package com.hospital.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_reports")
public class MedicalReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private String fileType;

    @Column(nullable = false)
    private String filePath;

    private Long fileSize;

    private String description;

    @Column(updatable = false)
    private LocalDateTime uploadedAt;

    public MedicalReport() {}

    public MedicalReport(Long id, Patient patient, String fileName, String originalFileName, String fileType, String filePath, Long fileSize, String description) {
        this.id = id;
        this.patient = patient;
        this.fileName = fileName;
        this.originalFileName = originalFileName;
        this.fileType = fileType;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.description = description;
    }

    public static MedicalReportBuilder builder() {
        return new MedicalReportBuilder();
    }

    public static class MedicalReportBuilder {
        private Long id;
        private Patient patient;
        private String fileName;
        private String originalFileName;
        private String fileType;
        private String filePath;
        private Long fileSize;
        private String description;

        public MedicalReportBuilder id(Long id) { this.id = id; return this; }
        public MedicalReportBuilder patient(Patient patient) { this.patient = patient; return this; }
        public MedicalReportBuilder fileName(String fileName) { this.fileName = fileName; return this; }
        public MedicalReportBuilder originalFileName(String originalFileName) { this.originalFileName = originalFileName; return this; }
        public MedicalReportBuilder fileType(String fileType) { this.fileType = fileType; return this; }
        public MedicalReportBuilder filePath(String filePath) { this.filePath = filePath; return this; }
        public MedicalReportBuilder fileSize(Long fileSize) { this.fileSize = fileSize; return this; }
        public MedicalReportBuilder description(String description) { this.description = description; return this; }
        public MedicalReport build() {
            return new MedicalReport(id, patient, fileName, originalFileName, fileType, filePath, fileSize, description);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

    @PrePersist
    protected void onUpload() {
        uploadedAt = LocalDateTime.now();
    }
}
