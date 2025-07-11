import { ScrollArea } from "@/components/ui/scroll-area";

export default function AboutPage() {
  return (
    <ScrollArea className="max-w-5xl mx-auto h-screen overflow-auto px-4 py-6 text-zinc-800 dark:text-zinc-100 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
          🌟 Giới thiệu về Moe
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-center mt-2 sm:mt-4 max-w-md mx-auto">
          Moe là một nền tảng mạng xã hội hiện đại, kết hợp trải nghiệm{" "}
          <b>xem video</b>,
          {/* <b>nghe nhạc</b> và <b>tương tác cộng đồng</b>. */}
          Ứng dụng được phát triển tách biệt Frontend - Backend nhằm đảm bảo tốc
          độ, bảo mật và dễ mở rộng.
        </p>

        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            🧩 Công nghệ sử dụng
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="font-medium text-sm sm:text-base md:text-lg mb-1">
                Frontend
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm md:text-base">
                <li>⚛️ React 18 + TypeScript</li>
                <li>⚡ Vite (tối ưu dev + build)</li>
                <li>🎨 Tailwind CSS (thiết kế hiện đại)</li>
                <li>🔐 Google OAuth + Xác thực</li>
                <li>🛠️ React Hook Form, Axios, Lucide Icons</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base md:text-lg mb-1">
                Backend
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm md:text-base">
                <li>☕ Java 17 + Spring Boot</li>
                <li>🛢️ MySQL + Hibernate</li>
                <li>🔒 JWT + Google OAuth2</li>
                <li>☁️ Cloudinary (upload ảnh/video)</li>
                <li>✉️ Gmail SMTP (email thông báo)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            🚀 Tính năng nổi bật
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm md:text-base">
            <li>📸 Đăng bài với ảnh hoặc video</li>
            <li>🗣️ Bình luận, thích bài viết, theo dõi người dùng</li>
            <li>🎬 Trích thumbnail từ video ngay khi upload</li>
            <li>🔍 Tìm kiếm người dùng, bài viết (phân trang, sắp xếp)</li>
            {/* <li>⚙️ Trang admin quản lý người dùng và bài hát</li> */}
            <li>🔐 Xác thực qua email hoặc Google OAuth</li>
            <li>📬 Gửi email khi quên mật khẩu</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            📁 Cấu trúc dự án
          </h2>
          <h3 className="font-medium text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
            Frontend (React + Vite)
          </h3>
          <pre className="bg-zinc-900 text-white text-xs rounded p-3 sm:p-4 overflow-x-auto">
            {`src/
├── pages/client/       # Trang người dùng
├── pages/admin/        # Trang admin
├── pages/auth/         # Đăng nhập, đăng ký
├── components/         # Giao diện tái sử dụng
├── services/           # API Axios
└── main.tsx, App.tsx   # Cấu hình router & provider`}
          </pre>

          <h3 className="font-medium text-sm sm:text-base md:text-lg mt-3 sm:mt-4 mb-1 sm:mb-2">
            Backend (Java + Spring Boot)
          </h3>
          <pre className="bg-zinc-900 text-white text-xs rounded p-3 sm:p-4 overflow-x-auto">
            {`src/main/java/com/moe/socialnetwork/
├── api/              # Controller, Service, DTO
├── auth/             # Xác thực OAuth2 + JWT
├── jpa/              # Repository
├── models/           # Entity
├── config/           # Cấu hình bảo mật & hệ thống
├── util/             # Helper class
└── MoeApplication.java`}
          </pre>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            ⚙️ Cài đặt & Chạy
          </h2>
          <h3 className="font-medium text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
            Frontend:
          </h3>
          <pre className="bg-zinc-900 text-white text-xs rounded p-3 sm:p-4 overflow-x-auto">
            {`cd Moe_fe
npm install
npm run dev`}
          </pre>

          <h3 className="font-medium text-sm sm:text-base md:text-lg mt-3 sm:mt-4 mb-1 sm:mb-2">
            Backend:
          </h3>
          <pre className="bg-zinc-900 text-white text-xs rounded p-3 sm:p-4 overflow-x-auto">
            {`cd Moe
mvn clean install
java -jar target/moe-0.0.1-SNAPSHOT.jar`}
          </pre>

          <h3 className="font-medium text_quanttext sm:text-base md:text-lg mt-3 sm:mt-4 mb-1 sm:mb-2">
            .env yêu cầu:
          </h3>
          <pre className="bg-zinc-900 text-white text-xs rounded p-3 sm:p-4 overflow-x-auto">
            {`DB_USERNAME=
DB_PASSWORD=
APP_JWT_SECRET=
GOOGLE_CLIENT_ID=
CLOUDINARY_API_KEY=
SPRING_MAIL_USERNAME=
...`}
          </pre>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            👨‍💻 Tác giả
          </h2>
          <p className="text-xs sm:text-sm md:text-base">
            Phát triển bởi: <b>nhutnm379</b>
          </p>
        </section>

        <section className="mb-16 sm:mb-32">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            📜 Giấy phép
          </h2>
          <p className="text-xs sm:text-sm md:text-base">
            Dự án bạn có thể sử dụng, chỉnh sửa và triển khai lại tùy ý.
          </p>
        </section>
      </div>
    </ScrollArea>
  );
}
