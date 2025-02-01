import { IconContainer } from "@/components/IconContainer";
import { CaseDetail } from "@/interface";
import { NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { useReactiveVar } from "@apollo/client";
import {
  ClickAwayListener,
  IconButton,
  Portal,
  Stack,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MapViewEnum } from "../../../constants";
import { activeYearInViewVar, showTimelIneCalenderVar } from "../../../state";
import { NextIcon } from "../../svg/NextIcon";
import { PrevIcon } from "../../svg/PrevIcon";
import { TimelineAddIcon } from "../../svg/TimelineAddIcon";
import AppSlider from "./Slider";
import TimelineCalender from "./calender";
import useCalender from "./calender/useCalender";

const iconStyle = {
  width: "auto",
  height: "auto",
};

export function MapViewTimeLine({
  marks,
  hide,
  activeYearInViewParam,
  handleReloadPathWithParams,
}: {
  marks: any[];
  hide: boolean;
  activeYearInViewParam: number | null;
  handleReloadPathWithParams: (params: { [key: string]: any }) => void;
}) {
  const [sliderValue, setSliderValue] = useState(
    marks.length ? marks[0].value : 0
  );

  const handleNext = () => {
    if (sliderValue === marks[marks.length - 1].value) return;
    const currentIndex = marks.findIndex((mark) => mark.value === sliderValue);
    if (currentIndex < marks.length - 1) {
      setSliderValue(marks[currentIndex + 1].value);
    }
  };

  const handlePrevious = () => {
    if (sliderValue === marks[0].value) return;
    const currentIndex = marks.findIndex((mark) => mark.value === sliderValue);
    if (currentIndex > 0) {
      setSliderValue(marks[currentIndex - 1].value);
    }
  };

  const handleSliderChange = (event: any, value: any) => {
    setSliderValue(value);
  };

  const handleSelectViewAll = () => {
    if (activeYearInViewParam) {
      handleReloadPathWithParams({ activeYearInView: 0 });
    } else {
      if (marks.length) {
        handleReloadPathWithParams({ activeYearInView: marks[0].value });
      }
    }
  };

  useEffect(() => {
    handleReloadPathWithParams({ activeYearInView: sliderValue });
  }, [sliderValue]);

  useEffect(() => {
    if (activeYearInViewParam) {
      setSliderValue(activeYearInViewParam);
    }
  }, [activeYearInViewParam]);

  useEffect(() => {
    if (marks.length && !sliderValue) {
      setSliderValue(marks[0].value);
    }
  }, [marks]);

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      sx={{
        height: pxToRem(72),
        padding: pxToRem(16),
        borderTop: `1px solid rgba(241, 243, 243, 1)`,
        gap: pxToRem(8),
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          width: "93%",
          gap: pxToRem(8),
        }}
      >
        {!hide && (
          <Stack gap={pxToRem(4)} direction={"row"} alignItems={"center"}>
            <IconContainer sx={iconStyle} tooltip="" onClick={handlePrevious}>
              <PrevIcon size={pxToRem(19.2)} />
            </IconContainer>
            <Typography variant="subtitle2" color={SECONDARY[400]}>
              {marks[0].value}
            </Typography>
          </Stack>
        )}
        {!hide && (
          <Stack padding={pxToRem(8)} width={"100%"}>
            <AppSlider
              handleSliderChange={handleSliderChange}
              marks={marks}
              sliderValue={sliderValue}
            />
          </Stack>
        )}
        {!hide && (
          <Stack gap={pxToRem(4)} direction={"row"} alignItems={"center"}>
            <Typography variant="subtitle2" color={SECONDARY[400]}>
              {marks[marks.length - 1].value}
            </Typography>
            <IconContainer sx={iconStyle} tooltip="" onClick={handleNext}>
              <NextIcon size={pxToRem(19.2)} />
            </IconContainer>
          </Stack>
        )}
      </Stack>

      <Typography
        variant="subtitle1"
        color={SECONDARY[400]}
        className={activeYearInViewParam === 0 ? "active" : ""}
        sx={{
          cursor: "pointer",
          borderRadius: pxToRem(8),
          padding: `${pxToRem(8)} ${pxToRem(16)}`,
          "&:hover": {
            background: "rgba(240, 248, 248, 1)",
          },
          "&.active": {
            background: "rgba(240, 248, 248, 1)",
          },
        }}
        onClick={handleSelectViewAll}
      >
        View All
      </Typography>
    </Stack>
  );
}

