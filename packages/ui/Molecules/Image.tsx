"use server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Bucket } from "sst/node/bucket";
import Image from "next/image";
import house from "../../../../public/house-stock-image.png";

async function getImageFromBucket({ key }: { key: string }) {
  const params = {
    Bucket: Bucket.PropertyCoverImageBucket.bucketName,
    Key: key,
  };
  const getObjectCommand = new GetObjectCommand(params);
  const url = await getSignedUrl(new S3Client({}), getObjectCommand);
  return url;
}

export async function CurrentCoverImage({
  coverImageKey,
}: {
  coverImageKey: string | null;
}) {
  if (!coverImageKey) {
    return (
      <Image src={house} alt="house" className="h-full w-auto object-contain" />
    );
  }
  const url = await getImageFromBucket({ key: coverImageKey });
  // const url = "";
  return (
    <Image
      src={url}
      alt="house"
      className="h-full w-auto object-contain"
      width={350}
      height={330}
    />
  );
}
