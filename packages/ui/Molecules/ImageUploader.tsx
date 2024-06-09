"use client";

import React, { useId, useCallback } from "react";
import axios from "axios";
import clsx from "clsx";
import { useState } from "react";
import { CTAButton } from "../Atoms/Button";
import { ErrorMessage, Text } from "../Atoms/Text";
import {
  CancelIcon,
  ConfirmIcon,
  PdfFileIcon,
  RetryIcon,
  UploadIcon,
  WarningIcon,
} from "../Atoms/Icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeading,
  DialogTrigger,
} from "../Atoms/Dialog";

type UploadStatus =
  | "fileSizeError"
  | "fileTypeError"
  | "preview"
  | "uploading"
  | "success"
  | "error";

type Upload = {
  file: File;
  progress: number;
  status: UploadStatus;
};

export default function ImageUploader({
  bucketKey,
  deviceType,
  onUploadComplete,
  bucketName,
}: {
  bucketKey: string;
  bucketName: string;
  deviceType: "mobile" | "desktop";
  onUploadComplete: ({
    key,
    name,
    type,
  }: {
    key: string;
    name: string;
    type: string;
  }) => void;
}) {
  const [currentUploads, setCurrentUploads] = useState<Upload[]>([]);

  const checkIfAllUploadsAreComplete = useCallback(() => {
    for (const upload of currentUploads) {
      console.log("upload", upload);
      if (upload.status !== "success") return false;
    }
    return true;
  }, [currentUploads]);

  const uploadImageToBucket = async (index: number) => {
    const upload = currentUploads[index];
    if (!upload) {
      throw new Error("No file");
    }

    const res = await fetch(
      `/api/presigned-url?file=${upload.file.name}&bucketKey=${bucketKey}&bucketName=${bucketName}`,
    );

    const { presignedUrl, key } = (await res.json()) as {
      presignedUrl: string;
      key: string;
    };

    setCurrentUploads((currentUploads) => {
      const newCurrentUploads = currentUploads.slice();
      newCurrentUploads[index]!.status = "uploading";
      return newCurrentUploads;
    });

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

            setCurrentUploads((currentUploads) => {
              const newCurrentUploads = currentUploads.slice();
              newCurrentUploads[index]!.progress = progress;
              return newCurrentUploads;
            });
          }
        },
      })
      .then(async (response) => {
        // add to db
        onUploadComplete({
          key: key,
          name: upload.file.name,
          type: upload.file.type,
        });
        // await updateProperty({ coverImageKey: key, propertyId: propertyId });
        setCurrentUploads((currentUploads) => {
          const newCurrentUploads = currentUploads.slice();
          newCurrentUploads[index]!.status = "success";
          return newCurrentUploads;
        });
      })
      .catch((error) => {
        console.error("error", error);
        setCurrentUploads((currentUploads) => {
          const newCurrentUploads = currentUploads.slice();
          newCurrentUploads[index]!.status = "error";
          return newCurrentUploads;
        });
      })
      .finally(() => {
        const uploadsComplete = checkIfAllUploadsAreComplete();
        console.log("uploadsComplete", uploadsComplete);
        if (checkIfAllUploadsAreComplete()) {
          console.log("all uploads are complete");
          setCurrentUploads([]);
        }
      });
  };
  console.log("deviceType", deviceType);
  if (deviceType === "mobile") {
    console.log("mobile imatge updloader");
    return (
      <MobileFileUploadDialog
        currentUploads={currentUploads}
        setCurrentUploads={setCurrentUploads}
        uploadImageToBucket={uploadImageToBucket}
        deviceType={deviceType}
      />
    );
  }
  if (currentUploads.length > 0) {
    return (
      <>
        <UploadButton
          currentUploads={currentUploads}
          setCurrentUploads={setCurrentUploads}
          uploadImageToBucket={uploadImageToBucket}
        />
        <div className="flex w-full flex-wrap justify-center gap-8 py-4">
          {currentUploads.map((upload, index) => (
            <UploadSelectedImage
              filePreviewUrl={URL.createObjectURL(upload.file)}
              fileName={upload.file.name}
              key={index}
              status={upload.status}
              progress={upload.progress}
              uploadImageToBucket={uploadImageToBucket}
              index={index}
              deviceType={deviceType}
            />
          ))}
        </div>
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
      let status: UploadStatus = "preview";
      // check file type
      if (!file.type.startsWith("image") && !file.name.endsWith(".pdf")) {
        status = "fileTypeError";
      }
      // check file size
      if (file.size > 8000000) {
        status = "fileSizeError";
      }
      setCurrentUploads((currentUploads) => [
        ...currentUploads,
        { file, progress: 0, status: status },
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

  const uploadInputButtonId = useId();

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
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
      <label htmlFor={uploadInputButtonId} className="mb-4 place-self-center">
        <div className="bg-brand text-dark hover:bg-brand/70 rounded-full border-0 p-6 text-xl font-extrabold">
          Browse Files
        </div>
        <input
          onChange={selectFiles}
          name="file"
          type="file"
          accept="capture=camera,image/*,application/pdf"
          multiple={true}
          id={uploadInputButtonId}
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
  const uploadMobileInputButtonId = useId();
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex h-full flex-col justify-stretch"
    >
      <label
        htmlFor={uploadMobileInputButtonId}
        className="mb-4 flex h-full flex-col items-center justify-center"
      >
        <div className="bg-brand text-dark hover:bg-brand/70 cursor-pointer rounded-full border-0 p-6 text-xl font-extrabold">
          Browse Files
        </div>
        <input
          onChange={selectFile}
          name="file"
          type="file"
          accept="capture=camera,image/*,application/pdf"
          multiple={true}
          id={uploadMobileInputButtonId}
          hidden
        />
      </label>
    </form>
  );
}

function UploadSelectedImage({
  filePreviewUrl,
  fileName,
  status,
  progress,
  uploadImageToBucket,
  index,
  deviceType,
}: {
  status: UploadStatus;
  filePreviewUrl: string | undefined;
  fileName: string;
  progress: number;
  uploadImageToBucket: (index: number) => void;
  index: number;
  deviceType: "mobile" | "desktop";
}) {
  // if file is a pdf, show a pdf icon
  const isPdf = fileName.endsWith(".pdf");

  if (deviceType === "mobile") {
    return (
      <div className="flex items-center justify-center">
        <div className="flex w-full">
          {status === "fileTypeError" || status === "fileSizeError" ? (
            <WarningIcon width={120} height={80} colour="rgb(239 68 68)" />
          ) : isPdf ? (
            <PdfFileIcon />
          ) : (
            <img src={filePreviewUrl} width={48} height={48} />
          )}
          <Text className="w-32 text-wrap break-words text-sm">{fileName}</Text>
          {status === "preview" && (
            <UploadFromPreview
              uploadImageToBucket={() => uploadImageToBucket(index)}
            />
          )}
          {status === "uploading" && <ProgressBar progress={progress} />}
          {status === "error" && (
            <UploadError
              uploadImageToBucket={() => uploadImageToBucket(index)}
            />
          )}
          {status === "success" && <UploadSuccess />}
          {status === "fileTypeError" && <FileError status={status} />}
          {status === "fileSizeError" && <FileError status={status} />}
        </div>
      </div>
    );
  }

  return (
    <div className="flex  flex-col items-center justify-center">
      <div className="w-32 ">
        {status === "fileTypeError" || status === "fileSizeError" ? (
          <WarningIcon width={120} height={80} colour="rgb(239 68 68)" />
        ) : isPdf ? (
          <PdfFileIcon />
        ) : (
          <img src={filePreviewUrl} width={128} height={128} />
        )}
        <Text className="text-wrap break-words text-sm">{fileName}</Text>
        {status === "preview" && (
          <UploadFromPreview
            uploadImageToBucket={() => uploadImageToBucket(index)}
          />
        )}
        {status === "uploading" && <ProgressBar progress={progress} />}
        {status === "error" && (
          <UploadError uploadImageToBucket={() => uploadImageToBucket(index)} />
        )}
        {status === "success" && <UploadSuccess />}
        {status === "fileTypeError" && <FileError status={status} />}
        {status === "fileSizeError" && <FileError status={status} />}
      </div>
    </div>
  );
}

function FileError({ status }: { status: UploadStatus }) {
  if (status === "fileSizeError") {
    return (
      <Text className="text-sm text-red-500">
        File size is too large. Max file size is 8MB
      </Text>
    );
  }
  if (status === "fileTypeError") {
    return (
      <Text className="text-sm text-red-500">
        File type not supported. Only images and pdfs are allowed
      </Text>
    );
  }
  return <Text className="text-sm text-red-500">Upload Not Allowed</Text>;
}

function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full">
      <progress
        value={progress}
        max={100}
        className="[&::-webkit-progress-value]:bg-brand w-full"
      />
      <Text className="text-sm">Uploading...</Text>
    </div>
  );
}

