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
import { UploadCloud, X, Calendar } from "lucide-react";
import { FileUploader } from "react-drag-drop-files";
import { useAppStore } from "@/Store/appStore";
import Image from "next/image";
import { toast } from "sonner";

type MediaProps = {
  onUploadSuccess?: () => void; // Callback after successful upload
};

export default function Media({ onUploadSuccess }: MediaProps) {
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
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      toast.success("File uploaded successfully!");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Upload Media
        </h2>
        <p className="text-sm text-gray-500">Share your photos and videos</p>
      </div>

      {/* Year Selector */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Calendar className="h-4 w-4" />
          Select Year
        </label>
        <Select onValueChange={setYear} value={year || undefined}>
          <SelectTrigger className="w-full h-11 sm:h-10">
            <SelectValue placeholder="Choose a year" />
          </SelectTrigger>
          <SelectContent>
            {[2025, 2024, 2023, 2021, 2020].map((yr) => (
              <SelectItem key={yr} value={String(yr)}>
                {yr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* File Uploader */}
      {!file && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Choose File
          </label>
          <FileUploader handleChange={handleFile} multiple={false}>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 active:scale-[0.99]">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <UploadCloud className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <p className="text-sm sm:text-base font-medium text-gray-700 mb-1">
                Drag and drop your file here
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                or tap to browse
              </p>
              <p className="text-xs text-gray-400 mt-3">
                Images and videos up to 50MB
              </p>
            </div>
          </FileUploader>
        </div>
      )}

      {/* Preview */}
      {file && (
        <div className="space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">Preview</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFile(null)}
              className="h-8 px-2 text-gray-500 hover:text-red-600 text-sm"
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>

          <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            {file.type.startsWith("video/") ? (
              <video
                controls
                className="w-full max-h-[70vh] object-contain bg-black"
                src={URL.createObjectURL(file)}
              />
            ) : (
              <div className="relative w-full">
                <Image
                  alt={file.name}
                  width={800}
                  height={200}
                  src={URL.createObjectURL(file)}
                  className="w-full h-[20vh] object-contain"
                  priority
                />
              </div>
            )}
          </div>

          {/* File Info */}
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
            <span className="font-medium truncate max-w-[200px] sm:max-w-[300px]">
              {file.name}
            </span>
            <span className="text-gray-400">•</span>
            <span>{formatFileSize(file.size)}</span>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <Button
        disabled={!file || !year || uploading}
        onClick={handleUpload}
        className={`w-full h-11 sm:h-10 text-base font-medium ${
          !file || !year || uploading ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        size="lg"
      >
        {uploading ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Uploading...
          </span>
        ) : (
          "Upload Media"
        )}
      </Button>
    </div>
  );
}
