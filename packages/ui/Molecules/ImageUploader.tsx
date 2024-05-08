"use client";

import React from "react";
import axios from "axios";
import clsx from "clsx";
import { useState } from "react";
import { CTAButton } from "../Atoms/Button";
import { ErrorMessage, Text } from "../Atoms/Text";

type Upload = {
  file: File;
  progress: number;
  uploading: boolean;
};

export default function ImageUploader({
  bucketKey,
  deviceType,
  onUploadComplete,
}: {
  bucketKey: string;

  deviceType: string;
  onUploadComplete: ({ key }: { key: string }) => void;
}) {
  const [currentUploads, setCurrentUploads] = useState<Upload[]>([]);

  if (currentUploads.length > 0) {
    return (
      <>
        {currentUploads.map((upload, index) => (
          <UploadSelectedImage
            filePreviewUrl={URL.createObjectURL(upload.file)}
            fileName={upload.file.name}
            key={index}
            uploading={upload.uploading}
            progress={upload.progress}
          />
        ))}
        <UploadButton
          currentUploads={currentUploads}
          setCurrentUploads={setCurrentUploads}
          onUploadComplete={onUploadComplete}
          bucketKey={bucketKey}
        />
      </>
    );
  }
  return (
    <SelectImageToUpload
      setCurrentUploads={setCurrentUploads}
      deviceType={deviceType}
    />
  );
}

function SelectImageToUpload({
  setCurrentUploads,
  deviceType,
}: {
  setCurrentUploads: React.Dispatch<React.SetStateAction<Upload[]>>;
  deviceType: string;
}) {
  const selectFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    setUploadsFromFileList(fileList);
  };

  const setUploadsFromFileList = (fileList: FileList | File[] | null) => {
    if (!fileList) {
      throw new Error("No files");
    }
    for (let index = 0; index < fileList.length; index++) {
      const file = fileList[index];
      if (!file) {
        console.error("No File");
        return;
      }
      // check file type
      setCurrentUploads((currentUploads) => [
        ...currentUploads,
        { file, progress: 0, uploading: false },
      ]);
    }
  };

  return (
    <>
      {deviceType === "desktop" ? (
        <SelectImageToUploadForDesktop
          selectFiles={selectFiles}
          setUploadsFromFileList={setUploadsFromFileList}
        />
      ) : (
        <SelectImageToUploadForMobile selectFile={selectFiles} />
      )}
    </>
  );
}

function SelectImageToUploadForDesktop({
  setUploadsFromFileList,
  selectFiles,
}: {
  setUploadsFromFileList: (fileList: FileList | File[] | null) => void;
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
    setUploadsFromFileList(droppedFiles);
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
  uploading,
  progress,
}: {
  uploading: boolean;
  filePreviewUrl: string | undefined;
  fileName: string;
  progress: number;
}) {
  console.log("progress", progress);
  console.log("uploading", uploading);
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <img src={filePreviewUrl} width={120} height={120} />
      <Text>{fileName}</Text>
      {uploading && <ProgressBar progress={progress} />}
    </div>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  return <progress value={progress} max={100} />;
}

function UploadButton({
  currentUploads,
  setCurrentUploads,
  onUploadComplete,
  bucketKey,
}: {
  currentUploads: Upload[];
  setCurrentUploads: React.Dispatch<React.SetStateAction<Upload[]>>;
  onUploadComplete: ({ key }: { key: string }) => void;
  bucketKey: string;
}) {
  const uploadImageToBucket = async (index: number) => {
    const upload = currentUploads[index];
    if (!upload) {
      throw new Error("No file");
    }
    const res = await fetch(
      "/api/presigned-url?file=" + upload.file.name + "&bucketKey=" + bucketKey,
    );

    const { presignedUrl, key } = (await res.json()) as {
      presignedUrl: string;
      key: string;
    };
    console.log(currentUploads[index]!.uploading);
    setCurrentUploads((currentUploads) => {
      const newCurrentUploads = currentUploads.slice();
      newCurrentUploads[index]!.uploading = true;
      return newCurrentUploads;
    });
    console.log(`setting uploading to true for index ${index}`);
    console.log(currentUploads[index]!.uploading);

    axios
      .put(presignedUrl, upload.file, {
        headers: {
          "Content-Type": upload.file.type,
          "Content-Disposition": `attachment; filename="${upload.file.name}"`,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100,
            );
            console.log("checkout progress", progress);

            setCurrentUploads((currentUploads) => {
              const newCurrentUploads = currentUploads.slice();
              newCurrentUploads[index]!.progress = progress;
              return newCurrentUploads;
            });
          }
        },
      })
      .then(async (response) => {
        console.log("response", response);
        // add to db
        onUploadComplete({ key: key });
        // await updateProperty({ coverImageKey: key, propertyId: propertyId });
        setCurrentUploads((currentUploads) => {
          const newCurrentUploads = currentUploads.slice();
          newCurrentUploads[index]!.uploading = true;
          return newCurrentUploads;
        });
      })
      .catch((error) => {
        console.error("error", error);
        setCurrentUploads((currentUploads) => {
          const newCurrentUploads = currentUploads.slice();
          newCurrentUploads[index]!.uploading = true;
          return newCurrentUploads;
        });
      });
  };

  const onClickUpload = () => {
    currentUploads.forEach((upload, index) => {
      uploadImageToBucket(index);
    });
  };

  return (
    <div>
      <CTAButton onClick={onClickUpload} rounded>
        Upload
      </CTAButton>
      <CTAButton rounded secondary onClick={() => setCurrentUploads([])}>
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
