/**
 * Image Carousel Component
 * Exibe carrossel de imagens de restaurante
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface CarouselImage {
  id: number;
  image_url: string;
  alt_text?: string;
  is_primary?: boolean;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  restaurantName?: string;
  onImageClick?: (image: CarouselImage) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showThumbnails?: boolean;
  className?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  restaurantName = 'Restaurant',
  onImageClick,
  autoPlay = true,
  autoPlayInterval = 5000,
  showThumbnails = true,
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className={cn('w-full bg-gray-100 rounded-lg flex items-center justify-center', className)}>
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma imagem disponível</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
      {/* Main Carousel */}
      <div className={cn('relative w-full bg-black rounded-lg overflow-hidden group', className)}>
        {/* Image Container */}
        <div className="relative w-full aspect-video overflow-hidden">
          <img
            src={currentImage.image_url}
            alt={currentImage.alt_text || `${restaurantName} - Imagem ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
            onClick={() => setIsFullscreen(true)}
          />

          {/* Overlay com informações */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="text-white text-sm">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Imagem anterior"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Próxima imagem"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                )}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToSlide(index)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                index === currentIndex ? 'border-blue-500' : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <img
                src={image.image_url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            aria-label="Fechar"
          >
            <X size={32} />
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={currentImage.image_url}
              alt={currentImage.alt_text || `${restaurantName} - Imagem ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation em fullscreen */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 text-white hover:text-gray-300 p-2"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft size={40} />
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-4 text-white hover:text-gray-300 p-2"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight size={40} />
                </button>
              </>
            )}

            {/* Contador em fullscreen */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageCarousel;
