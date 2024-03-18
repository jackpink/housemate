import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import axios from "axios";
import { Bucket } from "sst/node/bucket";

export async function getPresignedUrlForPropertyCoverImage({
  propertyId,
}: {
  propertyId: string;
}) {
  const bucketName = Bucket.PropertyCoverImageBucket.bucketName;
  const key = `${propertyId}/${crypto.randomUUID()}`;
  const command = new PutObjectCommand({
    ACL: "private",
    Key: key,
    Bucket: bucketName,
  });

  const url = await getSignedUrl(new S3Client({}), command);

  return { url: url, key: key };
}

export function uploadFile({ file, url }: { file: File; url: string }) {
  return axios.post(url, file, {
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
      }
    },
  });
}
