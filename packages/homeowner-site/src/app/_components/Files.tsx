import {
  type ItemWithFiles,
  type Files,
  type Folder,
  type RootFolder,
  Item,
} from "../../../../core/homeowner/item";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Image from "next/image";
import { FolderIcon, PdfFileIcon } from "../../../../ui/Atoms/Icons";
import { Text } from "../../../../ui/Atoms/Text";
import { MobileFile, UpdateFileServerAction } from "./File";
import { revalidatePath } from "next/cache";

export default function Files({
  rootFolder,
  deviceType,
  propertyId,
}: {
  rootFolder: ItemWithFiles["filesRootFolder"];
  deviceType: string;
  propertyId: string;
}) {
  if (!rootFolder) {
    return <div>No files</div>;
  }

  const allFolders = [...rootFolder.folders];
  allFolders.push(rootFolder);

  console.log("rootFolder", rootFolder);

  if (deviceType === "mobile") {
    return (
      <MobileFiles
        rootFolder={rootFolder}
        deviceType={deviceType}
        propertyId={propertyId}
        allFolders={allFolders}
      />
    );
  }

  return (
    <div className="flex w-full flex-wrap justify-center gap-8 py-4">
      {rootFolder.files.map((file) => (
        <File
          file={file}
          deviceType={deviceType}
          itemId={rootFolder.itemId!}
          propertyId={propertyId}
          allFolders={allFolders}
        />
      ))}
    </div>
  );
}

function MobileFiles({
  rootFolder,
  deviceType,
  propertyId,
  allFolders,
}: {
  rootFolder: RootFolder;
  deviceType: string;
  propertyId: string;
  allFolders: Folder[];
}) {
  return (
    <div>
      <MobileFolder folder={rootFolder}>
        {rootFolder.files.map((file) => (
          <File
            file={file}
            deviceType={deviceType}
            itemId={rootFolder.itemId!}
            propertyId={propertyId}
            allFolders={allFolders}
          />
        ))}
      </MobileFolder>
      <div className="pl-6">
        {rootFolder.folders.map((folder) => (
          <MobileFolder folder={folder}>
            {folder.files.map((file) => (
              <File
                file={file}
                deviceType={deviceType}
                itemId={rootFolder.itemId!}
                propertyId={propertyId}
                allFolders={allFolders}
              />
            ))}
          </MobileFolder>
        ))}
      </div>
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
    <details className="pt-2" open>
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
  itemId,
  propertyId,
  allFolders,
}: {
  file: Files[number];
  deviceType: string;
  itemId: string;
  propertyId: string;
  allFolders: Folder[];
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

  const updateFile: UpdateFileServerAction = async ({ name, folderId }) => {
    "use server";
    console.log("updateFile", name, folderId);
    await Item.updateFile({
      id: file.id,
      name,
      folderId,
    });
    revalidatePath(`/properties/${propertyId}/items/${itemId}`);
  };

  const isPdf = file.type.endsWith("pdf");

  if (deviceType === "mobile") {
    return (
      <MobileFile
        url={url}
        file={file}
        updateFile={updateFile}
        allFolders={allFolders}
      />
    );
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
