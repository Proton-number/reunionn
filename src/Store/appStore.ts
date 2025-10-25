import { supabase } from "@/lib/supabase";
import { create } from "zustand";

interface Media {
  id: string;
  year: number;
  file_url: string;
  type: string;
  created_at: string;
}

interface APPSTORE {
  media: Record<number, Media[]>;
  uploadFile: (file: File, year: number) => Promise<void>;
  loading: boolean;
  uploading: boolean;
  fetchMediaByYear: (year: number) => Promise<void>;
}
export const useAppStore = create<APPSTORE>((set) => ({
  media: {},
  loading: false,
  uploading: false,

  fetchMediaByYear: async (year) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .eq("year", year)
        .order("created_at", { ascending: false });

      if (error) throw error;

      set((state) => ({
        media: { ...state.media, [year]: data || [] }, // scoped to selected year
      }));
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      set({ loading: false });
    }
  },

  uploadFile: async (file, year) => {
    set({ uploading: true });
    try {
      // ✅ Upload file to Cloudinary
      const formData = new FormData();
      formData.append("file", file); // Append the file to be uploaded
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await res.json();
      if (!cloudinaryData.secure_url)
        throw new Error("Cloudinary upload failed");

      const file_url = cloudinaryData.secure_url;

      // ✅ Save Cloudinary URL to Supabase
      const { data, error: insertError } = await supabase
        .from("media")
        .insert([
          {
            year,
            file_url,
            type: file.type.startsWith("video") ? "video" : "image",
          },
        ])
        .select();

      if (insertError) throw insertError;

      // ✅ Update state for that year
      set((state) => ({
        media: {
          ...state.media,
          [year]: [data![0], ...(state.media[year] || [])],
        },
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      set({ uploading: false });
    }
  },
}));
