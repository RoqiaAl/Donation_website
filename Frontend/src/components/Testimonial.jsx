import React, { useState, useEffect, useRef } from "react";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import apiClient from "../hooks/apiClient";

const TestimonialCarousel = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef(null);

  // Fetch testimonials on mount
  useEffect(() => {
    apiClient
      .get("/api/testimonials")
      .then((res) => {
        if (res.data.success) {
          const mapped = res.data.testimonials.map((t) => ({
            ...t,
            image: t.imageUrl
              ? apiClient.defaults.baseURL + t.imageUrl
              : "/default-avatar.png",
          }));
          setTestimonials(mapped);
        } else {
          setError("Failed to load testimonials");
        }
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // Auto-play with smooth transitions
  useEffect(() => {
    if (!isAutoPlaying || !testimonials.length) return;

    const startTransition = () => {
      setIsTransitioning(true);
      timerRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % testimonials.length;
          setIsTransitioning(false);
          return nextIndex;
        });
      }, 500); // Match this with your CSS transition duration
    };

    const interval = setInterval(() => {
      startTransition();
    }, 5000); // Change slide every 5 seconds

    return () => {
      clearInterval(interval);
      clearTimeout(timerRef.current);
    };
  }, [isAutoPlaying, testimonials]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      setIsTransitioning(false);
    }, 50);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex - 1 + testimonials.length) % testimonials.length
      );
      setIsTransitioning(false);
    }, 50);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setCurrentIndex(index);
  };

  if (loading) {
    return <div className="py-16 text-center text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="py-16 text-center text-red-600">{error}</div>;
  }

  // Calculate indices for visible cards
  const getVisibleIndices = () => {
    const indices = [];
    const count = testimonials.length;
    
    // Always show 3 cards (previous, current, next)
    indices.push((currentIndex - 1 + count) % count);
    indices.push(currentIndex);
    indices.push((currentIndex + 1) % count);

    return indices;
  };

  return (
    <section className="py-16 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1598D2] mb-3">
            What Our Supporters Say
          </h2>
          <div className="w-24 h-1 bg-[#F4B5AE] mx-auto mb-4" />
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from those who have partnered with us in our mission to improve
            global health
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Carousel Container */}
          <div className={`flex ${isTransitioning ? 'opacity-90' : 'opacity-100'} transition-opacity duration-300`}>
            {getVisibleIndices().map((index, i) => {
              const testimonial = testimonials[index];
              const position = i === 0 ? 'left' : i === 1 ? 'center' : 'right';
              const transformClass = position === 'left' 
                ? '-translate-x-2 md:-translate-x-10' 
                : position === 'right' 
                ? 'translate-x-2 md:translate-x-10' 
                : 'translate-x-0';
              
              return (
                <div 
                  key={`${index}-${position}`}
                  className={`w-full md:w-1/3 px-4 transition-all duration-500 ease-in-out ${transformClass} ${
                    position === 'center' ? 'z-10' : 'z-0'
                  }`}
                >
                  <TestimonialCard
                    testimonial={testimonial}
                    isActive={position === 'center'}
                    onReadMore={() => goToSlide(index)}
                  />
                </div>
              );
            })}
          </div>

          {/* Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-3 rounded-full shadow-lg hover:bg-[#F4B5AE] hover:text-white transition-colors z-20 focus:outline-none focus:ring-2 focus:ring-[#1598D2]"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="text-[#1598D2]" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-3 rounded-full shadow-lg hover:bg-[#F4B5AE] hover:text-white transition-colors z-20 focus:outline-none focus:ring-2 focus:ring-[#1598D2]"
            aria-label="Next testimonial"
          >
            <FaChevronRight className="text-[#1598D2]" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "bg-[#1598D2] w-6" : "bg-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#F4B5AE]`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonial Card Component
const TestimonialCard = React.memo(({ testimonial, isActive, onReadMore = () => {} }) => {
  if (!testimonial) return null;
  const { name, role, content, image, email } = testimonial;
  const containerClasses = isActive
    ? "bg-[#1598D2] text-white border-[#1598D2] transform scale-105"
    : "bg-white text-gray-700 border-gray-100 transform scale-100";

  return (
    <div
      className={`h-full rounded-xl p-6 shadow-md border-2 transition-all duration-500 ${containerClasses}`}
    >
      <div className="flex flex-col items-center text-center h-full">
        <div className="mb-4">
          <img
            src={image}
            alt={name}
            className={`w-20 h-20 rounded-full object-cover border-4 ${
              isActive ? "border-white" : "border-[#F4B5AE]"
            } transition-all duration-300`}
            loading="lazy"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <h3
            className={`text-lg font-bold ${
              isActive ? "text-white" : "text-[#1598D2]"
            }`}
          >
            {name}
          </h3>
          <p
            className={`text-sm mb-3 ${
              isActive ? "text-gray-200" : "text-gray-500"
            }`}
          >
            {role}
          </p>
          <div className="relative flex-1">
            <FaQuoteLeft
              className={`absolute -top-2 left-0 text-xl opacity-20 ${
                isActive ? "text-white" : "text-[#F4B5AE]"
              }`}
            />
            <p className="text-sm mb-4 px-2">
              {isActive ? content : `${content.slice(0, 80)}...`}
            </p>
            {!isActive && (
              <button
                className="text-xs text-[#1598D2] hover:underline focus:outline-none focus:ring-2 focus:ring-[#F4B5AE] rounded"
                onClick={onReadMore}
              >
                Read More
              </button>
            )}
          </div>
          <a
            href={`mailto:${email}`}
            className={`text-xs mt-auto hover:underline ${
              isActive ? "text-gray-200" : "text-gray-500"
            }`}
          >
            {email}
          </a>
        </div>
      </div>
    </div>
  );
});

export default TestimonialCarousel;