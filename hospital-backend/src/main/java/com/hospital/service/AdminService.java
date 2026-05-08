package com.hospital.service;

import com.hospital.dto.AppointmentDTO;
import com.hospital.dto.DoctorDTO;
import com.hospital.dto.PatientDTO;
import com.hospital.entity.Admin;
import com.hospital.repository.AdminRepository;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DepartmentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final PatientService patientService;
    private final DoctorService doctorService;
    private final AppointmentService appointmentService;
    private final DepartmentRepository departmentRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(PatientService patientService, 
                        DoctorService doctorService, 
                        AppointmentService appointmentService, 
                        DepartmentRepository departmentRepository, 
                        AdminRepository adminRepository, 
                        PasswordEncoder passwordEncoder) {
        this.patientService = patientService;
        this.doctorService = doctorService;
        this.appointmentService = appointmentService;
        this.departmentRepository = departmentRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalPatients", patientService.getTotalPatients());
        stats.put("totalDoctors", doctorService.getTotalDoctors());
        stats.put("totalDepartments", departmentRepository.count());
        stats.putAll(appointmentService.getDashboardStats());
        return stats;
    }

    public List<PatientDTO> getAllPatients() {
        return patientService.getAllPatients();
    }

    public List<DoctorDTO> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    public DoctorDTO createDoctor(DoctorDTO dto, String password) {
        return doctorService.createDoctor(dto, password);
    }

    public String togglePatientStatus(Long id) {
        return patientService.togglePatientStatus(id);
    }

    public String toggleDoctorStatus(Long id) {
        return doctorService.toggleDoctorStatus(id);
    }

    public void deletePatient(Long id) {
        patientService.deletePatient(id);
    }

    public void deleteDoctor(Long id) {
        doctorService.deleteDoctor(id);
    }

    public Map<String, Object> generateReport(String startDate, String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<AppointmentDTO> appointments = appointmentService.getAllAppointments().stream()
                .filter(a -> !a.getAppointmentDate().isBefore(start) && !a.getAppointmentDate().isAfter(end))
                .toList();

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("period", startDate + " to " + endDate);
        report.put("totalAppointments", appointments.size());
        report.put("approved", appointments.stream().filter(a -> "APPROVED".equals(a.getStatus())).count());
        report.put("completed", appointments.stream().filter(a -> "COMPLETED".equals(a.getStatus())).count());
        report.put("cancelled", appointments.stream().filter(a -> "CANCELLED".equals(a.getStatus())).count());
        report.put("rejected", appointments.stream().filter(a -> "REJECTED".equals(a.getStatus())).count());
        report.put("pending", appointments.stream().filter(a -> "PENDING".equals(a.getStatus())).count());
        report.put("appointments", appointments);
        return report;
    }

    public boolean createAdminAccount(String name, String email, String password) {
        if (adminRepository.existsByEmail(email)) {
            return false;
        }
        Admin admin = Admin.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .build();
        adminRepository.save(admin);
        return true;
    }
}
