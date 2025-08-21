"use client";

import Image from "next/image";
import { XIcon } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import toast from "react-hot-toast";

type ImageUploadDropZoneProps = {
  onChange: (url: string) => void;
  value: string;
  endpoint: "imageUploader";
};

function ImageUploadDropZone({ endpoint, onChange, value }: ImageUploadDropZoneProps) {
  if (value) {
    return (
      <div className="relative aspect-square w-full bg-foreground/5">
        <Image
          src={value}
          alt="A preview of the image you have selected to upload"
          fill
          className="rounded-md object-contain"
        />

        <button
          onClick={() => onChange("")}
          className="absolute top-[-0.5rem] right-[-0.5rem] p-1 bg-red-500 rounded-full shadow-sm"
          type="button"
        >
          <XIcon className="size-3 text-white" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].ufsUrl);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
        toast.error(error.message);
      }}
    />
  );
}

export default ImageUploadDropZone;
