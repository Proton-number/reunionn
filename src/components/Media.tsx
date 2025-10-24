"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { UploadCloud } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import { useAppStore } from "@/Store/appStore";
import Image from "next/image";

export default function Media() {
  const { uploadFile, uploading } = useAppStore();
  const [year, setYear] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFile = (selected: File | File[]) => {
    const chosenFile = Array.isArray(selected) ? selected[0] : selected;
    setFile(chosenFile);
  };

  const handleUpload = async () => {
    if (!year) return alert("Please select a year");
    if (!file) return alert("Please select a file");

    try {
      await uploadFile(file, parseInt(year));
      setFile(null);
      setYear(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Year Selector */}
      <div>
        <h3 className="font-medium mb-2">Select Year</h3>
        <Select onValueChange={setYear} value={year || undefined}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            {[2024, 2023, 2021, 2020].map((yr) => (
              <SelectItem key={yr} value={String(yr)}>
                {yr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* File Uploader */}
      <div>
        <h3 className="text-sm font-medium mb-2">Upload Media</h3>
        <FileUploader handleChange={handleFile} multiple={false}>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 transition">
            <UploadCloud className="h-8 w-8 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600">
              Drag and drop your image or video here
            </p>
            <p className="text-xs text-gray-500">
              or click to browse (Max 50MB)
            </p>
          </div>
        </FileUploader>
      </div>

      {/* Preview */}
      {file && (
        <div className="mt-3">
          <h3 className="text-sm font-medium mb-2">Preview</h3>
          <div className="flex flex-col gap-2">
            {file.type.startsWith("video/") ? (
              <video
                controls
                className="w-full rounded-md shadow-sm"
                src={URL.createObjectURL(file)}
              />
            ) : (
              <Image
                alt={file.name}
                width={400}
                height={200}
                src={URL.createObjectURL(file)}
                className="w-full h-auto rounded-md object-cover shadow-sm"
              />
            )}
            <Button
              variant="destructive"
              onClick={() => setFile(null)}
              className="w-full"
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <Button
        disabled={!file || !year || uploading}
        onClick={handleUpload}
        className="w-full"
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
