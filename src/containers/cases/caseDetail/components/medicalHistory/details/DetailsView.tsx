import { BackIcon } from "@/containers/cases/components/svgs/BackIcon";
import { refetchCaseDetailsWithoutLoadingVar } from "@/containers/cases/state";
import { CaseDetail, NameOfDiseaseByIcdCode, TagsType } from "@/interface";
import { customTagModalVar } from "@/state/modal";
import { NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { IconButton, Stack, Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CaseDetailEnum, MapViewEnum } from "../../../constants";
import DiseaseTag from "../../DiseaseTags";
import { QuestMarkIcon } from "../../svg/QuestMarkIcon";
import { tagsFilter } from "../constants";
import BottomTab from "./BottomTab";
import { useCaseDetailsView } from "./hook";

interface MapViewProps {
  caseDetail: CaseDetail; // Replace 'any' with the actual type of 'caseData'
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

export default function DetailsView({ caseDetail }: MapViewProps) {
  const router = useRouter();
  const {
    loading,
    caseTags,
    activeYearInViewParam,
    partIdParam,
    icdCodeParam,
    reportIndex,
    getCaseTags,
    getStreamlinedDiseaseName,
    updateReportDetails,
  } = useCaseDetailsView();
  const [diseaseName, setDiseaseName] = useState("");

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

  const tagsArray = useMemo(() => {
    if (!caseTags) return [];
    const labelValue = caseTags.map((tag) => {
      return {
        label: tag.tagName,
        value: tag._id.toString() as any,
      };
    });
    return tagsFilter.slice(0, 2).concat(labelValue).concat(tagsFilter[2]);
  }, [caseDetail, caseTags]);

  const handlePartFilter = useCallback(async () => {
    const defaultDiseaseName = caseDetail?.report?.nameOfDisease;
    try {
      if (!defaultDiseaseName) return;
      setDiseaseName(defaultDiseaseName);
      // if (!partIdParam) return;
      if (!Boolean(defaultDiseaseName.split(",").length > 1)) return;
      const diseaseClass = caseDetail?.report.classification.find((item) => {
        if (partIdParam) {
          if (!item.images) return false;
          const selectedImage = item.images.find(
            (imgItem) => imgItem._id === partIdParam
          );
          if (selectedImage) return true;
        }
        if (icdCodeParam) {
          if (item.icdCode === icdCodeParam) return true;
        }
        return false;
      });
      if (!diseaseClass) return;

      const selectedIcdCode = diseaseClass.icdCode;
      let nameOfDiseaseByIcdCode = caseDetail?.report?.nameOfDiseaseByIcdCode;
      console.log("nameOfDiseaseByIcdCode", nameOfDiseaseByIcdCode);
      if (nameOfDiseaseByIcdCode) {
        const name = getName(selectedIcdCode, nameOfDiseaseByIcdCode);
        if (name) return;
      }
      const partIcdCodes = caseDetail?.report.classification.map(
        (item) => item.icdCode
      );
      nameOfDiseaseByIcdCode = await getStreamlinedDiseaseName({
        icdCodes: partIcdCodes,
        diseaseNames: defaultDiseaseName,
        caseId: caseDetail._id,
        reportId: caseDetail?.report._id,
      });
      if (nameOfDiseaseByIcdCode) {
        getName(selectedIcdCode, nameOfDiseaseByIcdCode);
        // refetchCaseDetailsWithoutLoadingVar(true);
      } else setDiseaseName(defaultDiseaseName);
    } catch {
      setDiseaseName(defaultDiseaseName);
    }
  }, [caseDetail, partIdParam]);

  useEffect(() => {
    handlePartFilter();
  }, [partIdParam, caseDetail]);

  useEffect(() => {
    (async () => {
      await getCaseTags({
        caseId: caseDetail._id,
      });
    })();
  }, [caseDetail]);

  const getName = (
    selectedIcdCode: string,
    nameOfDiseaseByIcdCode: NameOfDiseaseByIcdCode[]
  ) => {
    const selectedDisease = nameOfDiseaseByIcdCode.find(
      (item) => item.icdCode == selectedIcdCode
    );
    if (selectedDisease) {
      setDiseaseName(selectedDisease?.nameOfDisease);
      return selectedDisease?.nameOfDisease;
    } else return null;
  };

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
        >
          <BackIcon />
          <Typography
            variant="subtitle2"
            color={SECONDARY[300]}
            onClick={() =>
              router.push(
                activeYearInViewParam
                  ? `/dashboard/case/${caseDetail._id}/${CaseDetailEnum.medicalHistory}?view=${MapViewEnum.mapView}&activeYearInView=${activeYearInViewParam}`
                  : `/dashboard/case/${caseDetail._id}/${CaseDetailEnum.medicalHistory}?view=${MapViewEnum.mapView}`
              )
            }
          >
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
          <Typography
            variant="h1"
            fontSize={pxToRem(48)}
            color={SECONDARY[500]}
          >
            {diseaseName || caseDetail?.report?.nameOfDisease}
          </Typography>
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
              {tagsArray.map((tag, index) => (
                <DiseaseTag
                  tag={tag}
                  key={index}
                  reportIndex={reportIndex}
                  handleTagSelect={(isRemove: boolean) => {
                    if (tag.value === TagsType.CUSTOM_TAG) {
                      customTagModalVar(true);
                    } else {
                      updateReportDetails({
                        caseId: caseDetail._id,
                        reportId: caseDetail.report._id,
                        data: { tags: [tag.value], isRemove },
                      });
                    }
                  }}
                  savedTags={caseDetail?.report?.tags}
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
