"use client";

import axios from "axios";
import clsx from "clsx";
import { useState } from "react";
import { CTAButton } from "../Atoms/Button";
import { ErrorMessage, Text } from "../Atoms/Text";

export default function ImageUploader({
  bucketKeyFolder,
  deviceType,
  onUploadComplete,
}: {
  bucketKeyFolder: string;
  deviceType: string;
  onUploadComplete: ({ key }: { key: string }) => void;
}) {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | undefined>(
    undefined,
  );

  if (currentFile) {
    return (
      <UploadSelectedImage
        filePreviewUrl={filePreviewUrl}
        fileName={currentFile.name}
        setCurrentFile={setCurrentFile}
        progress={progress}
        bucketKeyFolder={bucketKeyFolder}
        setUploading={setUploading}
        currentFile={currentFile}
        uploading={uploading}
        setProgress={setProgress}
        onUploadComplete={onUploadComplete}
      />
    );
  }
  return (
    <SelectImageToUpload
      setCurrentFile={setCurrentFile}
      setFilePreviewUrl={setFilePreviewUrl}
      setProgress={setProgress}
      deviceType={deviceType}
    />
  );
}

function SelectImageToUpload({
  setCurrentFile,
  setFilePreviewUrl,
  setProgress,
  deviceType,
}: {
  setCurrentFile: React.Dispatch<React.SetStateAction<File | null>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setFilePreviewUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  deviceType: string;
}) {
  const selectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      throw new Error("No file");
    }
    setCurrentFile(file);
    setFilePreviewUrl(URL.createObjectURL(file));
    setProgress(0);
  };

  return (
    <>
      {deviceType === "desktop" ? (
        <SelectImageToUploadForDesktop
          setCurrentFile={setCurrentFile}
          setProgress={setProgress}
          setFilePreviewUrl={setFilePreviewUrl}
          selectFile={selectFile}
        />
      ) : (
        <SelectImageToUploadForMobile selectFile={selectFile} />
      )}
    </>
  );
}

function SelectImageToUploadForDesktop({
  setCurrentFile,
  setProgress,
  setFilePreviewUrl,
  selectFile,
}: {
  setCurrentFile: React.Dispatch<React.SetStateAction<File | null>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  setFilePreviewUrl: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [dragError, setDragError] = useState({
    error: false,
    errorMessage: "",
  });

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("drag event", e.type);

    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    console.log("dragleave");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("DROPPPED");
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length != 1) {
      console.error("Multiple files not allowed");
      setDragError({
        error: true,
        errorMessage: "Only one file allowed",
      });
      return;
    }

    // add file as current andf set image url'
    const file = droppedFiles[0];
    if (!file) {
      throw new Error("No file");
    }
    if (!file.type.includes("image/")) {
      setDragError({ error: true, errorMessage: "Must be an image" });
      console.error("Must be an image");
      return;
    }
    setCurrentFile(file);
    setProgress(0);
    setFilePreviewUrl(URL.createObjectURL(file));
  };
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex h-full w-full flex-col justify-stretch"
    >
      <div
        className={clsx(
          "flex h-48 w-full flex-col justify-center border-2 border-dashed border-dark",
          dragActive ? "border-brand" : "border-gray-400",
          dragError.error && "border-red-500",
        )}
        onDragLeave={handleDragLeave}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Text>Drag here</Text>
      </div>
      <ErrorMessage
        error={dragError.error}
        errorMessage={dragError.errorMessage}
      />
      <Text>or</Text>
      <label
        htmlFor="upload-cover-image-desktop"
        className="mb-4 place-self-center"
      >
        <div className="rounded-full border-0 bg-brand p-6 text-xl font-extrabold text-dark hover:bg-brand/70">
          Browse Files
        </div>
        <input
          onChange={selectFile}
          name="file"
          type="file"
          accept="capture=camera,image/*"
          multiple={false}
          id="upload-cover-image-desktop"
          hidden
        />
      </label>
    </form>
  );
}

