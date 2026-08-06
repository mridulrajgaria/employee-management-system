package com.ems.config;

import com.ems.entity.Department;
import com.ems.entity.Employee;
import com.ems.entity.Role;
import com.ems.entity.User;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import com.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/**
 * Enterprise Database Bootstrapper & Seeder.
 * Executes automatically on application startup via Spring Boot lifecycle hooks (@Component + CommandLineRunner).
 * Initializes default administrator credentials, department units, and workforce records
 * if the persistence layer starts completely clean or newly deployed.
 *
 * Cognizant / Enterprise Interview Points:
 * - Eliminates friction and manual registration during technical code reviews or CI demos.
 * - Demonstrates mastery of Spring Boot lifecycle callback execution via CommandLineRunner.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("⚡ Executing SmartEMS Enterprise Data Seeder Lifecycle Hook...");

        // 1. Seed Default Executive Accounts (Admin & Employee)
        if (userRepository.findByEmail("admin@ems.com").isEmpty()) {
            User admin = User.builder()
                    .name("Alexander Pierce (Executive Admin)")
                    .email("admin@ems.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .build();

            User employee = User.builder()
                    .name("Sarah Connor (Senior Staff)")
                    .email("staff@ems.com")
                    .password(passwordEncoder.encode("staff123"))
                    .role(Role.ROLE_EMPLOYEE)
                    .build();

            userRepository.saveAll(List.of(admin, employee));
            log.info("✔ Pre-seeded default executive accounts: admin@ems.com (ROLE_ADMIN), staff@ems.com (ROLE_EMPLOYEE)");
        }

        // 2. Seed Default Department Units & Workforce Records
        if (departmentRepository.count() == 0) {
            Department deptCloud = Department.builder()
                    .name("Cloud Infrastructure")
                    .description("Global enterprise AWS & Kubernetes architecture operations.")
                    .build();

            Department deptAi = Department.builder()
                    .name("Artificial Intelligence")
                    .description("Next-generation generative AI solutions and LLM fine-tuning pipelines.")
                    .build();

            Department deptEnterprise = Department.builder()
                    .name("Enterprise Solutions")
                    .description("Full-stack Java client application delivery and distributed systems reliability.")
                    .build();

            List<Department> savedDepts = departmentRepository.saveAll(List.of(deptCloud, deptAi, deptEnterprise));
            log.info("✔ Pre-seeded {} default enterprise department units.", savedDepts.size());

            // 3. Seed Realistic Workforce Records
            if (employeeRepository.count() == 0) {
                Employee emp1 = Employee.builder()
                        .name("Kristin Watson")
                        .email("kristin.watson@ems.com")
                        .phone("+15553218899")
                        .designation("Principal Lead Architect")
                        .salary(135000.0)
                        .joiningDate(LocalDate.of(2023, 3, 15))
                        .department(deptCloud)
                        .build();

                Employee emp2 = Employee.builder()
                        .name("Jacob Jones")
                        .email("jacob.jones@ems.com")
                        .phone("+15554329900")
                        .designation("Senior AI Research Scientist")
                        .salary(142500.0)
                        .joiningDate(LocalDate.of(2023, 8, 1))
                        .department(deptAi)
                        .build();

                Employee emp3 = Employee.builder()
                        .name("Ronald Richards")
                        .email("ronald.richards@ems.com")
                        .phone("+15556541122")
                        .designation("Full-Stack Java Engineer")
                        .salary(98000.0)
                        .joiningDate(LocalDate.of(2024, 1, 10))
                        .department(deptEnterprise)
                        .build();

                Employee emp4 = Employee.builder()
                        .name("Devon Lane")
                        .email("devon.lane@ems.com")
                        .phone("+15557893344")
                        .designation("Cloud DevOps Specialist")
                        .salary(112000.0)
                        .joiningDate(LocalDate.of(2024, 4, 20))
                        .department(deptCloud)
                        .build();

                employeeRepository.saveAll(List.of(emp1, emp2, emp3, emp4));
                log.info("✔ Pre-seeded 4 sample workforce records with verified salary benchmarks.");
            }
        }

        log.info("🚀 SmartEMS Database Bootstrapping Completed Successfully!");
    }
}
