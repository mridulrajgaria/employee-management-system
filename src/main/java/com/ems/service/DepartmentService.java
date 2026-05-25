package com.ems.service;

import com.ems.dto.DepartmentDTO;
import com.ems.entity.Department;
import com.ems.exception.DuplicateResourceException;
import com.ems.exception.ResourceNotFoundException;
import com.ems.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Transactional
    public DepartmentDTO createDepartment(DepartmentDTO dto) {
        if (departmentRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Department", "name", dto.getName());
        }
        Department department = Department.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .build();
        return toDTO(departmentRepository.save(department));
    }

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public DepartmentDTO getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));
        return toDTO(dept);
    }

    @Transactional
    public DepartmentDTO updateDepartment(Long id, DepartmentDTO dto) {
        Department existing = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        if (!existing.getName().equals(dto.getName())
                && departmentRepository.existsByName(dto.getName())) {
            throw new DuplicateResourceException("Department", "name", dto.getName());
        }

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        return toDTO(departmentRepository.save(existing));
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", id));

        if (!dept.getEmployees().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete department '" + dept.getName() +
                    "' — it still has " + dept.getEmployees().size() + " employee(s). " +
                    "Reassign or remove them first.");
        }
        departmentRepository.deleteById(id);
    }

    private DepartmentDTO toDTO(Department d) {
        return DepartmentDTO.builder()
                .id(d.getId())
                .name(d.getName())
                .description(d.getDescription())
                .employeeCount(d.getEmployees().size())
                .build();
    }
}