function SelectImageToUploadForMobile({
  selectFile,
}: {
  selectFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex h-full flex-col justify-stretch"
    >
      <label
        htmlFor="upload-cover-image-mobile"
        className="mb-4 flex h-full flex-col items-center justify-center"
      >
        <div className="cursor-pointer rounded-full border-0 bg-brand p-6 text-xl font-extrabold text-dark hover:bg-brand/70">
          Choose Image To Upload
        </div>
        <input
          onChange={selectFile}
          name="file"
          type="file"
          accept="capture=camera,image/*"
          multiple={false}
          id="upload-cover-image-mobile"
          hidden
        />
      </label>
    </form>
  );
}

function UploadSelectedImage({
  filePreviewUrl,
  fileName,
  setCurrentFile,
  currentFile,
  bucketKeyFolder,
  setUploading,
  progress,
  uploading,
  setProgress,
  onUploadComplete,
}: {
  currentFile: File | null;
  progress: number;
  uploading: boolean;
  bucketKeyFolder: string;
  filePreviewUrl: string | undefined;
  fileName: string;
  setCurrentFile: React.Dispatch<React.SetStateAction<File | null>>;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
  onUploadComplete: ({ key }: { key: string }) => void;
}) {
  const uploadImageToBucket = async () => {
    if (!currentFile) {
      throw new Error("No file");
    }
    const res = await fetch(
      "/api/presigned-url?file=" +
        currentFile.name +
        "&propertyId=" +
        bucketKeyFolder,
    );

    const { presignedUrl, key } = (await res.json()) as {
      presignedUrl: string;
      key: string;
    };

    setUploading(true);
    axios
      .put(presignedUrl, currentFile, {
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
            setProgress(progress);
          }
        },
      })
      .then(async (response) => {
        console.log("response", response);
        // add to db
        onUploadComplete({ key: key });
        // await updateProperty({ coverImageKey: key, propertyId: propertyId });
        setUploading(false);
      })
      .catch((error) => {
        console.error("error", error);
        setUploading(false);
      });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <img src={filePreviewUrl} width={120} height={120} />
      <Text>{fileName}</Text>
      <UploadButton
        setCurrentFile={setCurrentFile}
        uploading={uploading}
        progress={progress}
        uploadImageToBucket={uploadImageToBucket}
      />
    </div>
  );
}

function UploadButton({
  setCurrentFile,
  progress,
  uploading,
  uploadImageToBucket,
}: {
  setCurrentFile: React.Dispatch<React.SetStateAction<File | null>>;
  uploading: boolean;
  progress: number;
  uploadImageToBucket: () => void;
}) {
  if (uploading) {
    return <UploadingBar progress={progress} />;
  }
  return (
    <div>
      <CTAButton onClick={uploadImageToBucket} rounded>
        Upload
      </CTAButton>
      <CTAButton rounded secondary onClick={() => setCurrentFile(null)}>
        Cancel
      </CTAButton>
    </div>
  );
}

function UploadingBar({ progress }: { progress: number }) {
  console.log("progress uploading bar", progress);
  return (
    <CTAButton
      rounded
      disabled={false}
      loading={true}
      className={clsx(
        progress < 10 && "bg-gradient-to-r from-brand from-10% to-white",
        progress >= 10 &&
          progress < 20 &&
          "bg-gradient-to-r from-brand from-20% to-white",
        progress >= 20 &&
          progress < 30 &&
          "bg-gradient-to-r from-brand from-30% to-white",
        progress >= 30 &&
          progress < 40 &&
          "bg-gradient-to-r from-brand from-40% to-white",
        progress >= 40 &&
          progress < 50 &&
          "bg-gradient-to-r from-brand from-50% to-white",
        progress >= 50 &&
          progress < 60 &&
          "bg-gradient-to-r from-brand from-60% to-white",
        progress >= 60 &&
          progress < 70 &&
          "bg-gradient-to-r from-brand from-70% to-white",
        progress >= 70 &&
          progress < 80 &&
          "bg-gradient-to-r from-brand from-80% to-white",
        progress >= 80 &&
          progress < 90 &&
          "bg-gradient-to-r from-brand from-90% to-white",
      )}
    >
      Uploading
    </CTAButton>
  );
}
