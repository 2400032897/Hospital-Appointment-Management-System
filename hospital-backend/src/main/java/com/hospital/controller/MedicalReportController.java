package com.hospital.controller;

import com.hospital.dto.ApiResponse;
import com.hospital.entity.MedicalReport;
import com.hospital.entity.Patient;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.MedicalReportRepository;
import com.hospital.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class MedicalReportController {

    private final MedicalReportRepository reportRepository;
    private final PatientRepository patientRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<MedicalReport>> uploadReport(
            @RequestParam Long patientId,
            @RequestParam String description,
            @RequestParam MultipartFile file) throws IOException {

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient", "id", patientId));

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String uniqueFileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        MedicalReport report = MedicalReport.builder()
                .patient(patient)
                .fileName(uniqueFileName)
                .originalFileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .filePath(filePath.toString())
                .fileSize(file.getSize())
                .description(description)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Report uploaded", reportRepository.save(report)));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<ApiResponse<List<MedicalReport>>> getPatientReports(@PathVariable Long patientId) {
        return ResponseEntity.ok(ApiResponse.success("Reports fetched",
                reportRepository.findByPatientIdOrderByUploadedAtDesc(patientId)));
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
        Resource resource = new UrlResource(filePath.toUri());
        if (!resource.exists()) {
            throw new ResourceNotFoundException("File not found: " + fileName);
        }
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReport(@PathVariable Long id) throws IOException {
        MedicalReport report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report", "id", id));
        Files.deleteIfExists(Paths.get(report.getFilePath()));
        reportRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Report deleted"));
    }
}
