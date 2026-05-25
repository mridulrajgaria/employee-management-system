package com.ems;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Smart Employee Management System.
 *
 * Architecture: Controller → Service → Repository → Database
 */
@SpringBootApplication
public class EmployeeManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeeManagementApplication.class, args);
        System.out.println("==============================================");
        System.out.println("  Smart Employee Management System - RUNNING  ");
        System.out.println("  Swagger UI: http://localhost:8080/swagger-ui.html");
        System.out.println("==============================================");
    }
}
