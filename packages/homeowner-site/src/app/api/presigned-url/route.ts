import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest } from "next/server";
import { Bucket } from "sst/node/bucket";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const file = searchParams.get("file");

  if (!file) {
    return new Response("No file", { status: 400 });
  }

  const bucketKey = searchParams.get("bucketKey");

  if (!bucketKey) {
    return new Response("No bucket key folder name", { status: 400 });
  }

  const bucketName = searchParams.get("bucketName");

  if (!bucketName) {
    return new Response("No bucket name", { status: 400 });
  }

  const fileExtension = file.split(".").pop();

  const key = `${bucketKey}/${crypto.randomUUID()}.${fileExtension}`;
  const command = new PutObjectCommand({
    ACL: "private",
    Key: key,
    Bucket: bucketName,
  });

  const url = await getSignedUrl(new S3Client({}), command);

  return Response.json({ presignedUrl: url, key: key });
}
