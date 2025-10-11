"use client";
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAppStore } from "@/Store/appStore";

function GalleryDetails() {
  const { galleryId } = useParams();
  const year = Number(galleryId); // Assuming galleryId is the year

  const { media, fetchAllMedia } = useAppStore();
  const galleryMedia = media[year] || []; // scoped to selected year

  useEffect(() => {
    if (year) {
      fetchAllMedia(year);
    }
  }, [year, fetchAllMedia]);

  return (
    <div className="p-10 max-w-10xl mx-auto">
      <h1 className="font-bold text-4xl pb-10">All Photos - {year}</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {galleryMedia.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden rounded-lg shadow p-0 w-full aspect-square flex items-center justify-center "
          >
            {item.type === "image" ? (
              <Image
                src={item.file_url}
                alt={`${item.year} photo`}
                width={800}
                height={800}
                className="object-cover w-full h-full aspect-square transition-transform duration-200 hover:scale-105"
              />
            ) : (
              <video
                src={item.file_url}
                controls
                className=" object-cover w-full h-full aspect-square"
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default GalleryDetails;
