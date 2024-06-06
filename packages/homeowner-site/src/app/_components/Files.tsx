import { type ItemWithFiles } from "../../../../core/homeowner/item";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Image from "next/image";
import { PdfFileIcon } from "../../../../ui/Atoms/Icons";
import { Text } from "../../../../ui/Atoms/Text";

export default function Files({ files }: { files: ItemWithFiles["files"] }) {
  return (
    <div className="flex w-full flex-wrap justify-center gap-8 py-4">
      {files.map((file) => (
        <File file={file} />
      ))}
    </div>
  );
}

async function File({ file }: { file: ItemWithFiles["files"][0] }) {
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
    console.log("params", params);
    const getObjectCommand = new GetObjectCommand(params);
    const url = await getSignedUrl(new S3Client({}), getObjectCommand);
    return url;
  };
  const url = await getImageFromBucket({
    key: file.key,
    bucketName: file.bucket,
  });

  const isPdf = file.type.endsWith("pdf");

  console.log("url", url);

  return (
    <div className="flex  flex-col items-center justify-center">
      <div className="w-32 ">
        {isPdf ? (
          <PdfFileIcon />
        ) : (
          // <Image
          //   src={url}
          //   alt="house"
          //   className="h-full w-auto object-contain"
          //   width={350}
          //   height={330}
          // />
          <img
            src={url}
            alt="house"
            className="h-full w-auto object-contain"
            width={350}
            height={330}
          />
        )}
        <Text className="text-wrap break-words text-sm">{file.name}</Text>
      </div>
    </div>
  );
}
