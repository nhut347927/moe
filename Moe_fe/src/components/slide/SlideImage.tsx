import { X } from "lucide-react";
import { useState } from "react";

interface SlideProps {
  images: string[];
  showSlider: boolean;
  setShowSlider: (value: boolean) => void;
}

export default function Slide({ images, showSlider, setShowSlider }: SlideProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!showSlider) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
      <button
        type="button"
        className="absolute top-4 right-4 text-white"
        onClick={() => setShowSlider(false)}
      >
        <X className="w-8 h-8" />
      </button>

      <div className="relative w-full max-w-4xl flex items-center">
        <button
          type="button"
          onClick={() =>
            setCurrentSlide((prev) => (prev > 0 ? prev - 1 : images.length - 1))
          }
          className="absolute left-4 text-white text-3xl z-10"
        >
          ‹
        </button>
        <img
          src={`https://res.cloudinary.com/dwv76nhoy/image/upload/${images[currentSlide]}`}
          className="max-h-[80vh] object-contain mx-auto"
        />
        <button
          type="button"
          onClick={() =>
            setCurrentSlide((prev) => (prev < images.length - 1 ? prev + 1 : 0))
          }
          className="absolute right-4 text-white text-3xl z-10"
        >
          ›
        </button>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? "bg-white" : "bg-gray-500"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
