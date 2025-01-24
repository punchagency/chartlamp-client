import LinearWithValueLabel from "@/components/LinearProgressWithLabel";
import { CaseDetail, ReportsDetailWithBodyPart } from "@/interface";
import { NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { CronStatus } from "@/types/case";
import { Stack, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { MapViewEnum } from "../../constants";
import TopNav from "../TopNav";
import ActionsTab from "../actionsTab";
import IcdCodeDescription from "./codeDescription";
import Details from "./details";
import useMedicalHistory from "./hooks/useMedicalHistory";

interface MapViewProps {
  caseDetail: CaseDetail | null;
  loading: boolean;
}

const PROCESSED = "processed";

export default function MapView({ caseDetail, loading }: MapViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // const reportIndex = useReactiveVar(reportIndexVar);
  const view = searchParams.get("view") ?? MapViewEnum.mapView;
  const reportId = searchParams.get("reportId");
  const reportIndexParm = searchParams.get("reportIndex");
  const reportIndex = reportIndexParm ? parseInt(reportIndexParm) : 0;

  const {
    filteredReports,
    imageList,
    bodyParts,
    providers,
    totalAmountSpent,
    selectedCategory,
    listView,
    tagsArray,
    mappingByCategory,
    handleSelect,
    handleSearch,
    handleFilterByCategory,
  } = useMedicalHistory({
    caseDetail,
    isMapView: view === MapViewEnum.mapView,
  });

  useEffect(() => {
    if (reportId && filteredReports && filteredReports.length > 0) {
      const index = filteredReports.findIndex(
        (report) => report._id === reportId
      );
      if (index >= 0) {
        const searchParamsInner = new URLSearchParams(searchParams.toString());
        searchParamsInner.delete("reportId");
        searchParamsInner.set("reportIndex", `${index}`);
        console.log("searchParams", pathname, searchParamsInner);
        router.push(`${pathname}?${searchParamsInner.toString()}`);
      }
    }
  }, [reportId, filteredReports, searchParams, pathname, router]);

  const getView = useMemo(() => {
    switch (view) {
      case MapViewEnum.mapView:
        return (
          <IcdCodeDescription
            caseDetail={
              caseDetail
                ? {
                    ...caseDetail,
                    report: filteredReports?.[
                      reportIndex
                    ] as ReportsDetailWithBodyPart,
                  }
                : null
            }
            view={view}
            imageList={imageList}
            tagsArray={tagsArray}
            bodyParts={bodyParts}
            providers={providers}
            totalAmountSpent={totalAmountSpent}
            listView={listView}
            handleSelect={handleSelect}
            mappingByCategory={mappingByCategory}
            selectedCategory={selectedCategory}
            handleFilterByCategory={handleFilterByCategory}
          />
        );
      case MapViewEnum.detailsView:
        return (
          <Details
            caseDetail={
              caseDetail
                ? {
                    ...caseDetail,
                    reports: filteredReports,
                    report: filteredReports?.[
                      reportIndex
                    ] as ReportsDetailWithBodyPart,
                  }
                : null
            }
            view={view}
            tagsArray={tagsArray}
            imageList={imageList}
            bodyParts={bodyParts}
            providers={providers}
            handleSelect={handleSelect}
            mappingByCategory={mappingByCategory}
            selectedCategory={selectedCategory}
            handleFilterByCategory={handleFilterByCategory}
          />
        );
      default:
        return null;
    }
  }, [
    view,
    caseDetail,
    filteredReports,
    reportIndex,
    imageList,
    bodyParts,
    providers,
    totalAmountSpent,
    listView,
    handleSelect,
  ]);

  return (
    <Stack
      flex={1}
      bgcolor={NEUTRAL[0]}
      sx={{
        boxShadow: { xs: "none", sm: "0px 0px 10px rgba(5, 113, 112, 0.04)" },
        borderRadius: { xs: 0, sm: pxToRem(24) },
      }}
    >
      <TopNav />
      <ActionsTab
        // profilePicture={caseDetail?.user?.profilePicture || ""}
        profilePicture={""}
        userName={caseDetail?.plaintiff || ""}
        caseNumber={caseDetail?.caseNumber || ""}
        handleSearch={handleSearch}
        handleUpload={() => {
          // Add your handleUpload logic here
        }}
      />
      <Stack>
        <Stack>
          {!loading && caseDetail && caseDetail?.reports.length > 0 && getView}
        </Stack>
        {(!Boolean(caseDetail?.reports.length) || loading) && (
          <Stack
            sx={{
              width: "100%",
              height: "100%",
              minHeight: "70vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loading ? (
              <Stack>
                <Typography variant="h6" color={SECONDARY[400]}>
                  Loading...
                </Typography>
              </Stack>
            ) : caseDetail?.cronStatus === CronStatus.Processed ? (
              <Stack>
                <Typography variant="h6" color={SECONDARY[400]}>
                  No data available
                </Typography>
              </Stack>
            ) : (
              <Stack>
                <Stack>
                  <Typography variant="h6" color={SECONDARY[400]}>
                    {`Your case is ${
                      caseDetail?.cronStatus || "processing"
                    }. Please check back later`}
                  </Typography>
                  <LinearWithValueLabel
                    status={caseDetail?.cronStatus as CronStatus}
                  />
                </Stack>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
