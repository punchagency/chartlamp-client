"use client";

import useUpdateParams from "@/hooks/useUpdateParams";
import axiosInstance, { endpoints } from "@/lib/axios";
import { ActionRequired } from "@/types/case";
import {
  AppBucketName,
  createParams,
  filePath,
  getFileKey,
  s3Client,
} from "@/utils/s3";
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { addDays } from "date-fns";
import { useFormik } from "formik";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import * as Yup from "yup";
import { refetchCaseDetailsVar } from "../state";

export function useCaseUpload({
  onClose,
  plaintiff,
  caseNumber,
  caseId,
  callBkFn,
}: {
  onClose: () => void;
  caseId?: string;
  plaintiff?: string;
  caseNumber?: string;
  callBkFn?: () => void;
}) {
  const { reloadParams } = useUpdateParams();

  const [progress, setProgress] = useState(0);
  const [fileNames, setFileNames] = useState<Array<string>>([]);
  const [attachments, setAttachments] = useState<Array<string>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploaded(false);
    const filteredFileNames = acceptedFiles.map((file) => file.name);
    setFileNames((prev) => [...prev, ...filteredFileNames]);

    for (const file of acceptedFiles) {
      const index = filteredFileNames.findIndex(
        (attachment) => attachment === file.name
      );
      setCurrentIndex(index);

      const params = createParams(file);
      const key = params.Key;
      let s3Path = filePath(key);

      try {
        // Check if file already exists in S3
        await s3Client.send(
          new HeadObjectCommand({ Bucket: params.Bucket, Key: key })
        );
        console.log(`File "${key}" already exists. Adding to attachments.`);

        // Add existing file to attachments
        setAttachments((prev) => [...prev, s3Path]);
        continue; // Move to the next file
      } catch (error: any) {
        if (error.name !== "NotFound") {
          console.error("Error checking file existence", error);
          continue; // Skip to the next file on error
        }
      }

      // File doesn't exist, proceed with upload
      const command = new PutObjectCommand(params);
      setProgress(10);

      try {
        const data = await s3Client.send(command, {
          onUploadProgress: (progressEvent: {
            loaded?: number;
            total?: number;
          }) => {
            if (progressEvent.loaded && progressEvent.total) {
              const percentage = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              );
              setProgress(percentage);
            }
          },
        } as any);

        if (key && data.$metadata.httpStatusCode === 200) {
          setAttachments((prev) => [...prev, s3Path]); // Add successful upload
          setProgress(0);
        } else {
          console.error(
            `Failed to upload "${key}". Removing from attachments.`
          );
          setAttachments((prev) => prev.filter((path) => path !== s3Path)); // Remove failed upload
        }
      } catch (uploadError) {
        console.error("Error uploading file", uploadError);
        setAttachments((prev) => prev.filter((path) => path !== s3Path)); // Remove failed upload
      }

      console.log(`onDrop`, { fileNames, attachments });
    }

    setIsUploaded(true);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // maxSize: 10485760,
    accept: {
      "application/pdf": [".pdf"],
      "image/tiff": [".tiff", ".tif"],
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(endpoints.case.create, values);
      if (response.data && response.data._id) {
        console.log("handleSubmit", response.data);
        // setActiveCaseId(response.data._id);
        // setActiveCaseDetails(response.data);
        // progressModalVar(true);
        reloadParams({ activeCaseId: response.data._id });
      }
      setIsSubmitting(false);
      onClose();
    } catch (error) {}
  };

  const addNewFiles = async () => {
    try {
      setIsSubmitting(true);
      await axiosInstance.patch(
        `${endpoints.case.create}/${caseId}/add-document`,
        attachments
      );
      setIsSubmitting(false);
      refetchCaseDetailsVar(true);
      callBkFn && callBkFn();
    } catch (error) {}
  };

  const deleteFileFromS3 = async (fileKey: string) => {
    try {
      const command = new DeleteObjectCommand({
        Bucket: AppBucketName, // Replace with your actual bucket name
        Key: fileKey,
      });

      await s3Client.send(command);
      console.log(`File "${fileKey}" deleted successfully.`);
    } catch (error) {
      console.error("Error deleting file from S3:", error);
    }
  };

  const removeFromList = async (index: number) => {
    const fileUrl = attachments[index];
    // console.log("fileUrl", fileUrl);
    const filekey = await getFileKey(fileUrl);
    // console.log("filekey", filekey);
    // if(filekey) await deleteFileFromS3(filekey);
    const filteredFileNames = fileNames.filter((_, i) => i !== index);
    setFileNames(filteredFileNames);
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
  };

  const formik = useFormik({
    initialValues: {
      plaintiff: plaintiff || "",
      caseNumber: caseNumber || "",
      dateOfClaim: new Date(),
      // claimStatus: ClaimStatus.NEW,
      actionRequired: ActionRequired.INTAKE_PROCESS,
      targetCompletion: addDays(new Date(), 30),
      documents: [],
    },

    validationSchema: Yup.object({
      plaintiff: Yup.string().required("Required"),
      caseNumber: Yup.string().required("Required"),
    }),
    onSubmit: async () => {
      if (caseId) {
        addNewFiles();
      } else {
        await handleSubmit({
          ...formik.values,
          documents: attachments,
        });
      }
    },
  });

  const getFileName = (url: string) => {
    return url.substring(url.lastIndexOf("/") + 1);
  };

  return {
    formik,
    getRootProps,
    getInputProps,
    isDragActive,
    currentIndex,
    files: fileNames,
    progress,
    getFileName,
    isSubmitting,
    addNewFiles,
    removeFromList,
    isUploaded,
    attachments,
  };
}