export function DetailViewTimeLine({
  caseDetail,
  handleReloadPathWithParams,
}: {
  caseDetail: CaseDetail;
  handleReloadPathWithParams: (params: { [key: string]: any }) => void;
}) {
  const searchParams = useSearchParams();
  const reportIndexParm = searchParams.get("reportIndex");
  const reportIndex = reportIndexParm ? parseInt(reportIndexParm) : 0;

  function handlePrev() {
    if (reportIndex > 0) {
      handleReloadPathWithParams({
        reportIndex: reportIndex - 1,
        reportId: caseDetail.reports[reportIndex - 1]._id,
      });
    }
  }

  function handleNext() {
    if (reportIndex < caseDetail.reports.length - 1) {
      handleReloadPathWithParams({
        reportIndex: reportIndex + 1,
        reportId: caseDetail.reports[reportIndex + 1]._id,
      });
    }
  }

  useEffect(() => {
    if (reportIndex + 1 > caseDetail.reports.length && reportIndex) {
      handleReloadPathWithParams({ reportIndex: 0 });
    }
  }, [caseDetail]);

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={{
        width: "100%",
        height: pxToRem(72),
        padding: pxToRem(16),
        borderTop: `1px solid rgba(241, 243, 243, 1)`,
        postion: "sticky",
        bottom: 0,
      }}
    >
      {caseDetail.report?.dateOfClaim && (
        <Typography variant="subtitle2" color={SECONDARY[400]}>
          {/* 25 March, 2021 */}
          {format(new Date(caseDetail.report.dateOfClaim), "dd MMMM yyyy")}
        </Typography>
      )}

      <Stack gap={pxToRem(12)} direction={"row"} alignItems={"center"}>
        <IconButton onClick={handlePrev}>
          <PrevIcon size={pxToRem(19.2)} />
        </IconButton>
        <Typography variant="subtitle2" color={SECONDARY[400]}>
          {reportIndex + 1}/{caseDetail.reports.length}
        </Typography>
        <IconButton onClick={handleNext}>
          <NextIcon size={pxToRem(19.2)} />{" "}
        </IconButton>
      </Stack>
    </Stack>
  );
}

