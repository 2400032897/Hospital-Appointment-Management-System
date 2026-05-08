package com.hospital.config;

import com.hospital.service.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private final AdminService adminService;

    public DataSeeder(AdminService adminService) {
        this.adminService = adminService;
    }

    @Override
    public void run(ApplicationArguments args) {
        boolean created = adminService.createAdminAccount(
                "System Admin",
                "admin@hospital.com",
                "Admin@123"
        );
        if (created) {
            log.info("====================================================");
            log.info("DEFAULT ADMIN ACCOUNT CREATED");
            log.info("Email: admin@hospital.com");
            log.info("Password: Admin@123");
            log.info("====================================================");
        } else {
            log.info("Admin account already exists — skipping seed.");
        }
    }
}
