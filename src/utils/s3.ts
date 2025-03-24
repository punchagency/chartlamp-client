import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  },
});

export const AppBucketName = "chartlamp";

export const generateUniqueFileName = (file: any) => {
  const timestamp = Date.now();
  const filename = `${timestamp}-${file.name ? file.name : ""}`;
  return filename;
};

export const createParams = (file: any) => {
  const fileName = generateUniqueFileName(file);
  return {
    Bucket: AppBucketName,
    Key: file.name,
    Body: file,
    ContentType: file.type,
  };
};

export const uploadFileToS3 = async (file: any) => {
  const params = createParams(file);
  const command = new PutObjectCommand(params);
  try {
    await s3Client.send(command);
    return filePath(params.Key);
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};

export const filePath = (fileName: string) =>
  `https://${AppBucketName}.s3.amazonaws.com/${fileName}`;

export const getFileKey = (url: string) => {
  try {
    const urlObj = new URL(url);
    return decodeURIComponent(urlObj.pathname.substring(1)); // Remove leading "/"
  } catch (error) {
    console.error("Invalid URL:", error);
    return undefined;
  }
};
