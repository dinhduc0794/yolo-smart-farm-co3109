import React from 'react';
import { Award, Gift, Calendar, ArrowRight } from 'lucide-react';

// Dữ liệu các tính năng
const featuresData = [
  {
    title: "Quản Lý Nông Trại",
    description: "Dễ dàng kiểm soát tất cả thiết bị thông minh trong nông trại của bạn từ một ứng dụng duy nhất. Điều chỉnh hệ thống tưới tiêu, nhiệt độ nhà kính, camera giám sát và hơn thế nữa chỉ với một vài thao tác trên điện thoại hoặc giọng nói.",
    icon: <Award className="w-6 h-6 text-white" aria-label="Award Icon" />,
    backgroundImage: "src/images/img-box-1.webp"
  },
  {
    title: "Tiết Kiệm Tài Nguyên",
    description: "Hệ thống Smart Farm giúp tối ưu hóa việc sử dụng nước, phân bón và năng lượng bằng cách tự động điều chỉnh theo điều kiện thời tiết và nhu cầu của cây trồng. Nhận thông báo và báo cáo chi tiết để quản lý hiệu quả hơn.",
    icon: <Gift className="w-6 h-6 text-white" aria-label="Gift Icon" />,
    backgroundImage: "src/images/img-box-2.webp"
  }
];

// Dữ liệu tin tức
const newsData = [
  {
    title: "Triển lãm Nông Nghiệp Thông Minh 2025",
    date: "25/03/2025",
    description: "Sự kiện trưng bày các công nghệ nông nghiệp thông minh mới nhất với sự tham gia của các thương hiệu hàng đầu trong lĩnh vực.",
    image: "src/images/news-1.png"
  },
  {
    title: "Ra mắt ứng dụng Smart Farm phiên bản mới",
    date: "20/03/2025",
    description: "Cập nhật với giao diện người dùng được cải tiến và thêm nhiều tính năng phân tích dữ liệu nông nghiệp thông minh.",
    image: "src/images/news-2.jpg"
  }
];

// Component Badge Icon
const IconBadge = ({ children, className = '' }) => (
  <div className={`w-12 h-12 rounded-full bg-white/10 flex items-center justify-center ${className}`}>
    {children}
  </div>
);

// Component Section Heading
const SectionHeading = ({ icon, title }) => (
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
      {icon}
    </div>
    <h2 className="text-xl font-semibold">{title}</h2>
  </div>
);

// Component Feature Card
const FeatureCard = ({ title, description, icon, backgroundImage }) => (
  <div
    className="group relative overflow-hidden hover:shadow-2xl transition-shadow rounded-lg bg-cover bg-center min-h-[300px] p-6 flex flex-col justify-between text-white"
    style={{ backgroundImage: `url('${backgroundImage}')` }}
  >
    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />

    <div className="relative z-10 transition-transform transform group-hover:scale-105">
      <h3 className="text-2xl font-bold mb-4 group-hover:text-white text-white">
        {title}
      </h3>
      <p className="text-gray-200 leading-relaxed group-hover:text-gray-100">
        {description}
      </p>
    </div>

    <div className="mt-4 relative z-10">
      <IconBadge>{icon}</IconBadge>
    </div>
  </div>
);

// Component News Card
const NewsCard = ({ title, date, description, image }) => (
  <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
    <div className="md:w-1/3 h-48 md:h-auto">
      <img src={image} alt={title} className="w-full h-full object-cover" />
    </div>
    <div className="flex-1 p-4">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Calendar className="w-4 h-4" />
        <span>{date}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <button className="flex items-center gap-2 text-green-500 hover:text-green-600 transition-colors">
        Xem thêm
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </div>
);

// Component Check Icon
const CheckIcon = () => (
  <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-label="Check Icon">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Component Chính SmartFarmService
const SmartFarmService = () => (
  <div className="flex flex-col w-full max-w-7xl mx-auto p-6 space-y-8">
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">
        Smart Farm Service - Trải nghiệm quản lý nông trại thông minh
      </h1>
    </div>

    <section className="flex flex-col md:flex-row gap-8 items-center">
      <div className="flex-1 space-y-4">
        <SectionHeading
          icon={<CheckIcon />}
          title="Hiệu Quả & Bền Vững"
        />
        <p className="text-gray-600 leading-relaxed w-1/2">
          Tối ưu hóa sản xuất nông nghiệp với hệ thống giám sát thông minh, cảm biến độ ẩm đất, nhiệt độ và ánh sáng. Phân tích dữ liệu thời gian thực giúp đưa ra quyết định chính xác, tăng năng suất và phát triển bền vững.
        </p>
      </div>
    </section>

    <section className="grid md:grid-cols-2 gap-6 mt-8">
      {featuresData.map((feature, index) => (
        <FeatureCard
          key={index}
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          backgroundImage={feature.backgroundImage}
        />
      ))}
    </section>

    <section className="mt-12">
      <SectionHeading
        icon={<Calendar className="w-4 h-4 text-white" />}
        title="Tin Tức & Sự Kiện"
      />
      <div className="mt-6 space-y-6">
        {newsData.map((news, index) => (
          <NewsCard
            key={index}
            title={news.title}
            date={news.date}
            description={news.description}
            image={news.image}
          />
        ))}
      </div>
    </section>
  </div>
);

export default SmartFarmService;