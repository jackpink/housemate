"use client";

import axios from "axios";
import { useState } from "react";

export function CoverImage({ propertyId }: { propertyId: string }) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const selectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      throw new Error("No file");
    }
    setCurrentFile(file);
    setProgress(0);
  };

  const upload = async () => {
    if (!currentFile) {
      throw new Error("No file");
    }
    const res = await fetch(
      "/api/presigned-url?file=" +
        currentFile.name +
        "&propertyId=" +
        propertyId,
    );

    const { presignedUrl } = (await res.json()) as { presignedUrl: string };

    console.log("presignedUrl", presignedUrl);

    setUploading(true);
    const response = axios.post(presignedUrl, currentFile, {
      headers: {
        "Content-Type": currentFile.type,
        "Content-Disposition": `attachment; filename="${currentFile.name}"`,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100,
          );
          console.log("progress", progress);
        }
      },
    });
    // .then(async (response) => {
    //   console.log("response", response);
    //   // add to db
    //   // await updateProperty({ coverImageKey: key, propertyId: propertyId });
    // })
    // .catch((error) => {
    //   console.error("error", error);
    // });

    setUploading(false);
  };

  return (
    <form action={upload}>
      <input
        onChange={selectFile}
        name="file"
        type="file"
        accept="image/png, image/jpeg"
        multiple={false}
      />
      <button type="submit">Upload</button>
    </form>
  );
}
