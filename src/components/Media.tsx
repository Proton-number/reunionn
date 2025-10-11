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

export default function Media() {
  const { uploadFile, uploading } = useAppStore();
  const [year, setYear] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const fileTypes = ["JPG", "PNG", "GIF", "MP4", "MOV", "HEIC"];

  const handleFile = (newFiles: File | File[]) => {
    const selectedFiles = Array.isArray(newFiles) ? newFiles : [newFiles];
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const valueChange = (value: string) => {
    setYear(value);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!year) {
      alert("Please select a year");
      return;
    }
    if (files.length === 0) {
      alert("Please select at least one file");
      return;
    }

    try {
      // Upload each file
      for (const file of files) {
        await uploadFile(file, parseInt(year));
      }

      // Clear form after successful upload
      setFiles([]);
      setYear(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div>
      <div>
        <h3>Select Year</h3>
        <Select onValueChange={valueChange} value={year || undefined}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
          </SelectContent>
        </Select>
        {/* Upload your images and pictures */}
        <div>
          <h3 className="text-sm font-medium mt-2">Upload Media</h3>
          <FileUploader handleChange={handleFile} types={fileTypes}>
            <div className="mt-4 border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-400 transition-colors">
              <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Drag and drop your photos/videos here
              </p>
              <p className="text-xs text-gray-500">
                or click to browse (Max 50MB per file)
              </p>
            </div>
          </FileUploader>
        </div>
        {/* Selected Files Preview */}
        {files.length > 0 && (
          <div>
            <h3 className="text-sm font-medium">
              Selected Files ({files.length})
            </h3>
            <div>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <div>
                    {file.type.startsWith("video/") ? (
                      <video className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    ) : (
                      <img
                        src={URL.createObjectURL(file)}
                        className="h-[100px] w-[100px] text-gray-500 flex-shrink-0"
                      />
                    )}
                    <Button
                      onClick={() => removeFile(index)}
                      className=" hover:text-red-500 transition-colors flex-shrink-0 mt-2"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Button
        disabled={!files || !year || uploading}
        onClick={handleUpload}
        className="cursor-pointer mt-4 w-full"
      >
        {uploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  );
}
