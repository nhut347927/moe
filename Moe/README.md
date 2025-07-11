# Moe Social Network Backend

## Overview
Moe is a backend service for a social networking application built with Java and Spring Boot. It provides RESTful APIs to manage users, posts, comments, likes, follows, search history, file uploads, and reporting. The service supports authentication via JWT and Google OAuth, media storage with Cloudinary, messaging with Kafka, and email notifications.

## Technologies Used
- Java 17+
- Spring Boot (Web, Security, Data JPA)
- MySQL 8 (via Hibernate)
- Kafka (Apache Kafka for messaging)
- Cloudinary (media storage)
- JWT (JSON Web Tokens for authentication)
- Google OAuth2
- Gmail SMTP (email notifications)
- Dotenv (environment variable management)
- Maven (build tool)

## Features
- User account management: profile update, avatar upload, follow/unfollow users
- Post management: create, view, like, delete posts
- Comment management: add comments and replies, like and delete comments
- Search functionality: search users and posts with pagination and sorting
- File upload support for images and videos (max 200MB)
- Authentication and authorization with JWT and Google OAuth2
- Email notifications for password reset and other events
- Activity logging and reporting
- Kafka integration for asynchronous processing and messaging

## Architecture Overview
- **Controllers**: REST API endpoints for various resources (users, posts, comments, search, reports)
- **Services**: Business logic implementations for handling core functionalities
- **Models**: JPA entities representing database tables
- **Repositories (JPA)**: Data access layer for CRUD operations
- **DTOs**: Data Transfer Objects for request and response payloads
- **Security**: JWT and OAuth2 configuration for securing APIs
- **Utils**: Utility classes for common tasks (JWT handling, text normalization, date parsing)
- **Queue**: Kafka producers and consumers for asynchronous tasks
- **Exception Handling**: Global exception handler for consistent API error responses

## Configuration
- Configured via `src/main/resources/application.properties` and environment variables loaded from `.env`
- Database connection to MySQL with Hibernate auto schema update
- CORS configured for frontend origin
- JWT secrets and expiration times configurable via environment variables
- Email SMTP settings for Gmail
- Cloudinary credentials for media uploads
- Kafka bootstrap servers and serialization settings

## Folder Structure
```
src/
├── main/
│   ├── java/com/moe/socialnetwork/
│   │   ├── api/                # Controllers, DTOs, Services, Queue, Response
│   │   ├── auth/               # Authentication controllers, DTOs, security config, services
│   │   ├── config/             # Application configuration classes
│   │   ├── exception/          # Exception handling classes
│   │   ├── jpa/                # JPA repository interfaces
│   │   ├── models/             # JPA entity classes
│   │   ├── response/           # API response wrapper classes
│   │   ├── util/               # Utility classes
│   │   ├── MoeApplication.java # Main Spring Boot application class
│   │   └── ServletInitializer.java # Servlet initializer for deployment
│   └── resources/
│       ├── application.properties # Application configuration
│       ├── static/                  # Static resources (images, videos)
│       └── templates/               # Template files (if any)
└── test/                            # Unit and integration tests
```

## Build and Run
1. Ensure you have Java 17+ and Maven installed.
2. Configure environment variables in a `.env` file or system environment:
   - Database credentials (`DB_USERNAME`, `DB_PASSWORD`)
   - JWT secret (`APP_JWT_SECRET`)
   - Email credentials (`SPRING_MAIL_USERNAME`, `SPRING_MAIL_PASSWORD`, `APP_EMAIL_FROM`)
   - Google OAuth client ID (`GOOGLE_CLIENT_ID`)
   - Cloudinary credentials (`CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_CLOUD_NAME`)
3. Build the project:
   ```bash
   ./mvnw clean package
   ```
4. Run the application:
   ```bash
   java -jar target/moe-0.0.1-SNAPSHOT.jar
   ```
5. The server will start on port 8080 by default.

## Notes
- Kafka must be running and accessible at the configured bootstrap server.
- Cloudinary account is required for media uploads.
- Frontend application should be configured to communicate with this backend API.

## Author
- nhutnm379
