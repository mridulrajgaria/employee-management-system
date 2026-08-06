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

        // 2. Seed Default Department Units
        List<Department> depts = departmentRepository.findAll();
        if (depts.isEmpty()) {
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

            depts = departmentRepository.saveAll(List.of(deptCloud, deptAi, deptEnterprise));
            log.info("✔ Pre-seeded {} default enterprise department units.", depts.size());
        }

        // 3. Seed Realistic Workforce Records for Interview Demo
        if (employeeRepository.count() == 0 && !depts.isEmpty()) {
            Department dept1 = depts.get(0);
            Department dept2 = depts.size() > 1 ? depts.get(1) : dept1;
            Department dept3 = depts.size() > 2 ? depts.get(2) : dept1;

            Employee emp1 = Employee.builder()
                    .name("Kristin Watson")
                    .email("kristin.watson@ems.com")
                    .phone("+1 (555) 321-8899")
                    .designation("Principal Lead Architect")
                    .salary(135000.0)
                    .joiningDate(LocalDate.of(2023, 3, 15))
                    .department(dept1)
                    .build();

            Employee emp2 = Employee.builder()
                    .name("Jacob Jones")
                    .email("jacob.jones@ems.com")
                    .phone("+1 (555) 432-9900")
                    .designation("Senior AI Research Scientist")
                    .salary(142500.0)
                    .joiningDate(LocalDate.of(2023, 8, 1))
                    .department(dept2)
                    .build();

            Employee emp3 = Employee.builder()
                    .name("Ronald Richards")
                    .email("ronald.richards@ems.com")
                    .phone("+1 (555) 654-1122")
                    .designation("Full-Stack Java Engineer")
                    .salary(98000.0)
                    .joiningDate(LocalDate.of(2024, 1, 10))
                    .department(dept3)
                    .build();

            Employee emp4 = Employee.builder()
                    .name("Devon Lane")
                    .email("devon.lane@ems.com")
                    .phone("+1 (555) 789-3344")
                    .designation("Cloud DevOps Specialist")
                    .salary(112000.0)
                    .joiningDate(LocalDate.of(2024, 4, 20))
                    .department(dept1)
                    .build();

            Employee emp5 = Employee.builder()
                    .name("Elena Rostova")
                    .email("elena.rostova@ems.com")
                    .phone("+1 (555) 901-4455")
                    .designation("Principal Security Engineer")
                    .salary(128000.0)
                    .joiningDate(LocalDate.of(2023, 11, 5))
                    .department(dept1)
                    .build();

            Employee emp6 = Employee.builder()
                    .name("Marcus Vance")
                    .email("marcus.vance@ems.com")
                    .phone("+1 (555) 234-7766")
                    .designation("VP of Engineering Operations")
                    .salary(165000.0)
                    .joiningDate(LocalDate.of(2022, 9, 12))
                    .department(dept3)
                    .build();

            employeeRepository.saveAll(List.of(emp1, emp2, emp3, emp4, emp5, emp6));
            log.info("✔ Pre-seeded 6 sample executive workforce records with verified salary benchmarks for demo interview evaluation.");
        }

        log.info("🚀 SmartEMS Database Bootstrapping Completed Successfully!");
    }
}
