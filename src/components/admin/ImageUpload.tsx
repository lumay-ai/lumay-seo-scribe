import { useCallback, useRef, useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Crop } from "lucide-react";
import ReactCrop, { Crop as CropType, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useImageUpload } from "@/hooks/useImageUpload";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  className?: string;
  aspectRatio?: "video" | "square" | "wide";
  enableCrop?: boolean;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ImageUpload = ({
  value,
  onChange,
  onRemove,
  folder = "posts",
  className,
  aspectRatio = "video",
  enableCrop = true,
}: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const { uploadImage, uploading } = useImageUpload();

  const aspectValues = {
    video: 16 / 9,
    square: 1,
    wide: 21 / 9,
  };

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    wide: "aspect-[21/9]",
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspectValues[aspectRatio]));
  };

  const getCroppedImg = async (
    image: HTMLImageElement,
    pixelCrop: PixelCrop
  ): Promise<Blob> => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = pixelCrop.width * scaleX;
    canvas.height = pixelCrop.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2d context");

    ctx.drawImage(
      image,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas is empty"));
        },
        "image/jpeg",
        0.9
      );
    });
  };

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB.",
          variant: "destructive",
        });
        return;
      }

      if (enableCrop) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setCropDialogOpen(true);
      } else {
        await uploadDirectly(file);
      }
    },
    [enableCrop]
  );

  const uploadDirectly = async (file: File | Blob) => {
    try {
      const result = await uploadImage(file as File, folder);
      onChange(result.url);
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image.",
        variant: "destructive",
      });
    }
  };

  const handleCropConfirm = async () => {
    if (!imgRef.current || !completedCrop) return;

    try {
      const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
      const croppedFile = new File([croppedBlob], "cropped-image.jpg", {
        type: "image/jpeg",
      });
      
      setCropDialogOpen(false);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      
      await uploadDirectly(croppedFile);
    } catch (error: any) {
      toast({
        title: "Crop failed",
        description: error.message || "Failed to crop image.",
        variant: "destructive",
      });
    }
  };

  const handleCropCancel = () => {
    setCropDialogOpen(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  if (value) {
    return (
      <div className={cn("relative rounded-lg overflow-hidden border border-border", aspectClasses[aspectRatio], className)}>
        <img
          src={value}
          alt="Uploaded"
          className="w-full h-full object-cover"
        />
        {onRemove && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "relative rounded-lg border-2 border-dashed transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border",
          aspectClasses[aspectRatio],
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <div className="p-3 rounded-full bg-primary/10">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm font-medium">
                Drop an image here or{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => inputRef.current?.click()}
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, GIF up to 5MB {enableCrop && "• Crop before upload"}
              </p>
            </>
          )}
        </div>
      </div>

      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crop className="h-5 w-5" />
              Crop Image
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center justify-center max-h-[60vh] overflow-auto">
            {previewUrl && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspectValues[aspectRatio]}
              >
                <img
                  ref={imgRef}
                  src={previewUrl}
                  alt="Crop preview"
                  onLoad={onImageLoad}
                  className="max-w-full max-h-[55vh]"
                />
              </ReactCrop>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCropCancel}>
              Cancel
            </Button>
            <Button onClick={handleCropConfirm} disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Crop & Upload"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageUpload;