export default function TimeLineView({
  view,
  caseDetail,
}: {
  view: string;
  caseDetail: CaseDetail;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeYearInViewParam = searchParams.get("activeYearInView");
  const [marks, setMarks] = useState<{ value: number }[]>([]);
  const [selectedTimeline, setSelectedTimeline] = useState<Date[]>([]);

  const getReportYears = () => {
    const yearsSet = new Set(); // Using Set to avoid duplicates
    // console.log("getReportYears", caseDetail.reports);
    caseDetail.reports.forEach((report) => {
      if (report?.dateOfClaim) {
        const year = new Date(report.dateOfClaim).getFullYear();
        if (selectedTimeline.length) {
          if (
            year >= new Date(selectedTimeline[0]).getFullYear() &&
            year <= new Date(selectedTimeline[1]).getFullYear()
          ) {
            yearsSet.add(year); // Automatically handles duplicates
          }
        } else {
          yearsSet.add(year); // Automatically handles duplicates
        }
      }
    });

    // Convert the Set to an array, sort it, and then map to objects with `value` property
    const yearsArray = Array.from(yearsSet)
      .sort((a: any, b: any) => a - b) // Sorting in ascending order
      .map((year) => ({
        value: year,
      }));

    // console.log("yearsArray", yearsArray);
    setMarks(yearsArray as { value: number }[]);
  };

  const onDateRangeChange = (dateRange: Date[]) => {
    setSelectedTimeline(dateRange);
    showTimelIneCalenderVar(false);
    showTimelIneCalenderVar(false);
  };

  const handleReloadPathWithParams = (params: { [key: string]: any }) => {
    const searchParamsInner = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      searchParamsInner.set(key, value);
    });

    router.push(`${pathname}?${searchParamsInner.toString()}`);
  };

  useEffect(() => {
    getReportYears();
  }, [caseDetail, selectedTimeline]);

  useEffect(() => {
    // console.log("marks", marks);
  }, [marks]);

  return (
    <Stack
      justifyContent={"flex-end"}
      sx={{
        display: marks.length > 1 ? "flex" : "none",
        position: "relative",
        width: "100%",
        height: view == MapViewEnum.mapView ? pxToRem(100) : "auto",
        bgcolor: "transparent",
      }}
    >
      {view == MapViewEnum.mapView && (
        <MapViewTimeLine
          marks={marks}
          hide={!Boolean(marks.length > 0) || marks.length === 1}
          activeYearInViewParam={
            activeYearInViewParam ? +activeYearInViewParam : null
          }
          handleReloadPathWithParams={handleReloadPathWithParams}
        />
      )}
      {view == MapViewEnum.detailsView && (
        <DetailViewTimeLine
          caseDetail={caseDetail}
          handleReloadPathWithParams={handleReloadPathWithParams}
        />
      )}
      {view == MapViewEnum.mapView && (
        <TimelinePill
          onDateRangeChange={onDateRangeChange}
          selectedTimeline={selectedTimeline}
          minYear={marks.length ? marks[0].value : 0}
          maxYear={marks.length ? marks[marks.length - 1].value : 0}
        />
      )}
    </Stack>
  );
}

function TimelinePill({
  onDateRangeChange,
  selectedTimeline,
  minYear,
  maxYear,
}: {
  onDateRangeChange: (dateRange: Date[]) => void;
  selectedTimeline: Date[];
  minYear: number;
  maxYear: number;
}) {
  const {
    staticRanges,
    activateCustomRange,
    setActivateCustomRange,
    selectionRange,
    setSelectionRange,
    handleChange,
    handleCancel,
  } = useCalender({
    minYear,
    maxYear,
  });
  const showTimelIneCalender = useReactiveVar(showTimelIneCalenderVar);

  const formattedStartDate =
    selectedTimeline.length &&
    format(new Date(selectedTimeline[0]), "MMMM dd, yyyy");
  const formattedEndDate =
    selectedTimeline.length &&
    format(new Date(selectedTimeline[1]), "MMMM dd, yyyy");

  const handleClick = () => {
    showTimelIneCalenderVar(!showTimelIneCalender);
  };
  const handleClickAway = () => {
    showTimelIneCalenderVar(false);
  };
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Stack>
        <Stack
          onClick={handleClick}
          direction={"row"}
          alignItems={"center"}
          gap={pxToRem(4)}
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: pxToRem(7),
            border: `1px solid ${NEUTRAL[200]}`,
            borderRadius: pxToRem(20),
            py: pxToRem(8),
            px: pxToRem(16),
            bgcolor: NEUTRAL[0],
            zIndex: 0,
            "&:hover": {
              bgcolor: PRIMARY[25],
              border: `1px solid #DDE1E1`,
              cursor: "pointer",
            },
          }}
        >
          <Typography variant="body2" color={SECONDARY[400]}>
            {selectedTimeline.length
              ? `${formattedStartDate} - ${formattedEndDate}`
              : "Select Date Range"}
          </Typography>
          <TimelineAddIcon />
        </Stack>
        {showTimelIneCalender ? (
          <Portal>
            <TimelineCalender
              onDateRangeChange={onDateRangeChange}
              staticRanges={staticRanges}
              activateCustomRange={activateCustomRange}
              selectionRange={selectionRange}
              setSelectionRange={setSelectionRange}
              handleChange={handleChange}
              handleCancel={handleCancel}
            />
          </Portal>
        ) : null}
      </Stack>
    </ClickAwayListener>
  );
}
// CloseModalIcon
