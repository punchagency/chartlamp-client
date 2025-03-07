import {
  CaseDcTagMapping,
  ReportsDetailWithBodyPart,
  ReportsFilter,
} from "@/interface";
import axiosInstance, { endpoints } from "@/lib/axios";
import { filterReportsByDcForReporting } from "@/utils/general";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function useReport({
  reports,
}: {
  reports: ReportsDetailWithBodyPart[];
}) {
  const { id } = useParams<{ id: string }>();
  const [filteredReports, setFilteredReports] = useState<
    ReportsDetailWithBodyPart[]
  >(reports.slice() || []);
  const [filterValues, setFilterValues] = useState<ReportsFilter>({
    tag: [],
    dcs: [],
    icdCodes: [],
    searchVal: "",
    isFiltered: false,
  });

  const debounced = useDebouncedCallback((value: string) => {
    setFilterValues({
      ...filterValues,
      searchVal: value,
    });
  }, 1000);

  const handleFilterReports = () => {
    const matchedReports = filterReportsByDcForReporting(
      reports.slice(),
      filterValues
    );
    setFilteredReports(matchedReports);
  };

  const handleSelect = (fieldName: string, selectedVal?: string) => {
    if (fieldName === "tag") {
      if (selectedVal) {
        getReportsByTagMapping(selectedVal).then((response) => {
          if (!response) return;
          const { reportIds, dcs, icdCodes } = response;
          setFilterValues({
            ...filterValues,
            [fieldName]: reportIds,
            dcs,
            icdCodes,
            isFiltered: true,
          });
        });
      } else {
        setFilterValues({
          ...filterValues,
          [fieldName]: [],
          dcs: [],
          icdCodes: [],
          isFiltered: false,
        });
      }
    } else {
      if (fieldName === "searchVal") {
        debounced(selectedVal || "");
      } else {
        setFilterValues({
          ...filterValues,
          [fieldName]: selectedVal,
          isFiltered: true,
        });
      }
    }
  };

  const getReportsByTagMapping = async (caseTagId: string) => {
    if (!id) return;
    const response = await axiosInstance.post(
      `${endpoints.case.reports.updateReport}/${id}/reports/filter-by-tags`,
      {
        caseTagId,
      }
    );

    const caseDcTagsResponse: CaseDcTagMapping[] = response.data;

    const filteredReports = caseDcTagsResponse.map((tag) => tag.report);

    const filteredDcs = caseDcTagsResponse.flatMap((tag) => tag?.dc || []);
    const uniqueDcs = new Set(filteredDcs);

    const filteredIcdcodes = caseDcTagsResponse.flatMap(
      (tag) => tag?.icdCode || []
    );
    const uniqueIcdCodes = new Set(filteredIcdcodes);

    return {
      reportIds: filteredReports,
      dcs: Array.from(uniqueDcs),
      icdCodes: Array.from(uniqueIcdCodes),
    };
  };

  const csvdata = useMemo(() => {
    if (!filteredReports) return [];
    if (!filteredReports.length) return [];
    const allIcdCodes = filteredReports.flatMap((item) => item.icdCodes);
    const uniqueIcdCodes = Array.from(new Set(allIcdCodes));
    return uniqueIcdCodes.map((icdCode) => {
      return {
        icdCode,
      };
    });
  }, [filteredReports]);

  useEffect(() => {
    handleFilterReports();
  }, [reports, filterValues]);

  return {
    filteredReports,
    csvdata,
    handleSelect,
  };
}
