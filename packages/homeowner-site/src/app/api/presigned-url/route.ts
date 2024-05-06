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

  const propertyId = searchParams.get("propertyId");

  if (!propertyId) {
    return new Response("No propertyId", { status: 400 });
  }

  const fileExtension = file.split(".").pop();

  const bucketName = Bucket.ItemUploads.bucketName;
  const key = `${propertyId}/${crypto.randomUUID()}.${fileExtension}`;
  const command = new PutObjectCommand({
    ACL: "private",
    Key: key,
    Bucket: bucketName,
  });

  const url = await getSignedUrl(new S3Client({}), command);

  return Response.json({ presignedUrl: url, key: key });
}
