"use client";

import React from "react";
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
  const [currentFiles, setCurrentFiles] = useState<File[] | null>(null);
  const [uploading, setUploading] = useState(false);

  const [filePreviewUrl, setFilePreviewUrl] = useState<string[] | undefined>(
    undefined,
  );

  if (currentFiles) {
    return (
      <>
        {currentFiles.map((file, index) => (
          <UploadSelectedImage
            filePreviewUrl={filePreviewUrl?.[index] ?? ""}
            fileName={file.name}
            setCurrentFiles={setCurrentFiles}
            bucketKeyFolder={bucketKeyFolder}
            setUploading={setUploading}
            currentFile={file}
            uploading={uploading}
            onUploadComplete={onUploadComplete}
          />
        ))}
        <UploadButton
          setCurrentFiles={setCurrentFiles}
          uploading={uploading}
          setUploading={setUploading}
        />
      </>
    );
  }
  return (
    <SelectImageToUpload
      setCurrentFiles={setCurrentFiles}
      setFilePreviewUrl={setFilePreviewUrl}
      deviceType={deviceType}
    />
  );
}

function SelectImageToUpload({
  setCurrentFiles,
  setFilePreviewUrl,
  // setProgress,
  deviceType,
}: {
  setCurrentFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  // setProgress: React.Dispatch<React.SetStateAction<number>>;
  setFilePreviewUrl: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  deviceType: string;
}) {
  const selectFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) {
      throw new Error("No files");
    }
    const files = Array.from(fileList);
    setCurrentFiles(files);
    setFilePreviewUrl(files.map((file) => URL.createObjectURL(file)));
    // setProgress(0);
  };

  return (
    <>
      {deviceType === "desktop" ? (
        <SelectImageToUploadForDesktop
          setCurrentFiles={setCurrentFiles}
          // setProgress={setProgress}
          setFilePreviewUrl={setFilePreviewUrl}
          selectFiles={selectFiles}
        />
      ) : (
        <SelectImageToUploadForMobile selectFile={selectFiles} />
      )}
    </>
  );
}

function SelectImageToUploadForDesktop({
  setCurrentFiles,
  // setProgress,
  setFilePreviewUrl,
  selectFiles,
}: {
  setCurrentFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  // setProgress: React.Dispatch<React.SetStateAction<number>>;
  setFilePreviewUrl: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  selectFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
    // if (droppedFiles.length != 1) {
    //   console.error("Multiple files not allowed");
    //   setDragError({
    //     error: true,
    //     errorMessage: "Only one file allowed",
    //   });
    //   return;
    // }

    // add file as current andf set image url'
    // const file = droppedFiles
    // if (!file) {
    //   throw new Error("No file");
    // }
    for (let index = 0; index < droppedFiles.length; index++) {
      const file = droppedFiles[index];
      if (!!file && !file.type.includes("image/")) {
        setDragError({ error: true, errorMessage: "Must be an image" });
        console.error("Must be an image");
        return;
      }
    }

    setCurrentFiles(droppedFiles);
    // setProgress(0);
    setFilePreviewUrl(droppedFiles.map((file) => URL.createObjectURL(file)));
  };
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex h-full w-full flex-col justify-stretch"
    >
      <div
        className={clsx(
          "border-dark flex h-48 w-full flex-col justify-center border-2 border-dashed",
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
        <div className="bg-brand text-dark hover:bg-brand/70 rounded-full border-0 p-6 text-xl font-extrabold">
          Browse Files
        </div>
        <input
          onChange={selectFiles}
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
        <div className="bg-brand text-dark hover:bg-brand/70 cursor-pointer rounded-full border-0 p-6 text-xl font-extrabold">
          Choose Image To Upload
        </div>
        <input
          onChange={selectFile}
          name="file"
          type="file"
          accept="capture=camera,image/*"
          multiple={true}
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
  setCurrentFiles,
  currentFile,
  bucketKeyFolder,
  setUploading,

  uploading,

  onUploadComplete,
}: {
  currentFile: File;
  uploading: boolean;
  bucketKeyFolder: string;
  filePreviewUrl: string | undefined;
  fileName: string;
  setCurrentFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  onUploadComplete: ({ key }: { key: string }) => void;
}) {
  const [progress, setProgress] = useState(0);

  const uploadImageToBucket = async (file: File | undefined) => {
    if (!file) {
      throw new Error("No file");
    }
    const res = await fetch(
      "/api/presigned-url?file=" + file.name + "&propertyId=" + bucketKeyFolder,
    );

    const { presignedUrl, key } = (await res.json()) as {
      presignedUrl: string;
      key: string;
    };

    setUploading(true);
    axios
      .put(presignedUrl, currentFile, {
        headers: {
          "Content-Type": file.type,
          "Content-Disposition": `attachment; filename="${file.name}"`,
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

  if (uploading) {
    uploadImageToBucket(currentFile);
    return <UploadingBar progress={progress} />;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <img src={filePreviewUrl} width={120} height={120} />
      <Text>{fileName}</Text>
    </div>
  );
}

function UploadButton({
  setCurrentFiles,
  uploading,
  setUploading,
}: {
  setCurrentFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  uploading: boolean;

  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  if (uploading) {
    return null;
  }
  return (
    <div>
      <CTAButton onClick={() => setUploading(true)} rounded>
        Upload
      </CTAButton>
      <CTAButton rounded secondary onClick={() => setCurrentFiles(null)}>
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
        progress < 10 && "from-brand bg-gradient-to-r from-10% to-white",
        progress >= 10 &&
          progress < 20 &&
          "from-brand bg-gradient-to-r from-20% to-white",
        progress >= 20 &&
          progress < 30 &&
          "from-brand bg-gradient-to-r from-30% to-white",
        progress >= 30 &&
          progress < 40 &&
          "from-brand bg-gradient-to-r from-40% to-white",
        progress >= 40 &&
          progress < 50 &&
          "from-brand bg-gradient-to-r from-50% to-white",
        progress >= 50 &&
          progress < 60 &&
          "from-brand bg-gradient-to-r from-60% to-white",
        progress >= 60 &&
          progress < 70 &&
          "from-brand bg-gradient-to-r from-70% to-white",
        progress >= 70 &&
          progress < 80 &&
          "from-brand bg-gradient-to-r from-80% to-white",
        progress >= 80 &&
          progress < 90 &&
          "from-brand bg-gradient-to-r from-90% to-white",
      )}
    >
      Uploading
    </CTAButton>
  );
}
