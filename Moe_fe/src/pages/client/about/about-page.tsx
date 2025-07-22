import { ScrollArea } from "@/components/ui/scroll-area";
import image54359 from "@/assets/images/screenshot_1753154359.png";
import image54412 from "@/assets/images/screenshot_1753154412.png";
import image54460 from "@/assets/images/screenshot_1753154460.png";
import image54481 from "@/assets/images/screenshot_1753154481.png";
import image54574 from "@/assets/images/screenshot_1753154574.png";
import image54617 from "@/assets/images/screenshot_1753154617.png";
import image54636 from "@/assets/images/screenshot_1753154636.png";
import image54657 from "@/assets/images/screenshot_1753154657.png";
import image54686 from "@/assets/images/screenshot_1753154686.png";
import image55216 from "@/assets/images/screenshot_1753155216.png";
import image55234 from "@/assets/images/screenshot_1753155234.png";
import image54737 from "@/assets/images/screenshot_1753154737.png";
import image54759 from "@/assets/images/screenshot_1753154759.png";
import image55087 from "@/assets/images/screenshot_1753155087.png";
import image55101 from "@/assets/images/screenshot_1753155101.png";
import image55126 from "@/assets/images/screenshot_1753155126.png";
import image55146 from "@/assets/images/screenshot_1753155146.png";
import image55878 from "@/assets/images/screenshot_1753155878.png";
import image55899 from "@/assets/images/screenshot_1753155899.png";

