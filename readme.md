# Todo Application

A full-stack todo web application with user registration, login, and personal todo management. Each user can create, view, complete, rename, and delete only their own todos.

## Features

- User sign up
- User login
- Password encryption using BCrypt
- Authenticated todo access
- Create new todos
- Mark todos as completed
- Rename todos
- Delete todos
- Black and white responsive frontend theme
- MySQL database storage
- Frontend connected to backend using Fetch API

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript
- Fetch API

### Backend

- Java 17
- Spring Boot
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- Maven

### Database

- MySQL

## Project Structure

```text
TodoApplication/
├── backend/
│   ├── src/main/java/com/example/alter/
│   │   ├── config/
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   └── TodoController.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   └── Todo.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   └── TodoRepository.java
│   │   ├── service/
│   │   │   ├── CustomUserDetailsService.java
│   │   │   └── TodoService.java
│   │   └── TodoApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── readme.md
```

## How It Works

The frontend sends requests to the Spring Boot backend using JavaScript `fetch()`.

- Register and login requests go to `/auth`
- Todo requests go to `/todos`
- Spring Security protects todo routes
- User passwords are stored securely after BCrypt encryption
- Todos are linked to the logged-in user in MySQL

## API Endpoints

### Authentication

```text
POST /auth/register
POST /auth/login
POST /auth/logout
GET  /auth/me
```

### Todos

```text
GET    /todos
POST   /todos
PUT    /todos/{id}
DELETE /todos/{id}
```

## Database Configuration

The project uses MySQL. Current database settings are in:

```text
backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/todo_app
spring.datasource.username=root
spring.datasource.password=1234
spring.jpa.hibernate.ddl-auto=update
```

Create the database before running the backend:

```sql
CREATE DATABASE todo_app;
```

## How To Run

### 1. Start MySQL

Make sure MySQL is running and the `todo_app` database exists.

### 2. Start Backend

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend runs at:

```text
http://localhost:8080
```

### 3. Open Frontend

Recommended:

```text
http://localhost:8080/
```

You can also open `frontend/index.html` directly while Spring Boot is running. The frontend is configured to call:

```text
http://localhost:8080
```

## Current Development Status

Completed:

- Backend project setup
- MySQL connection
- User entity and repository
- Todo entity and repository
- Registration API
- Login API
- Spring Security configuration
- Password encryption
- Todo CRUD API
- Frontend authentication screen
- Frontend todo dashboard
- Frontend-backend connection
- CORS support
- Black and white UI theme

## Notes

- Use a new username when testing registration.
- If old table columns cause database errors during testing, drop and recreate the tables:

```sql
USE todo_app;
DROP TABLE IF EXISTS todos;
DROP TABLE IF EXISTS users;
```

Then restart Spring Boot. Hibernate will create the correct tables again.
