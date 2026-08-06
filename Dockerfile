# =========================================================================
# Multi-Stage Dockerfile for SmartEMS (Java 17 LTS + React 18 Modular SPA)
# Optimized for cloud deployments (Render, Railway, Fly.io, Google Cloud Run)
# =========================================================================

# Stage 1: Build the Spring Boot application and packaged React UI
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create a lightweight production runtime container
FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app

# Copy the compiled executable Spring Boot JAR from the build stage
COPY --from=build /build/target/employee-management-*.jar /app/smartems-platform.jar

# Support dynamic cloud ports (defaults to 8080 for local execution)
EXPOSE 8080
ENV PORT=8080

# Execute the application engine with optimized JVM memory and port mapping
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Dserver.port=${PORT}", "-jar", "/app/smartems-platform.jar"]