function UploadFromPreview({
  uploadImageToBucket,
}: {
  uploadImageToBucket: () => void;
}) {
  return (
    <button
      onClick={uploadImageToBucket}
      className="bg-altSecondary flex w-full items-center justify-center rounded-lg p-2 "
    >
      <UploadIcon /> <Text className="pl-2 text-sm">Upload</Text>
    </button>
  );
}

function UploadError({
  uploadImageToBucket,
}: {
  uploadImageToBucket: () => void;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center">
        <CancelIcon colour="rgb(239 68 68)" width={28} />
        <Text className="text-sm text-red-500">Upload Failed</Text>
      </div>
      <button
        onClick={uploadImageToBucket}
        className="bg-altSecondary flex w-full justify-center rounded-lg p-2 "
      >
        <RetryIcon width={20} /> <Text className="pl-2">Retry</Text>
      </button>
    </div>
  );
}

function UploadSuccess() {
  return (
    <div className="flex w-full p-2">
      <ConfirmIcon colour="rgb(21 128 61)" width={28} />
      <Text className="text-sm text-green-700">Upload Success</Text>
    </div>
  );
}

function UploadButton({
  currentUploads,
  setCurrentUploads,

  uploadImageToBucket,
}: {
  currentUploads: Upload[];
  setCurrentUploads: React.Dispatch<React.SetStateAction<Upload[]>>;

  uploadImageToBucket: (index: number) => void;
}) {
  const onClickUpload = () => {
    currentUploads.forEach((upload, index) => {
      // checks status
      if (upload.status === "preview" || upload.status === "error") {
        uploadImageToBucket(index);
      }
    });
  };

  return (
    <div className="flex justify-around">
      <CTAButton onClick={onClickUpload} rounded>
        <div className="flex">
          <UploadIcon />
          <Text className="pl-2">Upload All</Text>
        </div>
      </CTAButton>
      <CTAButton rounded secondary onClick={() => setCurrentUploads([])}>
        Clear
      </CTAButton>
    </div>
  );
}

