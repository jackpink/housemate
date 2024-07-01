import {
  type ItemWithFiles,
  type Files,
  type Folder as FolderType,
  type RootFolder,
  Item,
} from "../../../../core/homeowner/item";
import { ItemFilesFolder } from "../../../../core/homeowner/folder";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Bucket } from "sst/node/bucket";
import { MobileFile, UpdateFileServerAction } from "./File";
import { revalidatePath } from "next/cache";
import Folder, { UpdateFolderServerAction } from "./Folder";

export default function Files({
  rootFolder,
  deviceType,
  propertyId,
  isThumbnail = false,
}: {
  rootFolder: ItemWithFiles["filesRootFolder"];
  deviceType: "mobile" | "desktop";
  propertyId: string;
  isThumbnail?: boolean;
}) {
  if (!rootFolder) {
    return <div>No files</div>;
  }

  const allFolders = [...rootFolder.folders];
  allFolders.push(rootFolder);

  console.log("rootFolder", rootFolder);

  const updateFolder: UpdateFolderServerAction = async ({
    name,
    folderId,
    itemId,
  }) => {
    "use server";
    console.log("updateFile", name, folderId);
    await ItemFilesFolder.update({
      id: folderId,
      name,
    });
    revalidatePath(`/properties/${propertyId}/items/${itemId}`);
  };

  if (isThumbnail) {
    return (
      <FilesThumbnail
        rootFolder={rootFolder}
        deviceType={deviceType}
        propertyId={propertyId}
        allFolders={allFolders}
      />
    );
  }

  return (
    <FilesList
      rootFolder={rootFolder}
      deviceType={deviceType}
      propertyId={propertyId}
      allFolders={allFolders}
      itemId={rootFolder.itemId!}
      updateFolder={updateFolder}
    />
  );
}

function FilesThumbnail({
  rootFolder,
  deviceType,
  propertyId,
  allFolders,
}: {
  rootFolder: RootFolder;
  deviceType: string;
  propertyId: string;
  allFolders: FolderType[];
}) {
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

function FilesList({
  rootFolder,
  deviceType,
  propertyId,
  allFolders,
  itemId,
  updateFolder,
}: {
  rootFolder: RootFolder;
  deviceType: "mobile" | "desktop";
  propertyId: string;
  allFolders: FolderType[];
  itemId: string;
  updateFolder: UpdateFolderServerAction;
}) {
  // @ts-ignore
  const bucketName = (Bucket.ItemUploads.bucketName as string) || "not found";
  return (
    <div>
      <Folder
        folder={rootFolder}
        propertyId={propertyId}
        itemId={itemId}
        updateFolder={updateFolder}
        bucketName={bucketName}
        deviceType={deviceType}
      >
        {rootFolder.files.map((file) => (
          <File
            file={file}
            deviceType={deviceType}
            itemId={rootFolder.itemId!}
            propertyId={propertyId}
            allFolders={allFolders}
          />
        ))}
      </Folder>
      <div className="pl-6">
        {rootFolder.folders.map((folder) => (
          <Folder
            folder={folder}
            propertyId={propertyId}
            itemId={itemId}
            updateFolder={updateFolder}
            bucketName={bucketName}
            deviceType={deviceType}
          >
            {folder.files.map((file) => (
              <File
                file={file}
                deviceType={deviceType}
                itemId={rootFolder.itemId!}
                propertyId={propertyId}
                allFolders={allFolders}
              />
            ))}
          </Folder>
        ))}
      </div>
    </div>
  );
}

async function File({
  file,
  deviceType,
  itemId,
  propertyId,
  allFolders,
  isThumbnail = false,
}: {
  file: Files[number];
  deviceType: string;
  itemId: string;
  propertyId: string;
  allFolders: FolderType[];
  isThumbnail?: boolean;
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

  if (!isThumbnail) {
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
    <MobileFile
      url={url}
      file={file}
      updateFile={updateFile}
      allFolders={allFolders}
      isThumbnail={isThumbnail}
    />
  );
}
