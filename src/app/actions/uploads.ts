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
  const command = new PutObjectCommand({
    ACL: "private",
    Key: `${propertyId}/${crypto.randomUUID()}`,
    Bucket: bucketName,
  });

  const url = await getSignedUrl(new S3Client({}), command);

  return url;
}

export function uploadFile({ file, url }: { file: File; url: string }) {
  axios
    .post(url, file, {
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
    })
    .then((response) => {
      console.log("response", response);
    })
    .catch((error) => {
      console.error("error", error);
    });
}
