import {
  type ItemWithFiles,
  type Files,
  type Folder,
  type RootFolder,
} from "../../../../core/homeowner/item";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Image from "next/image";
import { FolderIcon, PdfFileIcon } from "../../../../ui/Atoms/Icons";
import { Text } from "../../../../ui/Atoms/Text";
import { MobileFile } from "./File";

export default function Files({
  rootFolder,
  deviceType,
}: {
  rootFolder: ItemWithFiles["filesRootFolder"];
  deviceType: string;
}) {
  if (!rootFolder) {
    return <div>No files</div>;
  }

  console.log("rootFolder", rootFolder);

  if (deviceType === "mobile") {
    return <MobileFiles rootFolder={rootFolder} deviceType={deviceType} />;
  }

  return (
    <div className="flex w-full flex-wrap justify-center gap-8 py-4">
      {rootFolder.files.map((file) => (
        <File file={file} deviceType={deviceType} />
      ))}
    </div>
  );
}

function MobileFiles({
  rootFolder,
  deviceType,
}: {
  rootFolder: RootFolder;
  deviceType: string;
}) {
  return (
    <div>
      <MobileFolder folder={rootFolder}>
        {rootFolder.files.map((file) => (
          <File file={file} deviceType={deviceType} />
        ))}
        <div className="pl-2">
          {rootFolder.folders.map((folder) => (
            <MobileFolder folder={folder}>
              {folder.files.map((file) => (
                <File file={file} deviceType={deviceType} />
              ))}
            </MobileFolder>
          ))}
        </div>
      </MobileFolder>
    </div>
  );
}

function MobileFolder({
  folder,
  children,
}: {
  folder: Folder;
  children: React.ReactNode;
}) {
  return (
    <details className="" open>
      <summary className="rounded-md bg-slate-300 p-2 capitalize ">
        <span className="flex items-center">
          <FolderIcon width={20} height={20} />
          <Text>{folder.name}</Text>
        </span>
      </summary>
      <div className="grid gap-4 py-2 pl-4">{children}</div>
    </details>
  );
}

async function File({
  file,
  deviceType,
}: {
  file: Files[number];
  deviceType: string;
}) {
  const getImageFromBucket = async ({
    key,
    bucketName,
  }: {
    key: string;
    bucketName: string;
  }) => {
    "use server";
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    const getObjectCommand = new GetObjectCommand(params);
    const url = await getSignedUrl(new S3Client({}), getObjectCommand);
    return url;
  };
  const url = await getImageFromBucket({
    key: file.key,
    bucketName: file.bucket,
  });

  const isPdf = file.type.endsWith("pdf");

  if (deviceType === "mobile") {
    return <MobileFile url={url} file={file} />;
  }

  return (
    <div className="flex  flex-col items-center justify-center">
      <div className="w-32 ">
        {isPdf ? (
          <PdfFileIcon />
        ) : (
          <Image
            src={url}
            alt="house"
            className="h-full w-auto object-contain"
            width={200}
            height={200}
          />
          // <img
          //   src={url}
          //   alt="house"
          //   className="h-full w-auto object-contain"
          //   width={350}
          //   height={330}
          // />
        )}
        <Text className="text-wrap break-words text-sm">{file.name}</Text>
      </div>
    </div>
  );
}