export default function AboutPage() {
  return (
    <ScrollArea className="max-w-5xl mx-auto h-screen overflow-auto px-4 py-6 text-zinc-800 dark:text-zinc-100 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
          🌟 About Moe
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-center mt-2 sm:mt-4 mx-auto">
          Moe is a modern social media platform that combines <b>video viewing</b> and <b>community interaction</b>. 
          The application is built with a separated Frontend and Backend architecture for scalability and maintainability.
        </p>

        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            🧩 Technologies Used
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="font-medium text-sm sm:text-base md:text-lg mb-1">
                Frontend
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm md:text-base">
                <li>⚛️ React 18.3.1 + TypeScript</li>
                <li>⚡ Vite (optimized dev + build)</li>
                <li>🎨 Tailwind CSS with animations</li>
                <li>🛠️ Redux Toolkit + React Redux</li>
                <li>🚦 React Router DOM</li>
                <li>📝 React Hook Form</li>
                <li>🌐 Axios for HTTP requests</li>
                <li>🧩 Radix UI (avatar, dialog, dropdown, etc.)</li>
                <li>🎬 Framer Motion for animations</li>
                <li>🔐 Google OAuth + Authentication</li>
                <li>🛠️ Utilities: lodash, js-cookie, qs, zod, clsx, lucide-react, next-themes</li>
                <li>🧹 ESLint for code quality</li>
                <li>🐳 Docker support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-sm sm:text-base md:text-lg mb-1">
                Backend
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm md:text-base">
                <li>☕ Java 17 + Spring Boot 3.3.4</li>
                <li>🛢️ MySQL + Hibernate</li>
                <li>🔒 JWT + Google OAuth2</li>
                <li>☁️ Cloudinary (image/video upload)</li>
                <li>✉️ Gmail SMTP for emails</li>
                <li>🛠️ Lombok for code reduction</li>
                <li>✅ Hibernate Validator</li>
                <li>📊 Apache POI (Excel handling)</li>
                <li>🔄 ModelMapper for object mapping</li>
                <li>🛠️ Apache Commons Lang3 + Codec</li>
                <li>🌐 Google API Client</li>
                <li>🎥 FFmpeg for media processing</li>
                <li>🌳 dotenv-java for env variables</li>
                <li>🐳 Docker support</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            🚀 Key Features
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm md:text-base">
            <li>📸 Post images or videos with automatic thumbnail extraction</li>
            <li>🗣️ Comment, like posts, and follow users</li>
            <li>🔍 Search users and posts (with pagination and sorting)</li>
            <li>🔐 Secure authentication via email or Google OAuth</li>
            <li>📬 Password reset via email</li>
            <li>🔒 Role-based access control (RBAC)</li>
            <li>📜 Centralized exception handling</li>
            <li>📈 User activity monitoring</li>
            <li>📝 Comprehensive request and error logging</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            📁 Project Structure
          </h2>
          <h3 className="font-medium text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
            Frontend (React + Vite)
          </h3>
          <pre className="bg-zinc-900 text-white text-xs rounded p-3 sm:p-4 overflow-x-auto">
            {`src/
├── pages/client/       # User facing pages (home, profile)
├── pages/admin/        # Admin dashboard pages
├── pages/auth/         # Authentication pages (login, register)
├── components/         # Reusable UI components
├── services/           # Axios API services
└── main.tsx, App.tsx   # Router & provider setup`}
          </pre>

          <h3 className="font-medium text-sm sm:text-base md:text-lg mt-3 sm:mt-4 mb-1 sm:mb-2">
            Backend (Java + Spring Boot)
          </h3>
          <pre className="bg-zinc-900 text-white text-xs rounded p-3 sm:p-4 overflow-x-auto">
            {`src/main/java/com/moe/socialnetwork/
├── api/              # Controllers, Services, DTOs
├── auth/             # OAuth2 + JWT authentication
├── jpa/              # JPA repositories
├── models/           # Entity classes
├── config/           # Security & system configs
├── util/             # Helper classes
└── Application.java  # Main application`}
          </pre>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            🌐 Deployment
          </h2>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm md:text-base">
            <li>Frontend: Vercel (<a href="https://moechan.vercel.app/client/home" className="text-blue-500 hover:underline">moechan.vercel.app</a>)</li>
            <li>Backend: Render (Note: ~1 min startup time)</li>
            <li>Database: MySQL on Railway</li>
            <li>Media: Cloudinary for image/video hosting</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            ⚙️ Installation & Setup
          </h2>
          <h3 className="font-medium text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
            Frontend
          </h3>
          <pre className="bg-zinc-900 text-white text-xs rounded p-3 sm:p-4 overflow-x-auto">
            {`cd Moe_fe
npm install
npm run dev`}
          </pre>

          <h3 className="font-medium text-sm sm:text-base md:text-lg mt-3 sm:mt-4 mb-1 sm:mb-2">
            Backend
          </h3>
          <pre className="bg-zinc-900 text-white text-xs rounded p-3 sm:p-4 overflow-x-auto">
            {`cd Moe
mvn clean install
java -jar target/moe-0.0.1-SNAPSHOT.jar`}
          </pre>

          <h3 className="font-medium text-sm sm:text-base md:text-lg mt-3 sm:mt-4 mb-1 sm:mb-2">
            Required .env Variables
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
            📸 Screenshots
          </h2>
          <h3 className="font-medium text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
            Frontend Screenshots
          </h3>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm md:text-base">
            <li><img src={image54359} alt="App preview" /></li>
            <li><img src={image54412} alt="App preview" /></li>
            <li><img src={image54460} alt="App preview" /></li>
            <li><img src={image54481} alt="App preview" /></li>
            <li><img src={image54574} alt="App preview" /></li>
            <li><img src={image54617} alt="App preview" /></li>
            <li><img src={image54636} alt="App preview" /></li>
            <li><img src={image54657} alt="App preview" /></li>
            <li><img src={image54686} alt="App preview" /></li>
            <li><img src={image55216} alt="App preview" /></li>
            <li><img src={image55234} alt="App preview" /></li>
            <li><img src={image54737} alt="App preview" /></li>
            <li><img src={image54759} alt="App preview" /></li>
            <li><img src={image55087} alt="App preview" /></li>
            <li><img src={image55101} alt="App preview" /></li>
            <li><img src={image55126} alt="App preview" /></li>
            <li><img src={image55146} alt="App preview" /></li>
          </ul>

          <h3 className="font-medium text-sm sm:text-base md:text-lg mt-3 sm:mt-4 mb-1 sm:mb-2">
            Backend Screenshots
          </h3>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm md:text-base">
            <li><img src={image55878} alt="App preview" /></li>
            <li><img src={image55899} alt="App preview" /></li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            👨‍💻 Author
          </h2>
          <p className="text-xs sm:text-sm md:text-base">
            Developed by: <b>nhutnm379</b>
          </p>
        </section>

        <section className="mb-16 sm:mb-32">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3">
            📜 License
          </h2>
          <p className="text-xs sm:text-sm md:text-base">
            The Moe project is open for use, modification, and deployment under a permissive license.
          </p>
        </section>
      </div>
    </ScrollArea>
  );
}