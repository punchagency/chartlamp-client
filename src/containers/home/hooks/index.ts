"use client";

import { CaseDetail } from "@/interface";
import axiosInstance, { endpoints } from "@/lib/axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useDashboard() {
  const pathname = usePathname();
  const [stats, setStats] = useState([]);
  const [claimRelatedReports, setClaimRelatedReports] = useState([]);
  const [mostVisitedCases, setMostVisitedCases] = useState([]);
  const [recentlyJoined, setRecentlyJoined] = useState([]);
  const [lastViewed, setlastViewed] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserStats = async () => {
    try {
      const response = await axiosInstance.get(endpoints.case.userStats);
      setStats(response.data);
    } catch (error) {}
  };

  const getClaimRelatedReports = async () => {
    try {
      const response = await axiosInstance.get(
        endpoints.case.reports.claimRelated
      );
      setClaimRelatedReports(response.data);
    } catch (error) {}
  };

  const getMostVisitedCasesByUser = async () => {
    try {
      const response = await axiosInstance.get(endpoints.case.mostVisited);
      setMostVisitedCases(response.data);
    } catch (error) {}
  };

  const getFavoriteCasesByUser = async () => {
    try {
      const response = await axiosInstance.get(endpoints.case.favoriteCases);
      setMostVisitedCases(response.data);
    } catch (error) {}
  };

  const getRecentlyJoinedUsers = async () => {
    try {
      const response = await axiosInstance.get(endpoints.user.recentlyJoined);
      setRecentlyJoined(response.data);
    } catch (error) {}
  };

  const getLastViewedCaseByUser = async () => {
    try {
      const response = await axiosInstance.get(endpoints.case.lastViewed);

      setlastViewed(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    (async () => {
      if (pathname.includes("dashboard")) {
        setLoading(true);
        await Promise.all([
          getUserStats(),
          getClaimRelatedReports(),
          getFavoriteCasesByUser(),
          getRecentlyJoinedUsers(),
          getLastViewedCaseByUser(),
        ]);
        setLoading(false);
      }
    })();
  }, [pathname]);

  return {
    loading,
    stats,
    claimRelatedReports,
    mostVisitedCases,
    recentlyJoined,
    lastViewed,
  };
}
