// // src/hooks/useS3Upload.ts
// import {
//   PutObjectCommand,
//   PutObjectCommandInput,
//   S3Client,
// } from "@aws-sdk/client-s3";
// import { Upload } from "@aws-sdk/lib-storage";
// import { useState } from "react";
// import { v4 as uuidv4 } from "uuid";

// interface UseS3UploadReturn {
//   partUploadToS3: (file: File, folder: string) => Promise<UploadResult | Error>;
//   uploadToS3: (file: File, folder: string) => Promise<string | Error>;
//   uploadWithBody: (
//     body: Blob | Buffer,
//     folder: string,
//     domain: string,
//     type?: string
//   ) => Promise<string | Error>;
//   uploadProgress: any | null;
//   uploadError: Error | null;
//   uploading: boolean;
//   uploadSuccess: boolean;
// }

// interface UploadResult {
//   Bucket: string;
//   Key: string;
//   Location: string;
// }

// // Initialize the S3 Client outside the hook to avoid re-initialization on every render
// const s3Client = new S3Client({
//   region: process.env.REACT_APP_S3_REGION,
//   credentials: {
//     accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID || "",
//     secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY || "",
//   },
// });

// const useS3Upload = (): UseS3UploadReturn => {
//   const [uploadProgress, setUploadProgress] = useState<any | null>(null);
//   const [uploadError, setUploadError] = useState<Error | null>(null);
//   const [uploading, setUploading] = useState<boolean>(false);
//   const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

//   /**
//    * Partially upload a file to S3 with multipart upload.
//    * @param {File} file - The file to upload.
//    * @param {string} folder - The target folder in the S3 bucket.
//    * @returns {Promise<UploadResult | Error>} - The result of the upload or an error.
//    */
//   const partUploadToS3 = async (
//     file: File,
//     folder: string
//   ): Promise<UploadResult | Error> => {
//     setUploading(true);
//     setUploadError(null);
//     setUploadSuccess(false);
//     setUploadProgress(null);

//     const fileName = file.name.split(".")[0];
//     const params = {
//       Bucket: process.env.REACT_APP_S3_BUCKET as string,
//       Key: `${folder}/${fileName}-${new Date().toISOString()}`,
//       Body: file,
//     };

//     try {
//       const parallelUploads3 = new Upload({
//         client: s3Client,
//         params: params as PutObjectCommandInput,
//         queueSize: 4, // Optional concurrency configuration
//         partSize: 1024 * 1024 * 5, // 5MB per part
//         leavePartsOnError: false, // Automatically abort multipart upload on error
//       });

//       parallelUploads3.on("httpUploadProgress", (progress) => {
//         setUploadProgress(progress);
//       });

//       const result = await parallelUploads3.done();
//       setUploading(false);
//       setUploadSuccess(true);
//       return result as UploadResult;
//     } catch (err) {
//       console.error("Error in partUploadToS3:", err);
//       setUploadError(err as Error);
//       setUploading(false);
//       return err as Error;
//     }
//   };

//   /**
//    * Upload a file to S3.
//    * @param {File} file - The file to upload.
//    * @param {string} folder - The target folder in the S3 bucket.
//    * @returns {Promise<string | Error>} - The S3 key or an error.
//    */
//   const uploadToS3 = async (
//     file: File,
//     folder: string
//   ): Promise<string | Error> => {
//     setUploading(true);
//     setUploadError(null);
//     setUploadSuccess(false);
//     setUploadProgress(null);

//     const splits = file.name.split(".");
//     const fileName = splits[0].trim().replace(/\s+/g, "");
//     const extension = splits[splits.length - 1];
//     const bucketParams: PutObjectCommandInput = {
//       Bucket: process.env.REACT_APP_S3_BUCKET as string,
//       Key: `${folder}/${fileName}-${uuidv4()}.${extension}`,
//       Body: file,
//       ContentType: file.type,
//     };

//     try {
//       await s3Client.send(new PutObjectCommand(bucketParams));
//       setUploading(false);
//       setUploadSuccess(true);
//       return bucketParams.Key;
//     } catch (err) {
//       console.error("Error in uploadToS3:", err);
//       setUploadError(err as Error);
//       setUploading(false);
//       return err as Error;
//     }
//   };

//   /**
//    * Upload data to S3 with a custom body.
//    * @param {Blob | Buffer} body - The data to upload.
//    * @param {string} folder - The target folder in the S3 bucket.
//    * @param {string} domain - The domain or identifier for the file.
//    * @param {string} type - The MIME type of the file.
//    * @returns {Promise<string | Error>} - The S3 key or an error.
//    */
//   const uploadWithBody = async (
//     body: Blob | Buffer,
//     folder: string,
//     domain: string,
//     type: string = "image/jpeg"
//   ): Promise<string | Error> => {
//     setUploading(true);
//     setUploadError(null);
//     setUploadSuccess(false);
//     setUploadProgress(null);

//     const bucketParams: PutObjectCommandInput = {
//       Bucket: process.env.REACT_APP_S3_BUCKET as string,
//       Key: `${folder}/${domain}`,
//       Body: body,
//       ContentType: type,
//     };

//     try {
//       await s3Client.send(new PutObjectCommand(bucketParams));
//       setUploading(false);
//       setUploadSuccess(true);
//       return bucketParams.Key;
//     } catch (err) {
//       console.error("Error in uploadWithBody:", err);
//       setUploadError(err as Error);
//       setUploading(false);
//       return err as Error;
//     }
//   };

//   return {
//     partUploadToS3,
//     uploadToS3,
//     uploadWithBody,
//     uploadProgress,
//     uploadError,
//     uploading,
//     uploadSuccess,
//   };
// };

// export default useS3Upload;
