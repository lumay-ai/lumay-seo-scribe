import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface UploadResult {
  url: string;
  path: string;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();

  const uploadImage = async (file: File, folder?: string): Promise<UploadResult> => {
    if (!user) throw new Error("Must be authenticated to upload");

    setUploading(true);
    setProgress(0);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = folder 
        ? `${user.id}/${folder}/${fileName}` 
        : `${user.id}/${fileName}`;

      const { error } = await supabase.storage
        .from("blog-media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("blog-media")
        .getPublicUrl(filePath);

      setProgress(100);

      return {
        url: urlData.publicUrl,
        path: filePath,
      };
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (path: string) => {
    const { error } = await supabase.storage
      .from("blog-media")
      .remove([path]);

    if (error) throw error;
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
    progress,
  };
};
