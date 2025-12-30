"use client";

import React, { useEffect, useState } from "react";
import { ChevronRight, Upload, X, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Media from "@/components/Media";
import { useAppStore } from "@/Store/appStore";
import { CldImage } from "next-cloudinary";

function Gallery() {
  const { media, fetchMediaByYear, loading } = useAppStore();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const years = Array.from({ length: 5 }, (_, i) => 2024 - i).filter(
    (year) => year !== 2022
  );

  useEffect(() => {
    // Fetch media for all years on component mount
    years.forEach((year) => {
      fetchMediaByYear(year);
    });
  }, [years, fetchMediaByYear]);

  const openLightbox = (year: number, index: number) => {
    setCurrentYear(year);
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "unset";
  };

  const currentMedia =
    currentYear && media[currentYear] ? media[currentYear] : [];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % currentMedia.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + currentMedia.length) % currentMedia.length
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
  }, [lightboxOpen, currentMedia.length, goToNext, goToPrev]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-12">
          <div>
            <h1 className="font-bold text-4xl sm:text-5xl text-gray-900">
              Gallery
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mt-2">
              A collection of memorable moments from our annual reunions.
            </p>
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="w-full sm:w-auto cursor-pointer"
                aria-label="Upload new photos to gallery"
              >
                <Upload className="mr-2 h-5 w-5" aria-hidden="true" />
                Upload New Photos
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Share Your Memories</DialogTitle>
              </DialogHeader>
              <Media onUploadSuccess={() => setUploadDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Year Sections */}
        <main>
          {years.map((year, yearIndex) => (
            <section
              key={year}
              className={yearIndex > 0 ? "mt-12 sm:mt-16" : ""}
            >
              {/* Year Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="font-bold text-3xl sm:text-4xl text-gray-900">
                  {year}
                </h2>
                <Link href={`/Gallery/${year}`}>
                  <div className="flex items-center gap-1 group cursor-pointer">
                    <span className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-gray-900 underline underline-offset-2">
                      See more
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-700 group-hover:text-gray-900 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-2">
                {loading ? (
                  // Loading Skeletons
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="relative w-full aspect-square overflow-hidden rounded-md bg-gray-200"
                    >
                      <Skeleton className="w-full h-full" />
                    </div>
                  ))
                ) : media[year] && media[year].length > 0 ? (
                  // Actual Media Items
                  media[year].slice(0, 4).map((item, index) => (
                    <article
                      key={item.id}
                      onClick={() => openLightbox(year, index)}
                      className="group relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    >
                      <div className="relative w-full aspect-square overflow-hidden">
                        {item.type === "video" ||
                        item.type?.includes("video") ? (
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
                              alt={`${year} memory`}
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
                    </article>
                  ))
                ) : (
                  // Empty State
                  <div className="col-span-full">
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
                      <div className="bg-gray-100 rounded-full p-4 mb-4">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-base sm:text-lg font-medium">
                        No photos yet for {year}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Be the first to share memories from this year
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          ))}
        </main>

        {/* Lightbox Gallery Viewer */}
        {lightboxOpen && currentMedia.length > 0 && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
            {/* Close Button */}
            <Button
              size="icon"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 p-2 rounded-full  hover:bg-white/20 text-white transition-colors"
              aria-label="Close photo viewer"
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Counter */}
            <div className="absolute top-4 left-4 z-50 text-white text-sm bg-black/50 px-3 py-1.5 rounded-full">
              {currentIndex + 1} / {currentMedia.length}
            </div>

            {/* Previous Button */}
            {currentMedia.length > 1 && (
              <Button
                size="icon"
                className="rounded-full absolute left-4 top-1/2 -translate-y-1/2 z-50 hover:bg-white/20 text-white transition-colors cursor-pointer"
                onClick={goToPrev}
                aria-label="View Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {/* Next Button */}
            {currentMedia.length > 1 && (
              <Button
                size="icon"
                className="rounded-full absolute right-4 top-1/2 -translate-y-1/2 z-50 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="view next photo"
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
                {currentMedia[currentIndex].type === "video" ||
                currentMedia[currentIndex].type?.includes("video") ? (
                  <video
                    src={currentMedia[currentIndex].file_url}
                    className="max-w-full max-h-full object-contain"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <CldImage
                      src={currentMedia[currentIndex].file_url}
                      alt={`${currentYear} memory ${currentIndex + 1}`}
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
            {currentMedia.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden">
                {currentMedia.map((_, idx) => (
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

export default Gallery;
