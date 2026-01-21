'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  rank: string;
  tagline?: string;
  quote: string;
}

interface TestimonialsCarouselProps {
  items: Testimonial[];
}

export default function TestimonialsCarousel({ items }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
        zIndex: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
      };
    }
  };

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = items.length - 1;
      if (nextIndex >= items.length) nextIndex = 0;
      return nextIndex;
    });
  }, [items.length]);

  // Reset timer when currentIndex changes (manual or auto)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      paginate(1);
    }, 8000);

    return () => clearInterval(timer);
  }, [isPaused, paginate, currentIndex]); // Added currentIndex to dependencies

  const currentTestimonial = items[currentIndex];

  return (
    <div
      className="relative w-full max-w-4xl mx-auto px-4 md:px-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Buttons */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={() => paginate(-1)}
          className="p-2 rounded-full bg-background-elevated border border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-primary"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={() => paginate(1)}
          className="p-2 rounded-full bg-background-elevated border border-brand-primary/30 text-brand-primary hover:bg-brand-primary hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-primary"
          aria-label="Next testimonial"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Carousel Container */}
      {/* We use a grid layout to overlap the items easily without absolute positioning hacks for height */}
      <div className="relative overflow-hidden min-h-[450px] md:min-h-[300px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", ease: "easeInOut", duration: 0.5 },
              opacity: { duration: 0.2 }
            }}
            className="absolute top-0 left-0 w-full h-full flex justify-center items-center px-4"
          >
             <Card variant="surface" className="w-full max-w-3xl bg-background-elevated/50 backdrop-blur-sm border-brand-primary/20 h-full">
              <CardContent className="p-6 md:p-12 flex flex-col items-start text-left h-full justify-center">
                <div className="mb-6">
                  <div className="font-bold text-lg text-brand-300">
                    {currentTestimonial.name}
                  </div>
                  <div className="text-text-muted text-sm mt-1 flex flex-wrap items-center justify-start gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-brand-primary/20 text-brand-200 text-xs border border-brand-primary/30">
                      {currentTestimonial.role}
                    </span>
                    <span className="w-1 h-1 bg-text-muted rounded-full"></span>
                    <span>{currentTestimonial.rank}</span>
                    {currentTestimonial.tagline && (
                      <span className="text-text-muted opacity-80">
                        - {currentTestimonial.tagline}
                      </span>
                    )}
                  </div>
                </div>

                <blockquote className="text-lg md:text-xl text-text-primary font-medium mb-8 leading-relaxed relative z-10 border-none pl-0">
                  "{currentTestimonial.quote}"
                </blockquote>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-8">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-cyan-primary w-6'
                : 'bg-brand-primary/30 hover:bg-brand-primary/60'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
