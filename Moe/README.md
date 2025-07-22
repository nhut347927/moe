# Moe Social Network Backend


fix:	Khi sửa một bug/bug logic
feat:	Khi thêm chức năng mới
chore:	Khi thay đổi cấu hình, tài liệu, CI/CD
refactor:	Khi cải tiến mã nhưng không thay đổi hành vi
style:	Thay đổi style/code format
docs: Cập nhật tài liệu



## Overview
Moe là backend cho ứng dụng mạng xã hội, phát triển bằng Java 17+ và Spring Boot. Hệ thống cung cấp RESTful API quản lý người dùng, bài đăng, bình luận, lượt thích, theo dõi, lịch sử tìm kiếm, upload file, báo cáo, và logging hoạt động. Hỗ trợ xác thực JWT, Google OAuth, lưu trữ media với Cloudinary, xử lý video/audio với FFmpeg.

## Technologies Used
- Java 17+
- Spring Boot (Web, Security, Data JPA)
- Hibernate (ORM)
- MySQL 8
- Cloudinary (media storage)
- FFmpeg (video/audio processing)
- JWT (authentication)
- Google OAuth2
- Gmail SMTP (email notifications)
- Dotenv (.env environment management)
- Maven (build tool)
- Docker (containerization)
- Lombok (code generation)

## Features
- Quản lý tài khoản: cập nhật hồ sơ, avatar, theo dõi/hủy theo dõi
- Quản lý bài đăng: tạo, xem, thích, xóa bài đăng, xử lý video/audio
- Quản lý bình luận: thêm bình luận/trả lời, thích/xóa bình luận
- Tìm kiếm: người dùng, bài đăng, phân trang và sắp xếp
- Upload file ảnh/video (tối đa 100MB)
- Xác thực & phân quyền: JWT, Google OAuth2
- Email thông báo: đặt lại mật khẩu, sự kiện hệ thống
- Logging hoạt động & báo cáo
- Tích hợp Kafka cho các tác vụ bất đồng bộ
- Lên lịch dọn dẹp dữ liệu (Spring Scheduler)

## Architecture Overview
- **Controllers**: REST API cho các tài nguyên (users, posts, comments, search, reports)
- **Services**: Xử lý nghiệp vụ chính
- **Models**: Entity JPA ánh xạ bảng dữ liệu
- **Repositories (JPA)**: Truy cập dữ liệu
- **DTOs**: Đối tượng truyền dữ liệu request/response
- **Security**: JWT, OAuth2 cấu hình bảo mật
- **Utils**: Tiện ích chung (JWT, chuẩn hóa text, parse ngày tháng)
- **Exception Handling**: Xử lý lỗi tập trung

## Configuration
- Cấu hình qua `src/main/resources/application.properties` và biến môi trường `.env`
- Kết nối MySQL, Hibernate tự động cập nhật schema
- CORS cho frontend
- JWT secret, thời gian hết hạn qua biến môi trường
- SMTP Gmail cho email
- Cloudinary cho upload media
- FFmpeg path cho xử lý video/audio

## Folder Structure
```
src/
├── main/
│   ├── java/com/moe/socialnetwork/
│   │   ├── api/                # Controllers, DTOs, Services, Queue, Response
│   │   ├── auth/               # Authentication, security config
│   │   ├── config/             # Application config
│   │   ├── exception/          # Exception handler
│   │   ├── jpa/                # JPA repositories
│   │   ├── models/             # JPA entities
│   │   ├── response/           # API response wrapper
│   │   ├── util/               # Utility classes
│   │   ├── MoeApplication.java # Main Spring Boot class
│   │   └── ServletInitializer.java
│   └── resources/
│       ├── application.properties
│       ├── static/
│       └── templates/
└── test/
```

## Build and Run
1. Cài đặt Java 17+ và Maven.
2. Tạo file `.env` hoặc cấu hình biến môi trường:
   - DB_USERNAME, DB_PASSWORD
   - APP_JWT_SECRET
   - SPRING_MAIL_USERNAME, SPRING_MAIL_PASSWORD, APP_EMAIL_FROM
   - GOOGLE_CLIENT_ID
   - CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME
   - KAFKA_BOOTSTRAP_SERVERS
   - FFmpeg path nếu cần xử lý video/audio
3. Build:
   ```bash
   ./mvnw clean package
   ```
4. Chạy ứng dụng:
   ```bash
   java -jar target/moe-0.0.1-SNAPSHOT.jar
   ```
5. Server mặc định chạy ở port 8080.

## Notes
- Cloudinary bắt buộc để upload media.
- FFmpeg cần cài đặt trên server để xử lý video/audio.
- Frontend cần cấu hình đúng origin để kết nối API backend.

## Author
- nhutnm379