import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Facebook,
  Globe,
  Heart,
  Instagram,
  Mail,
  MessageSquare,
  Phone,
  Shield,
  Twitter,
  Users,
  Youtube,
  Zap,
} from "lucide-react";
import { lazy, Suspense } from "react";
import { useInView } from "react-intersection-observer";
import img from "../../../assets/images/ChatGPT Image 14_21_21 21 thg 4, 2025.png";
const Spline = lazy(() => import("@splinetool/react-spline"));
export default function AboutPage() {
  const features = [
    {
      icon: <MessageSquare className="h-10 w-10 text-blue-500" />,
      title: "Trò chuyện thời gian thực",
      description:
        "Kết nối ngay lập tức với bạn bè thông qua tin nhắn văn bản, hình ảnh và video.",
    },
    {
      icon: <Users className="h-10 w-10 text-blue-500" />,
      title: "Nhóm & Cộng đồng",
      description:
        "Tạo và tham gia các nhóm dựa trên sở thích, đam mê hoặc mối quan hệ của bạn.",
    },
    {
      icon: <Globe className="h-10 w-10 text-blue-500" />,
      title: "Khám phá nội dung",
      description:
        "Tìm kiếm và khám phá nội dung mới từ khắp nơi trên thế giới.",
    },
    {
      icon: <Shield className="h-10 w-10 text-blue-500" />,
      title: "Bảo mật & Riêng tư",
      description:
        "Kiểm soát hoàn toàn về quyền riêng tư và bảo mật thông tin cá nhân của bạn.",
    },
    {
      icon: <Zap className="h-10 w-10 text-blue-500" />,
      title: "Trải nghiệm nhanh chóng",
      description:
        "Giao diện người dùng mượt mà và phản hồi nhanh trên mọi thiết bị.",
    },
    {
      icon: <Heart className="h-10 w-10 text-blue-500" />,
      title: "Cá nhân hóa",
      description:
        "Tùy chỉnh trải nghiệm của bạn với các chủ đề, bố cục và tùy chọn hiển thị.",
    },
  ];
    // Track if HeroSection is in view to show/hide Spline
    const { ref: heroRef, inView: isHeroInView } = useInView({
      threshold: 0.1, // Trigger when 10% of HeroSection is visible
    });
  return (
    <div className="h-screen max-h-screen p-2" data-scroll-ignore>
      <div className="h-full rounded-3xl overflow-y-auto overflow-x-hidden scroll-but-hidden bg-white/50 dark:bg-zinc-800/70">
        <section  ref={heroRef} className="relative w-full h-screen bg-black">
          <div className="container mx-auto px-4 h-full flex flex-col lg:flex-row items-center justify-between pt-20 lg:pt-0">
            <div className="lg:w-1/2 z-10">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                Kết nối. Chia sẻ. Khám phá.
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-xl">
                Nền tảng mạng xã hội mới nhất giúp bạn kết nối với bạn bè, chia
                sẻ khoảnh khắc và khám phá nội dung mới mỗi ngày.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/auth/register"
                  className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-lg bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white transition-colors duration-200"
                >
                  Đăng ký ngay
                </Link>
                <Link
                  to="/auth/about"
                  className="inline-flex items-center justify-center px-6 py-3 text-lg font-semibold rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-800 transition-colors duration-200"
                >
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 h-[500px] lg:h-[700px] mt-8 lg:mt-0">
            {isHeroInView ? (
              <Suspense fallback={<div className="text-gray-200">Loading Spline...</div>}>
                <Spline scene="https://prod.spline.design/kmIaCnxs3mfjqGRJ/scene.splinecode" />
              </Suspense>
            ) : (
              <div className="h-full w-full bg-gray-900 rounded-lg" />
            )}
            </div>
            
          </div>
          
        </section>
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Về Chúng Tôi
              </h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                Chúng tôi xây dựng nền tảng mạng xã hội với mục tiêu kết nối mọi
                người, chia sẻ trải nghiệm và tạo ra một cộng đồng lành mạnh.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img
                  src={img}
                  alt="Mạng xã hội kết nối mọi người"
                  width={600}
                  height={600}
                  className="rounded-lg shadow-md shadow-gray-800"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-white">
                  Sứ mệnh của chúng tôi
                </h3>
                <p className="text-gray-200 mb-6">
                  Chúng tôi tin rằng công nghệ có thể mang mọi người lại gần
                  nhau hơn. Nền tảng của chúng tôi được thiết kế để giúp bạn:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-800 flex items-center justify-center mr-3 mt-1">
                      <span className="text-blue-400 text-sm font-bold">✓</span>
                    </div>
                    <p className="text-gray-200">
                      <span className="font-semibold">Kết nối</span> với bạn bè
                      và gia đình, dù họ ở bất kỳ đâu trên thế giới
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-800 flex items-center justify-center mr-3 mt-1">
                      <span className="text-blue-400 text-sm font-bold">✓</span>
                    </div>
                    <p className="text-gray-200">
                      <span className="font-semibold">Chia sẻ</span> những
                      khoảnh khắc quan trọng trong cuộc sống của bạn
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-800 flex items-center justify-center mr-3 mt-1">
                      <span className="text-blue-400 text-sm font-bold">✓</span>
                    </div>
                    <p className="text-gray-200">
                      <span className="font-semibold">Khám phá</span> nội dung
                      mới và thú vị từ khắp nơi trên thế giới
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-800 flex items-center justify-center mr-3 mt-1">
                      <span className="text-blue-400 text-sm font-bold">✓</span>
                    </div>
                    <p className="text-gray-200">
                      <span className="font-semibold">Xây dựng</span> cộng đồng
                      xung quanh sở thích và đam mê của bạn
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Tính năng nổi bật
              </h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
              <p className="text-lg text-gray-200 max-w-3xl mx-auto">
                Khám phá những tính năng giúp nền tảng của chúng tôi trở nên đặc
                biệt và hữu ích cho người dùng.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-8 rounded-lg shadow-lg transition-transform duration-300 hover:transform hover:-translate-y-2"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Chính sách nội dung
              </h2>
              <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
            </div>

            <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
              <div className="mb-6 border border-yellow-400 bg-black rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1" />
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Miễn trừ trách nhiệm
                    </h2>
                    <p className="text-gray-200 mt-2">
                      Chúng tôi không chịu trách nhiệm về bất kỳ nội dung nào
                      được đăng tải bởi người dùng trên nền tảng của chúng tôi.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 text-gray-200">
                <p>
                  Nền tảng của chúng tôi là một không gian mở cho người dùng
                  chia sẻ ý kiến, hình ảnh và nội dung khác. Tuy nhiên, chúng
                  tôi muốn nhấn mạnh rằng:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <span className="font-semibold">
                      Chúng tôi không chịu trách nhiệm
                    </span>{" "}
                    về bất kỳ nội dung nào được đăng tải bởi người dùng trên nền
                    tảng.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Nếu phát hiện nội dung vi phạm
                    </span>{" "}
                    các quy định của chúng tôi hoặc pháp luật, chúng tôi sẽ gỡ
                    bỏ nhanh nhất có thể.
                  </li>
                  <li>
                    <span className="font-semibold">
                      Chúng tôi khuyến khích người dùng
                    </span>{" "}
                    báo cáo nội dung không phù hợp để chúng tôi có thể xem xét
                    và xử lý kịp thời.
                  </li>
                  <li>
                    <span className="font-semibold">Chúng tôi cam kết</span> duy
                    trì một môi trường an toàn và tích cực cho tất cả người
                    dùng.
                  </li>
                </ul>

                <p className="font-semibold">
                  Bằng cách sử dụng nền tảng của chúng tôi, bạn đồng ý tuân thủ
                  các quy định và chính sách của chúng tôi, đồng thời chịu trách
                  nhiệm về nội dung bạn đăng tải.
                </p>

                <div className="bg-blue-800 p-4 rounded-lg mt-6">
                  <p className="text-blue-200 font-medium">
                    Chúng tôi cam kết xem xét và xử lý các báo cáo về nội dung
                    vi phạm trong vòng 24 giờ. Sự an toàn của cộng đồng là ưu
                    tiên hàng đầu của chúng tôi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <footer className="bg-black text-white pt-16 pb-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-bold mb-4">Về chúng tôi</h3>
                <p className="text-gray-200 mb-4">
                  Nền tảng mạng xã hội kết nối mọi người, chia sẻ khoảnh khắc và
                  khám phá nội dung mới mỗi ngày.
                </p>
                <div className="flex space-x-4">
                  <Link
                    to="#"
                    className="text-gray-200 hover:text-gray-100 transition-colors"
                  >
                    <Facebook size={20} />
                  </Link>
                  <Link
                    to="#"
                    className="text-gray-200 hover:text-gray-100 transition-colors"
                  >
                    <Twitter size={20} />
                  </Link>
                  <Link
                    to="#"
                    className="text-gray-200 hover:text-gray-100 transition-colors"
                  >
                    <Instagram size={20} />
                  </Link>
                  <Link
                    to="#"
                    className="text-gray-200 hover:text-gray-100 transition-colors"
                  >
                    <Youtube size={20} />
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Liên kết</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="#"
                      className="text-gray-200 hover:text-gray-100 transition-colors"
                    >
                      Trang chủ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="text-gray-200 hover:text-gray-100 transition-colors"
                    >
                      Về chúng tôi
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="text-gray-200 hover:text-gray-100 transition-colors"
                    >
                      Tính năng
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="text-gray-200 hover:text-gray-100 transition-colors"
                    >
                      Đăng ký
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="text-gray-200 hover:text-gray-100 transition-colors"
                    >
                      Đăng nhập
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Chính sách</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to="#"
                      className="text-gray-200 hover:text-gray-100 transition-colors"
                    >
                      Điều khoản sử dụng
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="text-gray-200 hover:text-gray-100 transition-colors"
                    >
                      Chính sách bảo mật
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="text-gray-200 hover:text-gray-100 transition-colors"
                    >
                      Quy định cộng đồng
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="text-gray-200 hover:text-gray-100 transition-colors"
                    >
                      Chính sách nội dung
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="text-gray-200 hover:text-gray-100 transition-colors"
                    >
                      Chính sách cookie
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Mail className="mr-2 h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200">support@example.com</span>
                  </li>
                  <li className="flex items-start">
                    <Phone className="mr-2 h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200">+84 123 456 789</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-8">
              <p className="text-center text-gray-200">
                © {new Date().getFullYear()} Mạng xã hội. Tất cả các quyền được
                bảo lưu.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
