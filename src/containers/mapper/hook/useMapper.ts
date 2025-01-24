"use client";

import { searchByDisease } from "@/app/actions";
import axiosInstance, { endpoints } from "@/lib/axios";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

export function useMapper() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [affectedBodyPart, setAffectedBodyPart] = useState({
    images: [] as any[],
    bodyParts: "",
    description: "",
  });

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const isIcdCode = checkIsIcdCode(formik.values.icdCode);
      if (isIcdCode) {
        await searchByIcdCode();
      } else {
        await searchByCondition();
      }
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const searchByCondition = async () => {
    try {
      const response = await searchByDisease(formik.values.icdCode);
      
      if (response && response.length > 2) {
        await getByIcdCodes(response[1]);
      }
    } catch (error) {}
  };

  async function searchByIcdCode() {
    // const formattedCode = formik.values.icdCode.split(".").join("");

    const response = await axiosInstance.get(
      `${endpoints.dc.getByIcdCode}/${formik.values.icdCode}/images`
    );
    setAffectedBodyPart(response.data);
  }

  const checkIsIcdCode = (icdCode: string) => {
    // Check if the icdCode has a number in it
    return /\d/.test(icdCode);
  };

  const getByIcdCodes = async (icdCodes: string[]) => {
    try {
      const formattedCodes = icdCodes.map((code) => code.split(".").join(""));
      const response = await axiosInstance.post(
        `${endpoints.dc.getImagesByIcdCodes}`,
        { icdCodes: formattedCodes }
      );
      setAffectedBodyPart(response.data);
    } catch (error) {}
  };

  const formik = useFormik({
    initialValues: {
      icdCode: "",
    },
    validationSchema: Yup.object({
      icdCode: Yup.string().required("Required"),
    }),
    onSubmit: () => {},
  });

  return {
    formik,
    handleSubmit,
    searchByCondition,
    affectedBodyPart,
    isSubmitting,
  };
}

// A009;
