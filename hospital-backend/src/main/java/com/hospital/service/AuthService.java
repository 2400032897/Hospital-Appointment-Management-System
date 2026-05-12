package com.hospital.service;

import com.hospital.dto.*;
import com.hospital.entity.Admin;
import com.hospital.entity.Doctor;
import com.hospital.entity.Patient;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.AdminRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class AuthService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public AuthService(PatientRepository patientRepository, 
                       DoctorRepository doctorRepository, 
                       AdminRepository adminRepository, 
                       PasswordEncoder passwordEncoder, 
                       JwtService jwtService, 
                       EmailService emailService) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    public LoginResponse login(LoginRequest request) {
        String role = request.getRole().toUpperCase();
        String email = request.getEmail();
        String rawPassword = request.getPassword();

        return switch (role) {
            case "PATIENT" -> loginPatient(email, rawPassword);
            case "DOCTOR" -> loginDoctor(email, rawPassword);
            case "ADMIN" -> loginAdmin(email, rawPassword);
            default -> throw new IllegalArgumentException("Invalid role: " + role);
        };
    }

    private LoginResponse loginPatient(String email, String rawPassword) {
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with email: " + email));
        if (!passwordEncoder.matches(rawPassword, patient.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        if (!patient.getActive()) {
            throw new IllegalArgumentException("Account is deactivated. Please contact admin.");
        }
        String token = jwtService.generateToken(email, "PATIENT", patient.getId());
        return LoginResponse.builder()
                .token(token).role("PATIENT").userId(patient.getId())
                .name(patient.getName()).email(email)
                .message("Login successful").build();
    }

    private LoginResponse loginDoctor(String email, String rawPassword) {
        Doctor doctor = doctorRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with email: " + email));
        if (!passwordEncoder.matches(rawPassword, doctor.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        if (!doctor.getActive()) {
            throw new IllegalArgumentException("Account is deactivated. Please contact admin.");
        }
        String token = jwtService.generateToken(email, "DOCTOR", doctor.getId());
        return LoginResponse.builder()
                .token(token).role("DOCTOR").userId(doctor.getId())
                .name(doctor.getName()).email(email)
                .message("Login successful").build();
    }

    private LoginResponse loginAdmin(String email, String rawPassword) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with email: " + email));
        
        System.out.println("DEBUG: Stored hash for " + email + ": " + admin.getPassword());
        
        if (!passwordEncoder.matches(rawPassword, admin.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
        String token = jwtService.generateToken(email, "ADMIN", admin.getId());
        return LoginResponse.builder()
                .token(token).role("ADMIN").userId(admin.getId())
                .name(admin.getName()).email(email)
                .message("Login successful").build();
    }

    public String registerPatient(RegisterRequest request) {
        if (patientRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }
        Patient patient = Patient.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .gender(request.getGender())
                .address(request.getAddress())
                .bloodGroup(request.getBloodGroup())
                .dateOfBirth(request.getDateOfBirth() != null ?
                        LocalDate.parse(request.getDateOfBirth()) : null)
                .build();
        patientRepository.save(patient);
        return "Patient registered successfully";
    }

    public String forgotPassword(String email, String role) {
        String token = UUID.randomUUID().toString();
        java.time.LocalDateTime expiry = java.time.LocalDateTime.now().plusHours(1);

        switch (role.toUpperCase()) {
            case "PATIENT" -> {
                Patient p = patientRepository.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + email));
                p.setResetPasswordToken(token);
                p.setResetPasswordExpiry(expiry);
                patientRepository.save(p);
            }
            case "DOCTOR" -> {
                Doctor d = doctorRepository.findByEmail(email)
                        .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + email));
                d.setResetPasswordToken(token);
                d.setResetPasswordExpiry(expiry);
                doctorRepository.save(d);
            }
            default -> throw new IllegalArgumentException("Invalid role");
        }

        String resetLink = "http://localhost:5173/reset-password?token=" + token + "&role=" + role;
        emailService.sendEmail(email, "Password Reset Request",
                "Click the link to reset your password: " + resetLink +
                "\nThis link expires in 1 hour.");

        return "Password reset email sent successfully";
    }

    public String resetPassword(String token, String newPassword, String role) {
        String encoded = passwordEncoder.encode(newPassword);
        switch (role.toUpperCase()) {
            case "PATIENT" -> {
                Patient p = patientRepository.findByResetPasswordToken(token)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token"));
                if (p.getResetPasswordExpiry().isBefore(java.time.LocalDateTime.now())) {
                    throw new IllegalArgumentException("Reset token has expired");
                }
                p.setPassword(encoded);
                p.setResetPasswordToken(null);
                p.setResetPasswordExpiry(null);
                patientRepository.save(p);
            }
            case "DOCTOR" -> {
                Doctor d = doctorRepository.findByResetPasswordToken(token)
                        .orElseThrow(() -> new IllegalArgumentException("Invalid or expired reset token"));
                if (d.getResetPasswordExpiry().isBefore(java.time.LocalDateTime.now())) {
                    throw new IllegalArgumentException("Reset token has expired");
                }
                d.setPassword(encoded);
                d.setResetPasswordToken(null);
                d.setResetPasswordExpiry(null);
                doctorRepository.save(d);
            }
            default -> throw new IllegalArgumentException("Invalid role");
        }
        return "Password reset successfully";
    }
}
