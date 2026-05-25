package com.ems.service;

import com.ems.dto.EmployeeDTO;
import com.ems.entity.Department;
import com.ems.entity.Employee;
import com.ems.exception.DuplicateResourceException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import com.ems.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Employee service containing all business logic.
 *
 * Interview points:
 *  - @Transactional ensures atomicity
 *  - Manual mapping (no MapStruct) to show you understand the flow
 *  - All exceptions thrown here, not in controller
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)   // default is read-only; write ops override below
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    // ─── CREATE ───────────────────────────────────────────────────────────────

    @Transactional
    public EmployeeDTO createEmployee(EmployeeDTO dto) {
        if (employeeRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Employee", "email", dto.getEmail());
        }

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", dto.getDepartmentId()));

        Employee employee = toEntity(dto, department);
        Employee saved = employeeRepository.save(employee);
        return toDTO(saved);
    }

    // ─── READ ─────────────────────────────────────────────────────────────────

    public List<EmployeeDTO> getAllEmployees() {
        return employeeRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Page<EmployeeDTO> getAllEmployeesPaginated(Pageable pageable) {
        return employeeRepository.findAll(pageable).map(this::toDTO);
    }

    public EmployeeDTO getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
        return toDTO(employee);
    }

    public List<EmployeeDTO> getEmployeesByDepartment(Long departmentId) {
        departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", departmentId));
        return employeeRepository.findByDepartmentId(departmentId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ─── SEARCH & FILTER ──────────────────────────────────────────────────────

    public List<EmployeeDTO> getEmployeesWithSalaryAbove(Double minSalary) {
        return employeeRepository.findBySalaryGreaterThan(minSalary)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<EmployeeDTO> getEmployeesWithSalaryBetween(Double min, Double max) {
        return employeeRepository.findBySalaryBetween(min, max)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<EmployeeDTO> searchEmployees(String keyword) {
        return employeeRepository.searchByNameOrDesignation(keyword)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<EmployeeDTO> getEmployeesSortedByJoiningDate() {
        return employeeRepository.findAllSortedByJoiningDate()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // ─── UPDATE ───────────────────────────────────────────────────────────────

    @Transactional
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO dto) {
        Employee existing = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        // If email is changing, check it's not already taken by another employee
        if (!existing.getEmail().equals(dto.getEmail())
                && employeeRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateResourceException("Employee", "email", dto.getEmail());
        }

        Department department = departmentRepository.findById(dto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", dto.getDepartmentId()));

        existing.setName(dto.getName());
        existing.setEmail(dto.getEmail());
        existing.setPhone(dto.getPhone());
        existing.setDesignation(dto.getDesignation());
        existing.setSalary(dto.getSalary());
        existing.setJoiningDate(dto.getJoiningDate());
        existing.setDepartment(department);

        return toDTO(employeeRepository.save(existing));
    }

    // ─── DELETE ───────────────────────────────────────────────────────────────

    @Transactional
    public void deleteEmployee(Long id) {
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee", "id", id);
        }
        employeeRepository.deleteById(id);
    }

    // ─── MAPPING ──────────────────────────────────────────────────────────────

    private EmployeeDTO toDTO(Employee e) {
        return EmployeeDTO.builder()
                .id(e.getId())
                .name(e.getName())
                .email(e.getEmail())
                .phone(e.getPhone())
                .designation(e.getDesignation())
                .salary(e.getSalary())
                .joiningDate(e.getJoiningDate())
                .departmentId(e.getDepartment() != null ? e.getDepartment().getId() : null)
                .departmentName(e.getDepartment() != null ? e.getDepartment().getName() : null)
                .build();
    }

    private Employee toEntity(EmployeeDTO dto, Department department) {
        return Employee.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .designation(dto.getDesignation())
                .salary(dto.getSalary())
                .joiningDate(dto.getJoiningDate())
                .department(department)
                .build();
    }
}
