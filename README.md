# Smart Employee Management System
### Spring Boot · MySQL · JWT · REST API · Swagger

---

## Project Structure

```
src/main/java/com/ems/
│
├── EmployeeManagementApplication.java    ← Entry point
│
├── config/
│   ├── SecurityConfig.java               ← JWT filter chain, role-based access
│   └── SwaggerConfig.java                ← OpenAPI 3 with Bearer auth
│
├── controller/
│   ├── AuthController.java               ← POST /api/auth/signup, /login
│   ├── EmployeeController.java           ← Full CRUD + search + filter + pagination
│   └── DepartmentController.java         ← Full CRUD
│
├── dto/
│   ├── AuthDTO.java                      ← SignupRequest, LoginRequest, JwtResponse
│   ├── EmployeeDTO.java                  ← With full @Valid annotations
│   └── DepartmentDTO.java
│
├── entity/
│   ├── User.java                         ← Auth user
│   ├── Employee.java                     ← Core entity
│   ├── Department.java                   ← One-to-many with Employee
│   └── Role.java                         ← ROLE_ADMIN, ROLE_EMPLOYEE
│
├── exception/
│   ├── GlobalExceptionHandler.java       ← @RestControllerAdvice — handles ALL errors
│   ├── ResourceNotFoundException.java    ← 404
│   └── DuplicateResourceException.java   ← 409
│
├── repository/
│   ├── UserRepository.java
│   ├── EmployeeRepository.java           ← Custom JPQL queries, filters
│   └── DepartmentRepository.java
│
├── security/
│   ├── JwtUtils.java                     ← Token generate / parse / validate
│   ├── JwtAuthFilter.java                ← OncePerRequestFilter
│   └── UserDetailsServiceImpl.java       ← Loads user by email
│
└── service/
    ├── AuthService.java                  ← register + login logic
    ├── EmployeeService.java              ← All business logic
    └── DepartmentService.java
```

---

## Quick Setup

### 1. Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+

### 2. Database Setup
```sql
CREATE DATABASE employee_db;
```

### 3. Configure credentials
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 4. Run
```bash
mvn spring-boot:run
```
> Tables are auto-created by Hibernate (`ddl-auto=update`)

### 5. Access Swagger UI
```
http://localhost:8080/swagger-ui.html
```

---

## API Reference

### Authentication (Public)
| Method | Endpoint             | Description          |
|--------|----------------------|----------------------|
| POST   | `/api/auth/signup`   | Register new user    |
| POST   | `/api/auth/login`    | Login → get JWT      |

**Signup Body:**
```json
{
  "name": "John Admin",
  "email": "admin@ems.com",
  "password": "admin123",
  "role": "ROLE_ADMIN"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "type": "Bearer",
  "id": 1,
  "name": "John Admin",
  "email": "admin@ems.com",
  "role": "ROLE_ADMIN"
}
```

---

### Departments (Requires Bearer token)
| Method | Endpoint               | Role          | Description            |
|--------|------------------------|---------------|------------------------|
| POST   | `/api/departments`     | ADMIN         | Create department      |
| GET    | `/api/departments`     | ADMIN/EMPLOYEE| List all departments   |
| GET    | `/api/departments/{id}`| ADMIN/EMPLOYEE| Get by ID              |
| PUT    | `/api/departments/{id}`| ADMIN         | Update department      |
| DELETE | `/api/departments/{id}`| ADMIN         | Delete (if no employees)|

---

### Employees (Requires Bearer token)
| Method | Endpoint                              | Role           | Description              |
|--------|---------------------------------------|----------------|--------------------------|
| POST   | `/api/employees`                      | ADMIN          | Add employee             |
| GET    | `/api/employees`                      | ADMIN/EMPLOYEE | List all employees       |
| GET    | `/api/employees/paginated`            | ADMIN/EMPLOYEE | Paginated list           |
| GET    | `/api/employees/{id}`                 | ADMIN/EMPLOYEE | Get by ID                |
| PUT    | `/api/employees/{id}`                 | ADMIN          | Update employee          |
| DELETE | `/api/employees/{id}`                 | ADMIN          | Delete employee          |
| GET    | `/api/employees/search?keyword=X`     | ADMIN/EMPLOYEE | Search name/designation  |
| GET    | `/api/employees/filter/salary?above=X`| ADMIN/EMPLOYEE | Filter by salary > X     |
| GET    | `/api/employees/filter/salary?min=X&max=Y` | ALL       | Filter by salary range   |
| GET    | `/api/employees/sorted/joining-date`  | ADMIN/EMPLOYEE | Sort by joining date     |
| GET    | `/api/employees/department/{deptId}`  | ADMIN/EMPLOYEE | Employees in a dept      |

**Pagination example:**
```
GET /api/employees/paginated?page=0&size=5&sortBy=salary&direction=desc
```

**Employee Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@ems.com",
  "phone": "9876543210",
  "designation": "Software Engineer",
  "salary": 75000.00,
  "joiningDate": "2023-06-15",
  "departmentId": 1
}
```

---

## Error Response Format

All errors return a consistent JSON structure:

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 404,
  "error": "Resource Not Found",
  "message": "Employee not found with id: '99'",
  "path": "uri=/api/employees/99"
}
```

Validation errors include field-level details:
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Validation Failed",
  "message": "One or more fields are invalid",
  "fieldErrors": {
    "email": "Provide a valid email address",
    "salary": "Salary must be greater than 0"
  }
}
```

---

## Key Interview Talking Points

### Architecture
> "I followed a strict layered architecture: Controller handles HTTP, Service
> holds business logic, Repository handles DB. This separates concerns clearly —
> if I need to switch from MySQL to PostgreSQL, I only change the JPA config."

### JWT Authentication
> "Authentication is stateless — no sessions. On login, a signed JWT is returned.
> Every subsequent request carries it in the Authorization header. The JwtAuthFilter
> intercepts every request, validates the token, and sets the SecurityContext."

### Exception Handling
> "I used @RestControllerAdvice to centralize all error handling in one class.
> This means no try-catch blocks in controllers or services — clean, consistent
> error responses across the whole API."

### Role-Based Access
> "I protect endpoints at two levels: URL patterns in SecurityConfig and
> @PreAuthorize on individual methods. Admins can do full CRUD; Employees
> can only read. Double safety."

### JPA/SQL Knowledge
> "I wrote custom JPQL queries with @Query for complex filters — salary ranges,
> case-insensitive search across multiple fields, department-based queries.
> I also use derived query methods like findBySalaryBetween() which Spring
> translates to SQL automatically."

### Validation
> "Validation lives in the DTO layer with @Valid. The entity has its own
> constraints too. I validate negative salaries, invalid emails, future joining
> dates, and missing required fields — all declaratively."

---

## Tech Stack Summary
| Layer        | Technology                          |
|--------------|-------------------------------------|
| Language     | Java 17                             |
| Framework    | Spring Boot 3.2                     |
| Security     | Spring Security + JWT (jjwt 0.12)   |
| Persistence  | Spring Data JPA + Hibernate         |
| Database     | MySQL 8                             |
| Validation   | Jakarta Bean Validation             |
| Docs         | SpringDoc OpenAPI 3 (Swagger UI)    |
| Build        | Maven                               |
| Utilities    | Lombok                              |
