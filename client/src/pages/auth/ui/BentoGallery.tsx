import React from "react";
import { Heart, MessageCircle, Camera } from "lucide-react";

type Size = "small" | "medium" | "large" | "xlarge";
type OverlayStyle = "neon" | "simple";

type GalleryImage = {
  id: number;
  src: string;
  title: string;
  author: string;
  likes: number;
  comments: number;
  size: Size;
  overlay?: string;
  overlayStyle?: OverlayStyle;
  text?: string;
  badge?: string;
  isAd?: boolean;
};

export default function BentoGallery3D() {
  const images: GalleryImage[] = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1587015566802-5dc157c901cf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg3fHxmb29kfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
      title: "Portrait Beauty",
      author: "lauramathews",
      likes: 120,
      comments: 88,
      size: "large",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1541795795328-f073b763494e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTYyfHxmb29kfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
      title: "Business Style",
      author: "johnsmith",
      likes: 234,
      comments: 45,
      size: "medium",
    },
    {
      id: 3,
      src: "https://plus.unsplash.com/premium_photo-1698867577020-38ae235fd612?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880",
      title: "Ocean Hand",
      author: "oceanvibes",
      likes: 189,
      comments: 67,
      size: "medium",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1564750497011-ead0ce4b9448?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTYxfHxmb29kfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600",
      title: "JS MASTERY",
      author: "techmaster",
      likes: 567,
      comments: 123,
      size: "medium",
      overlay: "JS\nMASTERY",
      overlayStyle: "neon",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1443131307017-4097c8ac7763?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=756",
      title: "Fashion Girl",
      author: "fashionista",
      likes: 445,
      comments: 92,
      size: "large",
      badge: "UGH",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/reserve/bnW1TuTV2YGcoh1HyWNQ_IMG_0207.JPG?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
      title: "Eclipse",
      author: "astronomy",
      likes: 890,
      comments: 156,
      size: "small",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1507273026339-31b655f3752d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
      title: "Travel Together",
      author: "traveler",
      likes: 678,
      comments: 234,
      size: "xlarge",
      text: "Go on a trip with friends",
      isAd: true,
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1511910849309-0dffb8785146?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
      title: "TypeScript",
      author: "developer",
      likes: 345,
      comments: 78,
      size: "medium",
      overlay: "TS",
      overlayStyle: "simple",
    },
  ];

  // Nhân bản để tạo loop mượt khi animate
  const duplicatedImages: GalleryImage[] = [...images, ...images, ...images];
  const column1 = duplicatedImages.filter((_, i) => i % 3 === 0);
  const column2 = duplicatedImages.filter((_, i) => i % 3 === 1);
  const column3 = duplicatedImages.filter((_, i) => i % 3 === 2);

  const getSizeClass = (size: Size) => {
    switch (size) {
      case "small":
        return "h-64";
      case "medium":
        return "h-80";
      case "large":
        return "h-96";
      case "xlarge":
        return "h-[28rem]";
      default:
        return "h-80";
    }
  };

  const ImageCard: React.FC<{
    image: GalleryImage;
    index: number;
    colKey: string;
  }> = ({ image, index }) => (
    <div
      className="relative group mb-6 transition-all duration-500 hover:scale-105 hover:z-50"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className={`relative overflow-hidden rounded-2xl shadow-2xl ${getSizeClass(
          image.size
        )} bg-gray-900`}
      >
        <img
          src={image.src}
          alt={image.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {image.overlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            {image.overlayStyle === "neon" ? (
              <div className="text-center relative">
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 neon-text whitespace-pre-line">
                  {image.overlay}
                </div>
                <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30" />
              </div>
            ) : (
              <div className="text-8xl font-black text-blue-500">
                {image.overlay}
              </div>
            )}
          </div>
        )}

        {image.text && (
          <div className="absolute bottom-6 left-6 right-6">
            <h3 className="text-white text-2xl font-bold drop-shadow-2xl">
              {image.text}
            </h3>
          </div>
        )}

        {image.badge && (
          <div className="absolute top-6 left-6 bg-red-600 text-white px-6 py-2 rounded-xl font-black text-xl shadow-lg">
            {image.badge}
          </div>
        )}

        {image.isAd && (
          <div className="absolute top-6 left-6 bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-medium">
            Advertisement
          </div>
        )}

        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Camera className="w-5 h-5 text-white" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black via-black/95 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {image.author[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-white font-medium">{image.author}</span>
          </div>
          <h3 className="text-white text-lg font-bold mb-2">{image.title}</h3>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              <span className="text-sm font-medium">{image.likes}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{image.comments}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-black overflow-hidden">
      {/* Header chiếm ít không gian, vẫn gói trong 100vh */}
      {/* <div className="max-w-7xl mx-auto text-center pt-8 pb-4 px-4">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-2 neon-title">
          Bento Gallery 3D
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          Immersive Scrolling Experience
        </p>
      </div> */}

      {/* Vùng gallery: chiếm phần còn lại của 100vh */}
      <div className="relative h-[calc(100vh-112px)] px-4">
        {" "}
        {/* 112px ~ chiều cao header (pt-8 pb-4 + text) */}
        {/* mask gradient để mép trên/dưới mượt hơn */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent z-20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent z-20" />
        {/* Container với hiệu ứng 3D, toàn bộ nằm trong h-[calc(...)] */}
        <div className="h-full w-full perspective-container">
          <div className="gallery-3d-wrapper h-full">
            <div className="max-w-7xl mx-auto h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                {/* Mỗi cột có chiều cao vượt khung để tạo cảm giác scroll liên tục,
                    nhưng toàn bộ bị clip trong 100vh nhờ overflow-hidden của root */}
                <div className="animate-scroll-up h-full">
                  {column1.map((image, index) => (
                    <ImageCard
                      key={`col1-${image.id}-${index}`}
                      image={image}
                      index={index}
                      colKey="col1"
                    />
                  ))}
                </div>

                <div className="animate-scroll-down h-full">
                  {column2.map((image, index) => (
                    <ImageCard
                      key={`col2-${image.id}-${index}`}
                      image={image}
                      index={index}
                      colKey="col2"
                    />
                  ))}
                </div>

                <div className="animate-scroll-up-slow h-full hidden lg:block">
                  {column3.map((image, index) => (
                    <ImageCard
                      key={`col3-${image.id}-${index}`}
                      image={image}
                      index={index}
                      colKey="col3"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS keyframes + helpers (dùng <style> thường, không phải styled-jsx) */}
      <style>{`
        .perspective-container {
          perspective: 2000px;
          perspective-origin: center center;
          height: 100%;
        }
        .gallery-3d-wrapper {
          transform: rotateX(10deg) rotateY(-15deg) rotateZ(2deg);
          transform-style: preserve-3d;
          transition: transform 0.5s ease;
          animation: float 6s ease-in-out infinite;
          height: 100%;
        }
        .gallery-3d-wrapper:hover {
          transform: rotateX(5deg) rotateY(-10deg) rotateZ(1deg);
          animation-play-state: paused;
        }

        @keyframes float {
          0%, 100% {
            transform: rotateX(10deg) rotateY(-15deg) rotateZ(2deg) translateY(0px);
          }
          50% {
            transform: rotateX(12deg) rotateY(-18deg) rotateZ(3deg) translateY(-10px);
          }
        }

        /* Animate các cột trong khung 100vh: 
           - Nội dung cột dài hơn container, nên translate tạo cảm giác flow liên tục
           - Thời gian có thể điều chỉnh để nhanh/chậm */
        @keyframes scroll-up {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
          0%   { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-scroll-up {
          animation: scroll-up 50s linear infinite;
          will-change: transform;
        }
        .animate-scroll-down {
          animation: scroll-down 50s linear infinite;
          will-change: transform;
        }
        .animate-scroll-up-slow {
          animation: scroll-up 70s linear infinite;
          will-change: transform;
        }

        .neon-text {
          text-shadow:
            0 0 10px rgba(139, 92, 246, 1),
            0 0 20px rgba(139, 92, 246, 0.8),
            0 0 30px rgba(139, 92, 246, 0.6),
            0 0 40px rgba(139, 92, 246, 0.4),
            0 0 70px rgba(139, 92, 246, 0.2);
          animation: neon-flicker 2s ease-in-out infinite;
        }
        .neon-title {
          background: linear-gradient(to right, #8b5cf6, #ec4899, #8b5cf6);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease infinite;
        }
        @keyframes neon-flicker {
          0%, 100% {
            text-shadow:
              0 0 10px rgba(139, 92, 246, 1),
              0 0 20px rgba(139, 92, 246, 0.8),
              0 0 30px rgba(139, 92, 246, 0.6);
          }
          50% {
            text-shadow:
              0 0 15px rgba(139, 92, 246, 1),
              0 0 30px rgba(139, 92, 246, 0.9),
              0 0 45px rgba(139, 92, 246, 0.7);
          }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% center; }
          50%      { background-position: 100% center; }
        }

        @media (hover: hover) {
          .animate-scroll-up:hover,
          .animate-scroll-down:hover,
          .animate-scroll-up-slow:hover {
            animation-play-state: paused;
          }
        }
      `}</style>
    </div>
  );
}
