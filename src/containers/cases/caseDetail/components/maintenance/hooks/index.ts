"use client";

import { refetchCaseDetailsVar } from "@/containers/cases/state";
import axiosInstance, { endpoints } from "@/lib/axios";
import { useState } from "react";

export function useMaintenance() {
  const [loading, setLoading] = useState(false);

  const deleteFile = async (documentId: string) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`${endpoints.case.document}/${documentId}`);
      setLoading(false);
      refetchCaseDetailsVar(true);
    } catch (error) {}
  };

  return {
    loading,
    deleteFile,
  };
}
