"use client";
import { CaseDetail, CaseNote } from "@/interface";
import axiosInstance, { endpoints } from "@/lib/axios";
import { CronStatus } from "@/types/case";
import { ChartLampUser } from "@/types/user";
import { useReactiveVar } from "@apollo/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  refetchCaseDetailsVar,
  refetchCaseDetailsWithoutLoadingVar,
} from "../../state";
import { CaseDetailEnum } from "../constants";

export function useCaseDetails() {
  const refetchCaseDetails = useReactiveVar(refetchCaseDetailsVar);
  const refetchCaseDetailsWithoutLoading = useReactiveVar(
    refetchCaseDetailsWithoutLoadingVar
  );
  const { id, tab } = useParams<{ id: string; tab: CaseDetailEnum }>();
  const [caseDetail, setCaseDetails] = useState<CaseDetail | null>(null);
  const [caseNotes, setCaseNotes] = useState<CaseNote[] | []>([]);
  const [teamMembers, setTeamMembers] = useState<ChartLampUser[]>([]);
  const [loadingCaseNotes, setLoadingCaseNotes] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCaseDetails = async (ignoreLoading = false) => {
    try {
      if (!ignoreLoading) setLoading(true);
      // const cachedCaseDetails = localStorage.getItem(`${id}`);
      // console.log("cachedCaseDetails", cachedCaseDetails);
      // if (cachedCaseDetails) {
      //   setCaseDetails(JSON.parse(cachedCaseDetails));
      //   setLoading(false);
      // }
      const response = await axiosInstance.get(
        `${endpoints.case.detail}/${id}/detail`
      );
      setCaseDetails(response.data);
      // const data = JSON.stringify(response.data);
      // localStorage.setItem(`${id}`, data);
      refetchCaseDetailsVar(false);
      refetchCaseDetailsWithoutLoadingVar(false);
      if (!ignoreLoading) setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getCaseNotes = async (caseId: string) => {
    try {
      setLoadingCaseNotes(true);
      const response = await axiosInstance.get(
        `${endpoints.case.detail}/${id}/notes`
      );
      setCaseNotes(response.data);
      setLoadingCaseNotes(false);
    } catch (error) {
      setLoadingCaseNotes(false);
    }
  };

  const getTeamMembers = async () => {
    try {
      const response = await axiosInstance.get(
        `${endpoints.user.getUser}/team-members`
      );
      setTeamMembers(response.data?.teamMembers);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) getCaseDetails();
  }, [id]);

  useEffect(() => {
    getTeamMembers();
  }, []);

  useEffect(() => {
    if (refetchCaseDetails) getCaseDetails();
  }, [refetchCaseDetails]);

  useEffect(() => {
    if (refetchCaseDetailsWithoutLoading) getCaseDetails(true);
  }, [refetchCaseDetailsWithoutLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (caseDetail && caseDetail.cronStatus !== CronStatus.Processed) {
        getCaseDetails(true);
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval); // Clear interval on unmount
  }, [caseDetail]);

  return {
    loading,
    caseDetail,
    teamMembers,
    loadingCaseNotes,
    caseNotes,
    getCaseNotes,
  };
}
