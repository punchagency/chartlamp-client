import { ReportsDetail, TagsType, UserDetail } from "@/interface";
import { NEUTRAL, pxToRem } from "@/theme";
import { Stack } from "@mui/material";
import { useMemo, useState } from "react";
import TopNav from "../TopNav";
import ActionsTab from "../actionsTab";
import ReportTable from "./table";

interface ReportProps {
  reports: ReportsDetail[] | undefined;
  user: UserDetail | undefined;
  loading: boolean;
  caseNumber?: string;
  plaintiff?: string;
}

export default function Report({
  reports,
  user,
  loading,
  caseNumber,
  plaintiff,
}: ReportProps) {
  const [searchVal, setSearchVal] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const filteredSearchReports = useMemo(() => {
    if (!searchVal) return reports;
    return reports?.filter((report) => {
      return (
        report.nameOfDisease.toLowerCase().includes(searchVal.toLowerCase()) ||
        report.providerName.toLowerCase().includes(searchVal.toLowerCase()) ||
        report.icdCodes
          ?.map((code) => code.toLowerCase())
          .includes(searchVal.toLowerCase())
      );
    });
  }, [reports, searchVal]);

  const filteredTagReports = useMemo(() => {
    if (!selectedTag) return filteredSearchReports;
    return filteredSearchReports?.filter((report) => {
      return report.tags?.includes(selectedTag as TagsType);
    });
  }, [filteredSearchReports, selectedTag]);

  return (
    <Stack
      flex={1}
      bgcolor={NEUTRAL[0]}
      sx={{
        boxShadow: { xs: "none", sm: "0px 0px 10px rgba(5, 113, 112, 0.04)" },
        borderRadius: { xs: 0, sm: pxToRem(24) },
        overflowY: "scroll",
        // hide scroll bar
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <Stack
        sx={{
          position: "sticky",
          top: 0,
          background: NEUTRAL[0],
          zIndex: 100,
        }}
      >
        <TopNav />
        <ActionsTab
          // profilePicture={user?.profilePicture || ""}
          profilePicture={""}
          userName={plaintiff || ""}
          caseNumber={caseNumber || ""}
          handleSearch={(val: string) => setSearchVal(val)}
          handleTagSelect={(val) => setSelectedTag(val)}
        />
      </Stack>
      <ReportTable reportData={filteredTagReports} loading={loading} />
    </Stack>
  );
}
