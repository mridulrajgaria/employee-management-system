package com.ems.controller;

import com.ems.dto.EmployeeDTO;
import com.ems.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Employee CRUD operations.
 *
 * Role rules:
 *  - GET endpoints: ADMIN + EMPLOYEE
 *  - POST/PUT/DELETE: ADMIN only
 *
 * Interview note: @PreAuthorize works in combination with
 * the URL-level rules in SecurityConfig — double safety.
 */
@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Employee Management", description = "CRUD + Search + Filter for employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    // ─── CREATE ───────────────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new employee")
    public ResponseEntity<EmployeeDTO> createEmployee(
            @Valid @RequestBody EmployeeDTO employeeDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(employeeService.createEmployee(employeeDTO));
    }

    // ─── READ ALL ─────────────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @Operation(summary = "Get all employees")
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/paginated")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @Operation(summary = "Get all employees with pagination",
               description = "Sort fields: name, salary, joiningDate. Direction: asc/desc")
    public ResponseEntity<Page<EmployeeDTO>> getAllEmployeesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(employeeService.getAllEmployeesPaginated(pageable));
    }

    // ─── READ ONE ─────────────────────────────────────────────────────────────

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @Operation(summary = "Get employee by ID")
    public ResponseEntity<EmployeeDTO> getEmployeeById(
            @PathVariable @Parameter(description = "Employee ID") Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update employee details")
    public ResponseEntity<EmployeeDTO> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeDTO employeeDTO) {
        return ResponseEntity.ok(employeeService.updateEmployee(id, employeeDTO));
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an employee")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    // ─── SEARCH & FILTER ──────────────────────────────────────────────────────

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @Operation(summary = "Search employees by name or designation")
    public ResponseEntity<List<EmployeeDTO>> searchEmployees(
            @RequestParam @Parameter(description = "Keyword to search in name or designation") String keyword) {
        return ResponseEntity.ok(employeeService.searchEmployees(keyword));
    }

    @GetMapping("/filter/salary")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @Operation(summary = "Filter employees by salary",
               description = "Use 'above' OR 'min'+'max' — not both")
    public ResponseEntity<List<EmployeeDTO>> filterBySalary(
            @RequestParam(required = false) Double above,
            @RequestParam(required = false) Double min,
            @RequestParam(required = false) Double max) {

        if (above != null) {
            return ResponseEntity.ok(employeeService.getEmployeesWithSalaryAbove(above));
        } else if (min != null && max != null) {
            return ResponseEntity.ok(employeeService.getEmployeesWithSalaryBetween(min, max));
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/sorted/joining-date")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @Operation(summary = "Get all employees sorted by joining date (oldest first)")
    public ResponseEntity<List<EmployeeDTO>> getSortedByJoiningDate() {
        return ResponseEntity.ok(employeeService.getEmployeesSortedByJoiningDate());
    }

    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    @Operation(summary = "Get all employees in a specific department")
    public ResponseEntity<List<EmployeeDTO>> getByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(employeeService.getEmployeesByDepartment(departmentId));
    }
}
