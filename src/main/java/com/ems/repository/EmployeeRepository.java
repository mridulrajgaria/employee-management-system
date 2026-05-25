package com.ems.repository;

import com.ems.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Demonstrates:
 *  - Derived query methods (findBy...)
 *  - JPQL with @Query
 *  - Pagination with Pageable
 *
 * Great SQL/JPA talking points for interviews.
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByEmail(String email);

    boolean existsByEmail(String email);

    // ─── Filtering ────────────────────────────────────────────────────────────

    List<Employee> findByDepartmentId(Long departmentId);

    Page<Employee> findByDepartmentId(Long departmentId, Pageable pageable);

    // Employees with salary greater than X
    List<Employee> findBySalaryGreaterThan(Double salary);

    // Employees with salary between min and max
    List<Employee> findBySalaryBetween(Double minSalary, Double maxSalary);

    // Search by name (case-insensitive contains)
    List<Employee> findByNameContainingIgnoreCase(String name);

    // ─── JPQL Queries ─────────────────────────────────────────────────────────

    // Employees in a specific department by name
    @Query("SELECT e FROM Employee e WHERE e.department.name = :deptName")
    List<Employee> findByDepartmentName(@Param("deptName") String deptName);

    // Sort by joining date ascending
    @Query("SELECT e FROM Employee e ORDER BY e.joiningDate ASC")
    List<Employee> findAllSortedByJoiningDate();

    // Employees sorted by joining date with pagination
    Page<Employee> findAllByOrderByJoiningDateAsc(Pageable pageable);

    // Search by name OR designation
    @Query("SELECT e FROM Employee e WHERE " +
           "LOWER(e.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(e.designation) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Employee> searchByNameOrDesignation(@Param("keyword") String keyword);
}
