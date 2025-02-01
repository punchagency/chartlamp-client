"use client";

import { caseTags } from "@/interface";
import axiosInstance, { endpoints } from "@/lib/axios";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useCaseDetailsView() {
  const searchParams = useSearchParams();
  const params = useParams();

  const [comments, setComments] = useState<any[]>([]);
  const [caseTags, setCaseTags] = useState<caseTags[]>([]);
  const [dcTags, setDcTags] = useState<string[]>([]);
  const activeYearInViewParam = searchParams.get("activeYearInView");
  const partIdParam = searchParams.get("partId");
  const icdCodeParam = searchParams.get("icd-code");
  const reportIdParam = searchParams.get("reportId");
  const reportIndexParm = searchParams.get("reportIndex");
  const reportIndex = reportIndexParm ? parseInt(reportIndexParm) : 0;

  const [loading, setLoading] = useState(true);
  const [refetchTags, setRefetchTags] = useState(true);

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
      setRefetchTags(false);
      const response = await axiosInstance.patch(
        `${endpoints.case.reports.updateReport}/${caseId}/reports/${reportId}`,
        data
      );
      setRefetchTags(true);
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

  const getDcTagMapping = async ({
    reportId,
    caseId,
    icdCode,
    ...rest
  }: {
    reportId: string;
    caseId: string;
    icdCode: string;
    dc?: string;
  }) => {
    try {
      const response = await axiosInstance.post(
        `${endpoints.case.reports.updateReport}/${caseId}/reports/${reportId}/dc/tags`,
        {
          dc: rest.dc ?? null,
          icdCode: !rest.dc ? icdCode : null,
        }
      );
      const savedDcTags = response.data || [];
      if (!savedDcTags.length) {
        setDcTags([]);
      } else {
        const dcTags = savedDcTags.map((tag: any) => tag.caseTag);
        setDcTags(dcTags);
      }
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
    dcTags,
    refetchTags,
    reportIdParam,
    caseIdParam: params.id,
    comments,
    caseTags,
    loading,
    activeYearInViewParam,
    partIdParam,
    icdCodeParam,
    reportIndex,
    setComments,
    updateReportDetails,
    addComment,
    getReportComments,
    getStreamlinedDiseaseName,
    updateComment,
    getCaseTags,
    getDcTagMapping,
  };
}
