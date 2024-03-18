"use client";

import { useState } from "react";
import { updateProperty } from "~/app/actions/property";
import { uploadFile } from "~/app/actions/uploads";

export function CoverImage({
  url,
  key,
  propertyId,
}: {
  url: string;
  key: string;
  propertyId: string;
}) {
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

  const upload = () => {
    if (!currentFile) {
      throw new Error("No file");
    }

    setUploading(true);
    uploadFile({ file: currentFile, url: url })
      .then(async (response) => {
        console.log("response", response);
        // add to db
        await updateProperty({ coverImageKey: key, propertyId: propertyId });
      })
      .catch((error) => {
        console.error("error", error);
      });

    setUploading(false);
  };

  return (
    <form onSubmit={upload}>
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
