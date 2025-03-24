import { BackIcon } from "@/containers/cases/components/svgs/BackIcon";
import {
  CaseDetail,
  NameOfDiseaseByIcdCode,
  OptionsType,
  TagsType,
} from "@/interface";
import { customTagModalVar } from "@/state/modal";
import { NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { IconButton, Stack, Typography } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { CaseDetailEnum, MapViewEnum } from "../../../constants";
import DiseaseTag from "../../DiseaseTags";
import { QuestMarkIcon } from "../../svg/QuestMarkIcon";
import BottomTab from "./BottomTab";
import { useCaseDetailsView } from "./hook";

interface MapViewProps {
  caseDetail: CaseDetail;
  tagsArray: OptionsType[] | [];
}

const CustomToolTip = () => {
  return (
    <Stack>
      <Typography variant="subtitle2" color={"rgba(255, 255, 255, 1)"}>
        Adding Tags
      </Typography>
      <Typography variant="subtitle2" color={"rgba(255, 255, 255, 1)"}>
        Tooltips are used to describe or identify an element. In most scenarios,
        tooltips help the user understand the meaning, function or alt-text of
        an element.
      </Typography>
    </Stack>
  );
};

export default function DetailsView({ caseDetail, tagsArray }: MapViewProps) {
  const router = useRouter();
  const {
    loading,
    dcTags,
    caseIdParam,
    reportIdParam,
    refetchTags,
    caseTags,
    activeYearInViewParam,
    partIdParam,
    icdCodeParam,
    reportIndex,
    getCaseTags,
    getStreamlinedDiseaseName,
    updateReportDetails,
    getDcTagMapping,
  } = useCaseDetailsView();
  const [diseaseName, setDiseaseName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClassified, setIsClassified] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const sourceFile = useMemo(() => {
    if (caseDetail?.report?.document) {
      return caseDetail?.documents.find(
        (doc) => doc._id === caseDetail?.report?.document
      );
    }
  }, [caseDetail]);

  const preferredClassification = useMemo(() => {
    const reportClassifications = caseDetail?.report?.classification;
    const preferredClassification = reportClassifications.find(
      (item) =>
        item.images.find((img) => img._id === partIdParam) ||
        item.icdCode === icdCodeParam
    );
    return preferredClassification;
  }, [caseDetail, partIdParam, icdCodeParam]);

  const handlePartFilter = async () => {
    const report = caseDetail?.report;
    if (!report) return;

    const defaultDiseaseName = report.nameOfDisease;
    if (!defaultDiseaseName) return;

    setDiseaseName(defaultDiseaseName);

    // If there’s only one disease, no need to filter further.
    const hasMultipleDiseases = defaultDiseaseName.split(",").length > 1;
    if (!hasMultipleDiseases) return;

    const classification = report.classification || [];

    // Helper to find the relevant disease classification
    const findDiseaseClass = () => {
      return classification.find((item) => {
        if (partIdParam) {
          const selectedImage = item.images?.find(
            (img) => img._id === partIdParam
          );
          if (selectedImage) return true;
        }
        if (icdCodeParam && item.icdCode === icdCodeParam) {
          return true;
        }
        return false;
      });
    };

    const diseaseClass = findDiseaseClass();
    if (!diseaseClass) return;

     const selectedIcdCode = diseaseClass.icdCode;

    // Check if disease name is already mapped by ICD code
    const existingName = getName(
      selectedIcdCode,
      report.nameOfDiseaseByIcdCode || []
    );
    if (existingName) {
      setDiseaseName(existingName);
      setIsClassified(true);
      return;
    }

    // Collect other part ICD codes (excluding current one)
    const otherPartIcdCodes = classification
      .filter((item) => item.icdCode !== icdCodeParam)
      .map((item) => item.icdCode);

    try {
      if (isLoading) return;
      setIsLoading(true);
      const result = await getStreamlinedDiseaseName({
        icdCodes: [icdCodeParam as string],
        // icdCodes: [icdCodeParam as string, ...otherPartIcdCodes],
        diseaseNames: defaultDiseaseName,
        caseId: caseDetail._id,
        reportId: report._id,
      });
      setIsLoading(false);

      if (result?.length) {
        const newName = getName(selectedIcdCode, result);
        if (newName) {
          setDiseaseName(newName);
          setIsClassified(true);
          return;
        }
      }

      // Fallback to default name if no classification found
      setDiseaseName(defaultDiseaseName);
    } catch (error) {
      setDiseaseName(defaultDiseaseName);
    }
  };

  useEffect(() => {
    if (icdCodeParam && caseDetail) {
      handlePartFilter();
    }
  }, [icdCodeParam, partIdParam, caseDetail]);

  useEffect(() => {
    if (
      caseIdParam &&
      reportIdParam &&
      refetchTags &&
      preferredClassification
    ) {
      getDcTagMapping({
        dc: preferredClassification?._id,
        icdCode: preferredClassification.icdCode,
        reportId: reportIdParam,
        caseId: caseIdParam as string,
      });
    }
  }, [caseIdParam, reportIdParam, refetchTags, preferredClassification]);

  const getName = (
    selectedIcdCode: string,
    nameOfDiseaseByIcdCode: NameOfDiseaseByIcdCode[]
  ) => {
    const selectedDisease = nameOfDiseaseByIcdCode.find((item) => {
      if (item.icdCode == selectedIcdCode) return true;
      const initialCode = icdCodeParam && icdCodeParam.split(".")[0];
      if (initialCode && item.icdCode.includes(initialCode)) return true;
      return false;
    });
    if (selectedDisease) {
      setDiseaseName(selectedDisease?.nameOfDisease);
      return selectedDisease?.nameOfDisease;
    } else return null;
  };

  //@ts-ignore
  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - containerRef.current.offsetLeft);
      setScrollLeft(containerRef.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1; // The multiplier adjusts the scroll speed.
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <Stack
      sx={{
        borderRight: `1px solid ${NEUTRAL[900]}`,
        borderLeft: `1px solid ${NEUTRAL[900]}`,
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          px: pxToRem(16),
          py: pxToRem(24),
          pb: pxToRem(8),
          maxHeight: { sm: pxToRem(86) },
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={pxToRem(4)}
          sx={{ cursor: "pointer" }}
          onClick={() =>
            router.push(
              activeYearInViewParam
                ? `/dashboard/case/${caseDetail._id}/${CaseDetailEnum.medicalHistory}?view=${MapViewEnum.mapView}&activeYearInView=${activeYearInViewParam}`
                : `/dashboard/case/${caseDetail._id}/${CaseDetailEnum.medicalHistory}?view=${MapViewEnum.mapView}`
            )
          }
        >
          <BackIcon />
          <Typography variant="subtitle2" color={SECONDARY[300]}>
            Go back to map view
          </Typography>
        </Stack>
        {/* <IconContainer tooltip="Share" onClick={() => ""}>
          <ShareIcon />
        </IconContainer> */}
      </Stack>
      <Stack sx={{}}>
        <Stack
          sx={{
            px: pxToRem(16),
            py: pxToRem(8),
          }}
        >
          {isClassified ? (
            <Typography
              variant="h1"
              fontSize={pxToRem(48)}
              color={SECONDARY[500]}
            >
              {diseaseName || caseDetail?.report?.nameOfDisease}
            </Typography>
          ) : (
            <Stack>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Stack>
          )}
        </Stack>
        <Stack
          sx={{
            px: pxToRem(16),
            py: pxToRem(8),
            gap: pxToRem(8),
          }}
        >
          <Stack gap={pxToRem(8)}>
            <Typography variant="subtitle2" color={SECONDARY[300]}>
              Amount Spent
            </Typography>
            <Typography
              variant="h3"
              fontSize={pxToRem(23)}
              color={SECONDARY[400]}
            >
              {/* $3,300 */}
              {caseDetail?.report?.amountSpent}
            </Typography>
          </Stack>
          <Stack gap={pxToRem(16)}>
            <Stack direction={"row"} alignItems={"center"}>
              <Typography variant="subtitle2" color={SECONDARY[300]}>
                Tags
              </Typography>
              <Tooltip title={<CustomToolTip />} placement="right" arrow>
                <IconButton>
                  <QuestMarkIcon />
                </IconButton>
              </Tooltip>
            </Stack>
            <Stack
              ref={containerRef}
              direction={"row"}
              alignItems={"center"}
              gap={pxToRem(16)}
              // flexWrap={"wrap"}
              sx={{
                py: pxToRem(8),
                maxWidth: "50vw",
                overflowX: "scroll",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                "&::-webkit-scrollbar-thumb": {
                  display: "none",
                },
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none", // Prevents text selection while dragging
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
            >
              {Boolean(tagsArray.length) &&
                tagsArray.map((tag, index) => (
                  <DiseaseTag
                    tag={tag}
                    key={index}
                    reportIndex={reportIndex}
                    handleTagSelect={(isRemove: boolean) => {
                      if (tag.value === TagsType.CUSTOM_TAG) {
                        customTagModalVar(true);
                      } else {
                        if (preferredClassification) {
                          updateReportDetails({
                            caseId: caseDetail._id,
                            reportId: reportIdParam as string,
                            data: {
                              caseTagId: tag.value,
                              dc: preferredClassification?._id ?? null,
                              icdCode: !preferredClassification?._id
                                ? icdCodeParam
                                : null,
                              isRemove,
                            },
                          });
                        } else {
                          console.log("No preferred classification found");
                        }
                      }
                    }}
                    savedTags={dcTags}
                  />
                ))}
            </Stack>
          </Stack>
        </Stack>
        <BottomTab
          report={caseDetail.report}
          caseId={caseDetail._id}
          sourceFile={sourceFile}
          reportIndex={reportIndex}
        />
      </Stack>
    </Stack>
  );
}
