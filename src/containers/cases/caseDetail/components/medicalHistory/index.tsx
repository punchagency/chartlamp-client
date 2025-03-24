import { CaseDetail, ReportsDetailWithBodyPart } from "@/interface";
import { NEUTRAL, pxToRem } from "@/theme";
import { useReactiveVar } from "@apollo/client/react/hooks";
import { Stack } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { MapViewEnum } from "../../constants";
import useTags from "../../hooks/useTags";
import { showFilterVar } from "../../state";
import TopNav from "../TopNav";
import ActionsTab from "../actionsTab";
import TimeLineView from "./TimeLineView";
import IcdCodeDescription from "./codeDescription";
import Details from "./details";
import Filter from "./filter";
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
  const showFilter = useReactiveVar(showFilterVar);

  const { tagsArray } = useTags();

  const {
    filteredReports,
    imageList,
    bodyParts,
    providers,
    totalAmountSpent,
    selectedCategory,
    listView,
    mappingByCategory,
    handleSelect,
    handleSearch,
    handleFilterByCategory,
  } = useMedicalHistory({
    caseDetail,
    isMapView: view === MapViewEnum.mapView,
  });

  const updatedCaseDetail = useMemo(() => {
    if (caseDetail) {
      return {
        ...caseDetail,
        ...(view === MapViewEnum.detailsView && { reports: filteredReports }),
        report: filteredReports?.[reportIndex] as ReportsDetailWithBodyPart,
      };
    }
    return null;
  }, [caseDetail, filteredReports, reportIndex, view]);

  useEffect(() => {
    if (
      reportId &&
      filteredReports &&
      filteredReports.length > 0 &&
      !reportIndexParm
    ) {
      const index = filteredReports.findIndex(
        (report) => report._id === reportId
      );
      if (index >= 0) {
        const searchParamsInner = new URLSearchParams(searchParams.toString());
        // searchParamsInner.delete("reportId");
        searchParamsInner.set("reportIndex", `${index}`);
        // console.log("searchParams", pathname, searchParamsInner);
        router.push(`${pathname}?${searchParamsInner.toString()}`);
      }
    }
  }, [
    reportId,
    filteredReports,
    searchParams,
    pathname,
    router,
    reportIndexParm,
  ]);

  const getView = useMemo(() => {
    switch (view) {
      case MapViewEnum.mapView:
        return (
          <IcdCodeDescription
            caseDetail={updatedCaseDetail}
            view={view}
            imageList={imageList}
            totalAmountSpent={totalAmountSpent}
            listView={listView}
            mappingByCategory={mappingByCategory}
            selectedCategory={selectedCategory}
            handleFilterByCategory={handleFilterByCategory}
            tagsArray={tagsArray}
          />
        );
      case MapViewEnum.detailsView:
        return (
          <Details
            caseDetail={updatedCaseDetail}
            view={view}
            tagsArray={tagsArray}
            imageList={imageList}
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
          profilePicture={""}
          userName={caseDetail?.plaintiff || ""}
          caseNumber={caseDetail?.caseNumber || ""}
          handleSearch={handleSearch}
          handleUpload={() => {
            // Add your handleUpload logic here
          }}
        />
        <Filter
          showFilter={showFilter}
          bodyParts={bodyParts}
          providers={providers}
          handleSelect={handleSelect}
          tags={tagsArray.slice(0, tagsArray.length - 1)}
          hideBodyPart={view === MapViewEnum.detailsView}
        />
      </Stack>
      <Stack flex={1}>
        <Stack flex={1}>
          {!loading &&
            caseDetail &&
            caseDetail?.reports.length > 0 &&
            caseDetail.cronStatus === "processed" &&
            getView}
        </Stack>
        {/* {(!Boolean(caseDetail?.reports.length) ||
          loading ||
          caseDetail?.cronStatus !== "processed") && (
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
                    progress={caseDetail?.percentageCompletion || 10}
                  />
                </Stack>
              </Stack>
            )}
          </Stack>
        )} */}
      </Stack>
      <Stack
        sx={{
          position: "sticky",
          bottom: 0,
          background: NEUTRAL[0],
          zIndex: 100,
        }}
      >
        {!loading &&
          caseDetail &&
          caseDetail?.reports.length > 0 &&
          caseDetail.cronStatus === "processed" &&
          updatedCaseDetail && (
            <TimeLineView view={view} caseDetail={updatedCaseDetail} />
          )}
      </Stack>
    </Stack>
  );
}