function UploadingBar({ progress }: { progress: number }) {
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

/*
##########################################################################
MOBILE FILE UPLOAD DIALOG
##########################################################################
*/

function MobileFileUploadDialog({
  currentUploads,
  setCurrentUploads,
  uploadImageToBucket,
  deviceType,
}: {
  currentUploads: Upload[];
  setCurrentUploads: React.Dispatch<React.SetStateAction<Upload[]>>;
  uploadImageToBucket: (index: number) => void;
  deviceType: "mobile" | "desktop";
}) {
  if (currentUploads.length > 0) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <MobileFileUploadButton onClick={() => {}} />
        </DialogTrigger>
        <DialogContent className="Dialog">
          <DialogClose className="float-end rounded-lg border-2 border-black p-2">
            <p>Close</p>
          </DialogClose>
          <DialogHeading className="pt-3 text-xl">Filters</DialogHeading>
          <DialogDescription className="flex w-full flex-col items-center gap-4 pt-4">
            <UploadButton
              currentUploads={currentUploads}
              setCurrentUploads={setCurrentUploads}
              uploadImageToBucket={uploadImageToBucket}
            />
            <div className="flex w-full flex-col justify-center gap-4 py-4">
              {currentUploads.map((upload, index) => (
                <UploadSelectedImage
                  filePreviewUrl={URL.createObjectURL(upload.file)}
                  fileName={upload.file.name}
                  key={index}
                  status={upload.status}
                  progress={upload.progress}
                  uploadImageToBucket={uploadImageToBucket}
                  index={index}
                  deviceType={deviceType}
                />
              ))}
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <MobileFileUploadButton onClick={() => {}} />
      </DialogTrigger>
      <DialogContent className="Dialog">
        <DialogClose className="float-end rounded-lg border-2 border-black p-2">
          <p>Close</p>
        </DialogClose>
        <DialogHeading className="pt-3 text-xl">File Upload</DialogHeading>
        <DialogDescription className="flex w-full flex-col items-center gap-4 pt-4">
          <SelectImageToUpload
            setCurrentUploads={setCurrentUploads}
            deviceType="mobile"
          />
          <div className="flex w-full flex-wrap justify-center gap-8 py-4">
            Select Files to Upload
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

function MobileFileUploadButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-brand flex w-36 flex-col items-center justify-center rounded-lg p-2"
    >
      <UploadIcon />
      <Text className="font-semibold">Upload Image</Text>
    </button>
  );
}
