"use client";

import axiosInstance, { endpoints } from "@/lib/axios";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useSidebar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  const [userCases, setUserCases] = useState([]);

  const getUserCases = async () => {
    try {
      const response = await axiosInstance.get(endpoints.case.userCases);
      setUserCases(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await getUserCases();
      setLoading(false);
    })();
  }, [pathname]);

  return {
    loading,
    userCases,
  };
}
