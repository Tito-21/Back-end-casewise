# CaseWise - Case Management System Backend

A Spring Boot REST API for managing legal cases with user authentication and case registration functionality.

## Project Structure

```
src/main/java/com/Intern/casewise/
├── CasewiseApplication.java          # Main Spring Boot application class
├── controller/
│   ├── AuthController.java           # User authentication endpoints
│   └── CaseController.java           # Case management endpoints
├── dto/                              # Data Transfer Objects
│   ├── ApiResponse.java              # Generic API response wrapper
│   ├── CaseRequest.java              # Case creation/update request
│   ├── CaseResponse.java             # Case response data
│   ├── LoginRequest.java             # Login request data
│   ├── RegisterRequest.java          # User registration request
│   └── UserResponse.java             # User response data
├── model/                            # JPA Entities
│   ├── Case.java                     # Case entity
│   └── User.java                     # User entity
├── repository/                       # JPA Repositories
│   ├── CaseRepository.java           # Case data access
│   └── UserRepository.java           # User data access
└── service/                          # Business Logic
    ├── CaseService.java              # Case service interface
    ├── UserService.java              # User service interface
    └── impl/                         # Service Implementations
        ├── CaseServiceImpl.java      # Case service implementation
        └── UserServiceImpl.java      # User service implementation

src/main/resources/
└── application.properties            # Spring Boot configuration

src/test/java/com/Intern/casewise/
└── CasewiseApplicationTests.java     # Main application test
```

## Technology Stack

- **Java 21** - Programming language
- **Spring Boot 3.2.2** - Application framework
- **Spring Data JPA** - Database ORM
- **H2 Database** - In-memory database for development
- **Spring Validation** - Request validation
- **Maven** - Build tool

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Case Management
- `GET /api/cases` - Get all cases
- `GET /api/cases/{id}` - Get case by ID
- `GET /api/cases/number/{caseNumber}` - Get case by case number
- `POST /api/cases` - Create new case
- `PUT /api/cases/{id}` - Update existing case
- `DELETE /api/cases/{id}` - Delete case
- `GET /api/cases/user/{userId}` - Get cases by user
- `GET /api/cases/search` - Search cases
- `GET /api/cases/status/{status}` - Get cases by status

## Database Schema

### Users Table
- `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- `email` (VARCHAR, UNIQUE, NOT NULL)
- `password` (VARCHAR, NOT NULL)
- `first_name` (VARCHAR, NOT NULL)
- `last_name` (VARCHAR, NOT NULL)
- `created_at` (TIMESTAMP)

### Cases Table
- `id` (BIGINT, PRIMARY KEY, AUTO_INCREMENT)
- `first_name` (VARCHAR, NOT NULL)
- `last_name` (VARCHAR, NOT NULL)
- `case_number` (VARCHAR, UNIQUE, NOT NULL)
- `status` (VARCHAR, NOT NULL, DEFAULT 'Open')
- `description` (VARCHAR(1000))
- `user_id` (BIGINT, FOREIGN KEY references users.id)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Getting Started

1. **Prerequisites**: Java 21, Maven

2. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

3. **Access H2 Console**: http://localhost:8080/h2-console
   - JDBC URL: `jdbc:h2:mem:casewise`
   - Username: `sa`
   - Password: (leave blank)

## Development Notes

- No Lombok dependency - uses manual getters/setters
- H2 in-memory database for development
- RESTful API design with proper HTTP status codes
- Input validation using Spring Validation annotations
- JPA entities with proper relationships
- Service layer pattern for business logic separation
