"use client";

import React, { useEffect } from "react";
import { ChevronRight, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
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

  const years = Array.from({ length: 5 }, (_, i) => 2024 - i).filter(
    (year) => year !== 2022
  );

  useEffect(() => {
    // Fetch media for all years on component mount
    years.forEach((year) => {
      fetchMediaByYear(year);
    });
  }, []);

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="font-bold text-5xl pt-5">Gallery</h1>
          <p className="text-lg max-w-xl pt-4">
            A collection of memorable moments from our annual reunions.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="cursor-pointer">
              <Upload />
              Upload New Photos
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Share Your Memories</DialogTitle>
            </DialogHeader>
            <Media />
          </DialogContent>
        </Dialog>
      </div>

      {years.map((year) => (
        <div key={year} className="pt-15">
          {/* for years  */}
          <div className="flex items-start sm:items-center justify-between pb-6 gap-3">
            <h1 className="font-bold text-3xl sm:text-5xl">{year}</h1>
            <Link href={`/Gallery/${year}`} className="ml-auto">
              <div className="flex items-center gap-1 sm:gap-2 cursor-pointer text-base sm:text-lg">
                <p className="underline underline-offset-2">See more</p>
                <ChevronRight size={20} />
              </div>
            </Link>
          </div>

          {/* Cards for images and videos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              // Show skeleton while loading
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden rounded-lg shadow">
                  <div className="relative w-full aspect-square">
                    <Skeleton className="absolute inset-0 h-full w-full" />
                  </div>
                </Card>
              ))
            ) : media[year] && media[year].length > 0 ? (
              // Show actual media if available (limit to 4)
              media[year].slice(0, 4).map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden rounded-lg shadow"
                >
                  <div className="relative w-full aspect-square">
                    {item.type === "video" || item.type?.includes("video") ? (
                      <video
                        src={item.file_url}
                        className="absolute inset-0 h-full w-full object-cover"
                        controls
                        muted
                        playsInline
                      />
                    ) : (
                      <CldImage
                        src={item.file_url}
                        alt={`${year} memory`}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                </Card>
              ))
            ) : (
              // Show message if no media for this year
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No photos yet for {year}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Gallery;
