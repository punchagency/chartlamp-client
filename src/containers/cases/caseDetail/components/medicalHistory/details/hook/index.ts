"use client";

import { refetchCaseDetailsVar } from "@/containers/cases/state";
import { caseTags } from "@/interface";
import axiosInstance, { endpoints } from "@/lib/axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useCaseDetailsView() {
  const searchParams = useSearchParams();
  const [comments, setComments] = useState<any[]>([]);
  const [caseTags, setCaseTags] = useState<caseTags[]>([]);
  const activeYearInViewParam = searchParams.get("activeYearInView");
  const partIdParam = searchParams.get("partId");
  const reportIndexParm = searchParams.get("reportIndex");
  const reportIndex = reportIndexParm ? parseInt(reportIndexParm) : 0;

  const [loading, setLoading] = useState(true);

  const updateReportDetails = async ({
    caseId,
    reportId,
    data,
  }: {
    caseId: string;
    reportId: string;
    data: any;
  }) => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch(
        `${endpoints.case.reports.updateReport}/${caseId}/reports/${reportId}`,
        data
      );
      refetchCaseDetailsVar(true);
    } catch (error) {}
  };

  const addComment = async ({
    caseId,
    reportId,
    data,
  }: {
    caseId: string;
    reportId: string;
    data: any;
  }) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `${endpoints.case.reports.updateReport}/${caseId}/reports/${reportId}/comment`,
        data
      );
      await getReportComments({ caseId, reportId });
    } catch (error) {}
  };

  const getReportComments = async ({
    caseId,
    reportId,
  }: {
    caseId: string;
    reportId: string;
  }) => {
    try {
      const response = await axiosInstance.get(
        `${endpoints.case.reports.updateReport}/${caseId}/reports/${reportId}/comment`
      );
      // return response.data || [];
      setComments(response.data || []);
    } catch (error) {}
  };

  const getCaseTags = async ({ caseId }: { caseId: string }) => {
    try {
      const response = await axiosInstance.get(
        `${endpoints.case.reports.updateReport}/${caseId}/tags`
      );
      setCaseTags(response.data || []);
    } catch (error) {}
  };

  const updateComment = async ({
    commentId,
    caseId,
    reportId,
    comment,
  }: {
    commentId: string;
    comment: string;
    caseId: string;
    reportId: string;
  }) => {
    try {
      const response = await axiosInstance.patch(
        `${endpoints.case.reports.updateReport}/${commentId}/comment`,
        {
          comment,
        }
      );
      await getReportComments({ caseId, reportId });

      return response.data || [];
    } catch (error) {}
  };

  const getStreamlinedDiseaseName = async ({
    icdCodes,
    diseaseNames,
    caseId,
    reportId,
  }: {
    icdCodes: string[];
    diseaseNames: string;
    caseId: string;
    reportId: string;
  }) => {
    try {
      const response = await axiosInstance.post(
        `${endpoints.case.reports.updateReport}/disease-name`,
        {
          icdCodes,
          diseaseNames,
          caseId,
          reportId,
        }
      );
      // console.log("getStreamlinedDiseaseName", response.data);
      return response.data;
    } catch (error) {}
  };

  useEffect(() => {
    () => setComments([]);
    () => setCaseTags([]);
  }, [reportIndex]);

  return {
    comments,
    caseTags,
    loading,
    activeYearInViewParam,
    partIdParam,
    reportIndex,
    setComments,
    updateReportDetails,
    addComment,
    getReportComments,
    getStreamlinedDiseaseName,
    updateComment,
    getCaseTags,
  };
}
