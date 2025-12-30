"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAppStore } from "@/Store/appStore";
import { CldImage } from "next-cloudinary";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function GalleryDetails() {
  const { galleryId } = useParams();
  const year = Number(galleryId);

  const { media, fetchMediaByYear } = useAppStore();
  const galleryMedia = media[year] || [];

  const [isReady, setIsReady] = useState(false); // wait before loading
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // wait 3s before loading content / fetching media
  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (year && isReady) {
      fetchMediaByYear(year);
    }
  }, [year, fetchMediaByYear, isReady]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "unset";
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryMedia.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + galleryMedia.length) % galleryMedia.length
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, galleryMedia.length, goToNext, goToPrev]);

  // Handle touch swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrev();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Loading placeholder while waiting 3s
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-10 w-10 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <h1 className="font-bold text-3xl sm:text-4xl text-gray-900 mb-6 sm:mb-10">
          All Photos - {year}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
          {galleryMedia.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative w-full aspect-square overflow-hidden rounded-lg bg-white shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {item.type === "video" || item.type?.includes("video") ? (
                <video
                  src={item.file_url}
                  className="w-full h-full object-cover pointer-events-none"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <>
                  <CldImage
                    src={item.file_url}
                    alt={`${year} memory ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    quality="auto"
                  />
                  {/* Hover Overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {galleryMedia.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No photos available for {year}
            </p>
          </div>
        )}

        {/* Lightbox Gallery Viewer */}
        {lightboxOpen && galleryMedia.length > 0 && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            {/* Close Button */}
            <Button
              size="icon"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Counter */}
            <div className="absolute top-4 left-4 z-50 text-white text-sm bg-black/50 px-3 py-1.5 rounded-full">
              {currentIndex + 1} / {galleryMedia.length}
            </div>

            {/* Previous Button */}
            {galleryMedia.length > 1 && (
              <Button
                size="icon"
                className="rounded-full absolute left-4 top-1/2 -translate-y-1/2 z-50 hover:bg-white/20 text-white transition-colors cursor-pointer"
                onClick={goToPrev}
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {/* Next Button */}
            {galleryMedia.length > 1 && (
              <Button
                size="icon"
                className="rounded-full absolute right-4 top-1/2 -translate-y-1/2 z-50 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            {/* Main Content Area */}
            <div
              className="w-full h-full flex items-center justify-center p-4"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
                {galleryMedia[currentIndex].type === "video" ||
                galleryMedia[currentIndex].type?.includes("video") ? (
                  <video
                    src={galleryMedia[currentIndex].file_url}
                    className="max-w-full max-h-full object-contain"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <CldImage
                      src={galleryMedia[currentIndex].file_url}
                      alt={`${year} memory ${currentIndex + 1}`}
                      width={1920}
                      height={1080}
                      className="max-w-full max-h-full object-contain"
                      quality="auto"
                      priority
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Swipe Indicators */}
            {galleryMedia.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
                {galleryMedia.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentIndex
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryDetails;
