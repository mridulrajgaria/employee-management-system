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
        System.out.println("=================================================================");
        System.out.println("  ⚡ SmartEMS Full-Stack Workforce Platform - RUNNING            ");
        System.out.println("  🌐 Web Portal (Tabela UI): http://localhost:8080/              ");
        System.out.println("  📚 OpenAPI Swagger Docs  : http://localhost:8080/swagger-ui.html");
        System.out.println("=================================================================");
    }
}
