import { ReportsDetail, ReportsDetailWithBodyPart, TagsType, UserDetail } from "@/interface";
import { NEUTRAL, pxToRem } from "@/theme";
import { Stack } from "@mui/material";
import { useMemo, useState } from "react";
import useTags from "../../hooks/useTags";
import TopNav from "../TopNav";
import ActionsTab from "../actionsTab";
import ReportTable from "./table";
import useReport from "./hook/useReport";

interface ReportProps {
  reports: ReportsDetailWithBodyPart[] | undefined;
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
  const { tagsArray } = useTags();
  const { filteredReports, handleSelect } = useReport({
    reports: reports || [],
  });


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
          handleSearch={(val: string) => handleSelect("searchVal", val)}
          handleTagSelect={(val) => handleSelect("tag", val)}
          tagsArray={tagsArray}
        />
      </Stack>
      <ReportTable reportData={filteredReports} loading={loading} />
    </Stack>
  );
}
