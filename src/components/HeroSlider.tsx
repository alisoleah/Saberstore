import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Flash Sale: Up to 40% Off!',
    subtitle: 'Limited time offers on top brands',
    cta: 'Shop Now',
    bgColor: 'from-[#003366] to-[#004488]',
    image: 'https://images.unsplash.com/photo-1741061963569-9d0ef54d10d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
  },
  {
    id: 2,
    title: 'Pay in Installments - 0% Interest',
    subtitle: 'Buy now, pay later with our MiniCash program',
    cta: 'Learn More',
    bgColor: 'from-[#FF6600] to-[#FF8833]',
    image: 'https://images.unsplash.com/photo-1758488438758-5e2eedf769ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
  },
  {
    id: 3,
    title: 'New Arrivals: Latest Tech',
    subtitle: 'Discover the newest smartphones and laptops',
    cta: 'Explore',
    bgColor: 'from-[#1A1A1A] to-[#333333]',
    image: 'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800',
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-lg">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-500 ${
            index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
        >
          <div className={`h-full bg-gradient-to-r ${slide.bgColor} flex items-center`}>
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-white space-y-4">
                  <h2 className="text-white">
                    {slide.title}
                  </h2>
                  <p className="text-white/90 text-lg">
                    {slide.subtitle}
                  </p>
                  <button className="bg-[#FF6600] hover:bg-[#FF6600]/90 text-white px-8 py-3 rounded-lg transition-colors">
                    {slide.cta}
                  </button>
                </div>
                <div className="hidden md:block">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-auto object-contain max-h-[400px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
