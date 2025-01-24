"use client";

import axiosInstance, { endpoints } from "@/lib/axios";
import { ActionRequired } from "@/types/case";
import { createParams, filePath, s3Client } from "@/utils/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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
  const [progress, setProgress] = useState(0);
  const [fileNames, setFileNames] = useState<Array<string>>([]);
  const [attachments, setAttachments] = useState<Array<string>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploaded(false);
    const filteredFileNames = acceptedFiles.map((file) => file.name);
    setFileNames(filteredFileNames);
    for (const file of acceptedFiles) {
      const index = filteredFileNames.findIndex(
        (attachment) => attachment === file.name
      );
      setCurrentIndex(index);
      const params = createParams(file);
      const command = new PutObjectCommand(params);
      setProgress(10);
      try {
        const data = await s3Client.send(command, {
          onUploadProgress: (progressEvent: { loaded?: any; total?: any }) => {
            const { loaded } = progressEvent;
            const { total } = progressEvent;
            const percentage = Math.round((loaded / total) * 100);
            setProgress(percentage);
          },
        } as any);

        if (params.Key && data.$metadata.httpStatusCode === 200) {
          const s3Path = filePath(params.Key);
          attachments.push(s3Path);
          setAttachments(attachments);
          setProgress(0);
        }
      } catch (error) {
        console.error("Error uploading file", error);
      }
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

  const removeFromList = (index: number) => {
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
    onSubmit: () => {
      if (caseId) {
        addNewFiles();
      } else {
        handleSubmit({
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
  };
}
