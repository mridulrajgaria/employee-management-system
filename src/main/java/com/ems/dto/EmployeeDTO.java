package com.ems.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

/**
 * Data Transfer Object for Employee.
 * Decouples the API contract from the JPA entity.
 * All validation annotations live here — NOT in the entity.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDTO {

    private Long id;  // Ignored on create; returned on response

    @NotBlank(message = "Employee name is required")
    @Size(min = 2, max = 100, message = "Name must be 2–100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Provide a valid email address")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Provide a valid phone number")
    private String phone;

    @NotBlank(message = "Designation is required")
    @Size(max = 100)
    private String designation;

    @NotNull(message = "Salary is required")
    @DecimalMin(value = "1.0", message = "Salary must be greater than 0")
    @DecimalMax(value = "10000000.0", message = "Salary seems unrealistically high")
    private Double salary;

    @NotNull(message = "Joining date is required")
    @PastOrPresent(message = "Joining date cannot be in the future")
    private LocalDate joiningDate;

    @NotNull(message = "Department ID is required")
    private Long departmentId;

    // Populated on response only
    private String departmentName;
}
