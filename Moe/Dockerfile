FROM openjdk:17-jdk-slim

# Tạo thư mục làm việc
WORKDIR /app

# Copy WAR file vào image
COPY target/Moe-0.0.1-SNAPSHOT.war app.war

# Expose port (nếu Spring Boot dùng 8080)
EXPOSE 8080

# Chạy ứng dụng với WAR file
ENTRYPOINT ["java", "-jar", "app.war"]
