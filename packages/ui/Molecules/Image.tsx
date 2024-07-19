"use client";

import React from "react";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Image from "next/image";


async function getImageFromBucket({
  key,
  bucketName,
}: {
  key: string;
  bucketName: string;
}) {
  "use server";
  const params = {
    Bucket: bucketName,
    Key: key,
  };
  const getObjectCommand = new GetObjectCommand(params);
  const url = await getSignedUrl(new S3Client({}), getObjectCommand);
  return url;
}

// export async function CurrentCoverImage({
//   coverImageKey,
// }: {
//   coverImageKey: string | null;
// }) {
//   if (!coverImageKey) {
//     return (
//       <>
//       {/* <Image src={house} alt="house" className="h-full w-auto object-contain" /> */}
//       Stock House Image
//       </>
//     );
//   }
//   const url = await getImageFromBucket({ key: coverImageKey,  });
//   // const url = "";
//   return (
//     <Image
//       src={url}
//       alt="house"
//       className="h-full w-auto object-contain"
//       width={350}
//       height={330}
//     />
//   );
// }

export function ImageFromBucket({
  key,
  bucketName,
  width = 60,
  height = 60,
}: {
  key: string;
  bucketName: string;
  width?: number;
  height?: number;
}) {
  const url =  getImageFromBucket({ key, bucketName })

  if (!url) {
    return (
      <>
      Loading...
      </>
    );
  }
  // const url = "";
  return (
    <Image
      src={url}
      alt="house"
      className="h-full w-auto object-contain"
      width={width}
      height={height}
    />
  );
}
