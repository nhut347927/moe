FROM openjdk:17-jdk-slim

# Cài đặt FFmpeg nếu cần xử lý video/audio
#RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy WAR file vào image
COPY target/Moe-0.0.1-SNAPSHOT.war app.war

# Copy file cấu hình nếu cần
COPY src/main/resources/application.properties ./application.properties

# Thiết lập biến môi trường (có thể override khi chạy container)
ENV SPRING_PROFILES_ACTIVE=prod
ENV JAVA_OPTS=""

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS