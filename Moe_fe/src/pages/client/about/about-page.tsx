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
    <ScrollArea className="w-full h-screen overflow-auto">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 text-zinc-800 dark:text-zinc-100 space-y-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center break-words">
          🌟 About Moe
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-center mt-4 mx-auto max-w-3xl break-words">
          Moe is a modern social media platform that combines <b>video viewing</b> and <b>community interaction</b>. 
          The application is built with a separated Frontend and Backend architecture for scalability and maintainability.
        </p>

        <section>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 break-words">
            🧩 Technologies Used
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div>
              <h3 className="font-medium text-lg sm:text-xl lg:text-2xl mb-2 break-words">
                Frontend
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base lg:text-lg break-words">
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
              <h3 className="font-medium text-lg sm:text-xl lg:text-2xl mb-2 break-words">
                Backend
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base lg:text-lg break-words">
                <li>☕ Java 17 + Spring Boot 3.3.4</li>
                <li>🛢️ MySQL + Hibernate</li>
                <li>🔒 JWT + Google OAuth2</li>
                <li>☁️ Cloudinary (image/video upload)</li>
                <li>✉️ Gmail SMTP for emails</li>
                <li>🛠️ Lombok for code reduction</li>
                <li>✅ Hibernate Validator</li>
                <li>🔄 ModelMapper for object mapping</li>
                <li>🌐 Google API Client</li>
                <li>🎥 FFmpeg for media processing</li>
                <li>🌳 dotenv-java for env variables</li>
                <li>🐳 Docker support</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 break-words">
            🚀 Key Features
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base lg:text-lg break-words">
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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 break-words">
            📁 Project Structure
          </h2>
          <h3 className="font-medium text-lg sm:text-xl lg:text-2xl mb-2 break-words">
            Frontend (React + Vite)
          </h3>
          <div className="w-full max-w-full overflow-x-auto">
            <pre className="bg-zinc-900 text-white text-sm rounded p-4 whitespace-pre-wrap break-words">
              {`src/
├── pages/client/       # User facing pages (home, profile)
├── pages/admin/        # Admin dashboard pages
├── pages/auth/         # Authentication pages (login, register)
├── components/         # Reusable UI components
├── services/           # Axios API services
└── main.tsx, App.tsx   # Router & provider setup`}
            </pre>
          </div>

          <h3 className="font-medium text-lg sm:text-xl lg:text-2xl mt-6 mb-2 break-words">
            Backend (Java + Spring Boot)
          </h3>
          <div className="w-full max-w-full overflow-x-auto">
            <pre className="bg-zinc-900 text-white text-sm rounded p-4 whitespace-pre-wrap break-words">
              {`src/main/java/com/moe/socialnetwork/
├── api/              # Controllers, Services, DTOs
├── auth/             # OAuth2 + JWT authentication
├── jpa/              # JPA repositories
├── models/           # Entity classes
├── config/           # Security & system configs
├── util/             # Helper classes
└── Application.java  # Main application`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 break-words">
            🌐 Deployment
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base lg:text-lg break-words">
            <li>Frontend: Vercel (<a href="https://moechan.vercel.app/client/home" className="text-blue-500 hover:underline break-all">moechan.vercel.app</a>)</li>
            <li>Backend: Render (Note: ~1 min startup time)</li>
            <li>Database: MySQL on Railway</li>
            <li>Media: Cloudinary for image/video hosting</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 break-words">
            ⚙️ Installation & Setup
          </h2>
          <h3 className="font-medium text-lg sm:text-xl lg:text-2xl mb-2 break-words">
            Frontend
          </h3>
          <div className="w-full max-w-full overflow-x-auto">
            <pre className="bg-zinc-900 text-white text-sm rounded p-4 whitespace-pre-wrap break-words">
              {`cd Moe_fe
npm install
npm run dev`}
            </pre>
          </div>

          <h3 className="font-medium text-lg sm:text-xl lg:text-2xl mt-6 mb-2 break-words">
            Backend
          </h3>
          <div className="w-full max-w-full overflow-x-auto">
            <pre className="bg-zinc-900 text-white text-sm rounded p-4 whitespace-pre-wrap break-words">
              {`cd Moe
mvn clean install
java -jar target/moe-0.0.1-SNAPSHOT.jar`}
            </pre>
          </div>

          <h3 className="font-medium text-lg sm:text-xl lg:text-2xl mt-6 mb-2 break-words">
            Required .env Variables
          </h3>
          <div className="w-full max-w-full overflow-x-auto">
            <pre className="bg-zinc-900 text-white text-sm rounded p-4 whitespace-pre-wrap break-words">
              {`DB_USERNAME=
DB_PASSWORD=
APP_JWT_SECRET=
GOOGLE_CLIENT_ID=
CLOUDINARY_API_KEY=
SPRING_MAIL_USERNAME=
...`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 break-words">
            📸 Screenshots
          </h2>
          <h3 className="font-medium text-lg sm:text-xl lg:text-2xl mb-2 break-words">
            Frontend Screenshots
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              image54359, image54412, image54460, image54481, image54574,
              image54617, image54636, image54657, image54686, image55216,
              image55234, image54737, image54759, image55087, image55101,
              image55126, image55146
            ].map((img, index) => (
              <div key={index} className="w-full">
                <img
                  src={img}
                  alt={`Frontend screenshot ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-md object-contain"
                />
              </div>
            ))}
          </div>

          <h3 className="font-medium text-lg sm:text-xl lg:text-2xl mt-6 mb-2 break-words">
            Backend Screenshots
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[image55878, image55899].map((img, index) => (
              <div key={index} className="w-full">
                <img
                  src={img}
                  alt={`Backend screenshot ${index + 1}`}
                  className="w-full h-auto rounded-lg shadow-md object-contain"
                />
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 break-words">
            👨‍💻 Author
          </h2>
          <p className="text-sm sm:text-base lg:text-lg break-words">
            Developed by: <b>nhutnm379</b>
          </p>
        </section>
      </div>
      
    </ScrollArea>
  );
}