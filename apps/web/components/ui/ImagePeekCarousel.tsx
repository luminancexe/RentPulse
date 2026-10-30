"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CarouselImage {
  url: string;
  alt?: string;
  isCover?: boolean;
}

interface ImagePeekCarouselProps {
  images: (string | CarouselImage)[];
  title?: string;
  className?: string;
  aspectRatio?: "16/10" | "16/9" | "4/3";
  peekOffset?: number; // px peek for next image
  showPeek?: boolean;
  onImageClick?: (index: number) => void;
}

export function ImagePeekCarousel({
  images,
  title = "Property",
  className,
  aspectRatio = "16/10",
  peekOffset = 20,
  showPeek = false,
  onImageClick,
}: ImagePeekCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Normalize image data
  const normalizedImages: CarouselImage[] = images.length
    ? images.map((img, idx) =>
        typeof img === "string"
          ? { url: img, alt: `${title} - Image ${idx + 1}` }
          : { ...img, alt: img.alt || `${title} - Image ${idx + 1}` }
      )
    : [
        {
          url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1000&auto=format&fit=crop",
          alt: `${title} preview`,
        },
      ];

  const total = normalizedImages.length;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  const handleDotClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex(index);
  };

  const aspectClass = {
    "16/10": "aspect-[16/10]",
    "16/9": "aspect-[16/9]",
    "4/3": "aspect-[4/3]",
  }[aspectRatio];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-muted-sand group select-none",
        aspectClass,
        className
      )}
    >
      {/* Sliding Image Container */}
      <div
        ref={scrollRef}
        className="flex w-full h-full transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {normalizedImages.map((img, index) => (
          <div
            key={index}
            onClick={() => onImageClick?.(index)}
            className={cn(
              "relative min-w-full h-full flex-shrink-0 cursor-pointer overflow-hidden",
              showPeek && index < total - 1 ? "pr-4" : ""
            )}
          >
            <Image
              src={img.url}
              alt={img.alt || title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              priority={index === 0}
            />
            {/* Subtle bottom gradient to assist contrast */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-primary/30 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Navigation Chevrons (shown on hover on desktop, always accessible on touch) */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface/85 backdrop-blur-md text-ink-primary border border-hairline flex items-center justify-center shadow-subtle opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-10"
          >
            <ChevronLeft className="w-4 h-4 text-ink-primary" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface/85 backdrop-blur-md text-ink-primary border border-hairline flex items-center justify-center shadow-subtle opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer z-10"
          >
            <ChevronRight className="w-4 h-4 text-ink-primary" />
          </button>
        </>
      )}

      {/* Indicator Pill: Count badge */}
      {total > 1 && (
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="px-2 py-0.5 rounded-full text-[11px] font-sans font-semibold tracking-wide bg-ink-primary/75 backdrop-blur-md text-canvas border border-white/10 shadow-sm tabular-nums">
            {currentIndex + 1} / {total}
          </span>
        </div>
      )}

      {/* Micro Dot Indicators */}
      {total > 1 && total <= 6 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-auto">
          {normalizedImages.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={(e) => handleDotClick(dotIdx, e)}
              aria-label={`Jump to slide ${dotIdx + 1}`}
              className={cn(
                "rounded-full transition-all duration-200",
                dotIdx === currentIndex
                  ? "w-4 h-1.5 bg-surface shadow-sm"
                  : "w-1.5 h-1.5 bg-surface/60 hover:bg-surface/90"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
