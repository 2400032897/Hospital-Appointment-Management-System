package com.hospital.config;

import com.hospital.entity.*;
import com.hospital.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private final AdminRepository adminRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DepartmentRepository departmentRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(AdminRepository adminRepository,
                      DoctorRepository doctorRepository,
                      PatientRepository patientRepository,
                      DepartmentRepository departmentRepository,
                      AppointmentRepository appointmentRepository,
                      PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.departmentRepository = departmentRepository;
        this.appointmentRepository = appointmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        String defaultPassword = "Rahul@2314";
        String encodedPassword = passwordEncoder.encode(defaultPassword);
        // 1. Seed Admin
        String adminEmail = "admin@hospital.com";
        log.info("DEBUG: Generated hash for {}: {}", adminEmail, encodedPassword);
        Admin admin = adminRepository.findByEmail(adminEmail).orElse(null);
        if (admin == null) {
            admin = Admin.builder()
                    .name("System Admin")
                    .email(adminEmail)
                    .password(encodedPassword)
                    .build();
            adminRepository.save(admin);
            log.info("Created Admin: {}", adminEmail);
        } else {
            admin.setPassword(encodedPassword);
            adminRepository.save(admin);
            log.info("Updated Admin password: {}", adminEmail);
        }

        // 2. Seed Department
        Department cardiology = departmentRepository.findByName("Cardiology").orElse(null);
        if (cardiology == null) {
            cardiology = Department.builder()
                    .name("Cardiology")
                    .description("Heart related treatments")
                    .icon("FiActivity")
                    .build();
            cardiology = departmentRepository.save(cardiology);
            log.info("Created Cardiology Department");
        }

        // 3. Seed Doctor
        String doctorEmail = "doctor@hospital.com";
        Doctor doctor = doctorRepository.findByEmail(doctorEmail).orElse(null);
        if (doctor == null) {
            doctor = Doctor.builder()
                    .name("Dr. Rahul Sharma")
                    .email(doctorEmail)
                    .password(encodedPassword)
                    .phone("9876543210")
                    .specialization("Cardiologist")
                    .qualification("MD, Cardiology")
                    .experience(10)
                    .department(cardiology)
                    .build();
            doctor = doctorRepository.save(doctor);
            log.info("Created Doctor: {}", doctorEmail);
        } else {
            doctor.setPassword(encodedPassword);
            doctor = doctorRepository.save(doctor);
            log.info("Updated Doctor password: {}", doctorEmail);
        }

        // 4. Seed Patient
        String patientEmail = "patient@hospital.com";
        Patient patient = patientRepository.findByEmail(patientEmail).orElse(null);
        if (patient == null) {
            patient = Patient.builder()
                    .name("Rahul Kumar")
                    .email(patientEmail)
                    .password(encodedPassword)
                    .phone("1234567890")
                    .gender("Male")
                    .bloodGroup("O+")
                    .build();
            patient = patientRepository.save(patient);
            log.info("Created Patient: {}", patientEmail);
        } else {
            patient.setPassword(encodedPassword);
            patient = patientRepository.save(patient);
            log.info("Updated Patient password: {}", patientEmail);
        }

        // 5. Seed Appointments
        if (appointmentRepository.count() == 0) {
            java.time.LocalDate today = java.time.LocalDate.now();

            // Pending Appointment
            Appointment pending = Appointment.builder()
                    .patient(patient)
                    .doctor(doctor)
                    .department(cardiology)
                    .appointmentDate(today.plusDays(2))
                    .timeSlot("10:00 AM")
                    .symptoms("Mild chest pain during exercise")
                    .notes("First time visit")
                    .status("PENDING")
                    .build();
            appointmentRepository.save(pending);

            // Approved Appointment
            Appointment approved = Appointment.builder()
                    .patient(patient)
                    .doctor(doctor)
                    .department(cardiology)
                    .appointmentDate(today)
                    .timeSlot("02:30 PM")
                    .symptoms("Regular heart checkup")
                    .status("APPROVED")
                    .build();
            appointmentRepository.save(approved);

            // Completed Appointment
            Appointment completed = Appointment.builder()
                    .patient(patient)
                    .doctor(doctor)
                    .department(cardiology)
                    .appointmentDate(today.minusDays(7))
                    .timeSlot("11:15 AM")
                    .symptoms("Routine follow up")
                    .status("COMPLETED")
                    .prescription("Aspirin 75mg daily")
                    .doctorNotes("Patient recovery is stable. Blood pressure normal.")
                    .build();
            appointmentRepository.save(completed);

            log.info("Seeded 3 sample appointments");
        }

        log.info("====================================================");
        log.info("LOGIN DETAILS FOR ALL SECTIONS (Password: {})", defaultPassword);
        log.info("ADMIN: {}", adminEmail);
        log.info("DOCTOR: {}", doctorEmail);
        log.info("PATIENT: {}", patientEmail);
        log.info("====================================================");
    }
}

