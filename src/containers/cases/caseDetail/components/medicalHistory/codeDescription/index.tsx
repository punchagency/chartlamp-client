import AnatomyView from "@/components/AnatomyView";
import { CaseDetail, ImageTypeTwo, OptionsType } from "@/interface";
import { SECONDARY, pxToRem } from "@/theme";
import CloseIcon from "@mui/icons-material/Close";
import { Collapse, IconButton, Stack, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { CaseDetailEnum, MapViewEnum } from "../../../constants";
import DiseaseClassificationListView from "./components/DiseaseClassificationListView";
import useMapView from "./hook";
import image from "@/components/image";

const SECONDARY400 = "rgba(53, 81, 81, 1)";

interface MapViewProps {
  caseDetail: CaseDetail | null; // Replace 'any' with the actual type of 'caseData'
  view: string;
  imageList: any;
  totalAmountSpent: string;
  listView: any;
  selectedCategory: string;
  handleFilterByCategory: any;
  mappingByCategory: { [key: string]: ImageTypeTwo[] };
  tagsArray: OptionsType[] | [];
}

function BodyPartGroupItem({ name }: { name: string }) {
  return (
    <Stack
      sx={{
        padding: pxToRem(16),
        borderRadius: pxToRem(16),
        bgcolor: "rgba(240, 248, 248, 1)",
        cursor: "pointer",
      }}
    >
      <Typography
        fontSize={pxToRem(20)}
        variant={"h5"}
        color={`rgba(69, 72, 73, 1)`}
      >
        {name}
      </Typography>
    </Stack>
  );
}

export default function IcdCodeDescription({
  caseDetail,
  view,
  selectedCategory,
  handleFilterByCategory,
  imageList,
  totalAmountSpent,
  listView,
  mappingByCategory,
  tagsArray,
}: MapViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeYearInViewParam = searchParams.get("activeYearInView");
  const [checked, setChecked] = useState(false);
  const {
    caseId,
    selectedTag,
    loading,
    caseDcTags,
    handleTagIcdCode,
    setSelectedTag,
    handleCancel,
    handleAddCaseTag,
    handleUpdateMultipleCaseDcTags,
  } = useMapView();

  const getDetailRoute = useCallback(
    (part: ImageTypeTwo) => {
      if (!caseDetail) return "";
      return `/dashboard/case/${caseDetail._id}/${CaseDetailEnum.medicalHistory}?view=${MapViewEnum.detailsView}&reportId=${part.reportId}&partId=${part._id}&icd-code=${part.icdCode}&activeYearInView=${activeYearInViewParam}`;
    },
    [caseDetail, activeYearInViewParam]
  );

  return (
    <Stack flex={1}>
      {caseDetail && caseDetail.reports && caseDetail.reports.length > 0 && (
        <>
          <Stack
            sx={{
              alignItems: "center",
              justifyContent: "center",
              // height: "calc(100vh - 112px - 200px)",
              flex: 1,
              position: "relative",
              // pt: pxToRem(41),
              // background: "red",
            }}
          >
            <Stack
              sx={{
                width: pxToRem(282),
                border: "1px solid rgba(221, 225, 225, 1)",
                borderTop: "none",
                borderBottomLeftRadius: pxToRem(16),
                borderBottomRightRadius: pxToRem(16),
                position: "absolute",
                top: 0,
                left: pxToRem(16),
                zIndex: 1,
                bgcolor: "white",
                display: "none",
              }}
            >
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                sx={{
                  padding: pxToRem(16),
                  width: "100%",
                  borderBottom: `1px solid rgba(221, 225, 225, 1)`,
                }}
              >
                <Typography variant={"h5"} color={`rgba(69, 72, 73, 1)`}>
                  Total Amount
                </Typography>
                <Typography
                  variant={"subtitle1"}
                  color={`rgba(23, 26, 28, 1)`}
                  onClick={() => setChecked(!checked)}
                  sx={{ cursor: "pointer" }}
                >
                  {checked ? "Hide" : "View"}
                </Typography>
              </Stack>
              <Collapse in={checked}>
                <Stack
                  sx={{
                    padding: pxToRem(16),
                    gap: pxToRem(12),
                    maxHeight: pxToRem(300),
                    overflowY: "auto",
                    // hide scrollbar
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  {listView.map((item: any, index: number) => (
                    <>
                      <Stack
                        direction="row"
                        alignItems={"center"}
                        justifyContent={"space-between"}
                        key={index}
                      >
                        <Typography
                          onClick={() =>
                            router.push(
                              `/dashboard/case/${caseDetail._id}/${CaseDetailEnum.medicalHistory}?view=${MapViewEnum.detailsView}&reportId=${item.reportId}&activeYearInView=${activeYearInViewParam}`
                            )
                          }
                          variant={"body1"}
                          color={`${SECONDARY400}`}
                          sx={{
                            maxWidth: pxToRem(170),
                            // ellipsis on overflow
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            ":hover": {
                              color: SECONDARY[500],
                              fontWeight: 600,
                              cursor: "pointer",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {item.nameOfDisease}
                        </Typography>
                        <Typography
                          variant={"body1"}
                          color={`${SECONDARY400}`}
                          sx={{
                            maxWidth: pxToRem(150),
                            // ellipsis on overflow
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            ":hover": {
                              color: SECONDARY[500],
                              fontWeight: 600,
                              cursor: "pointer",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {item.amountSpent.includes("not") ||
                          item.amountSpent.includes("Not")
                            ? "N/A"
                            : `${item.amountSpent}`}
                        </Typography>
                      </Stack>
                    </>
                  ))}
                </Stack>
              </Collapse>
              <Stack
                sx={{
                  py: pxToRem(8),
                  px: pxToRem(12),
                  bgcolor: "rgba(240, 248, 248, 1)",
                  borderBottomLeftRadius: pxToRem(16),
                  borderBottomRightRadius: pxToRem(16),
                }}
              >
                <Typography
                  variant={"h2"}
                  color={`${SECONDARY[500]}`}
                  fontSize={pxToRem(32)}
                >
                  ${totalAmountSpent}
                </Typography>
              </Stack>
            </Stack>

            <Stack
              sx={{
                display: "none",
                width: pxToRem(282),
                border: "1px solid rgba(221, 225, 225, 1)",
                borderTop: "none",
                borderBottomLeftRadius: pxToRem(16),
                borderBottomRightRadius: pxToRem(16),
                maxHeight: "calc(100vh - 60%)",
                overflowY: "auto",
                scrollbarWidth: "thin",
                position: "absolute",
                top: 0,
                right: pxToRem(16),
                zIndex: 1,
                bgcolor: "white",
                p: pxToRem(16),
                gap: pxToRem(12),
                // display: "none",
              }}
            >
              <Typography
                variant={"h3"}
                sx={{
                  maxWidth: "600px",
                }}
              >
                {/* {`Affected Body Parts`} */}
              </Typography>
              <Stack gap={2}>
                {Object.entries(mappingByCategory).map(([key, value]) => (
                  <Stack
                    key={key}
                    gap={1}
                    sx={{
                      display: value && value.length > 0 ? "flex" : "none",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          maxWidth: "600px",
                          textTransform: "capitalize",
                          cursor: "pointer",
                          textDecoration: "underline",
                          color: selectedCategory === key ? "#08BDBA" : "",
                        }}
                        onClick={() => handleFilterByCategory(key)}
                      >
                        {key}
                      </Typography>

                      <IconButton
                        onClick={() => handleFilterByCategory("")}
                        sx={{
                          visibility:
                            selectedCategory === key ? "visible" : "hidden",
                        }}
                      >
                        <CloseIcon sx={{ fontSize: "20px" }} />
                      </IconButton>
                    </Stack>
                    <Stack gap={2} ml={4}>
                      {value.map((part: ImageTypeTwo, index: number) => (
                        <Typography
                          key={index}
                          variant="subtitle1"
                          sx={{
                            maxWidth: "600px",
                            cursor: "pointer",
                            textTransform: "capitalize",
                          }}
                          onClick={() =>
                            router.push(
                              `/dashboard/case/${caseDetail._id}/${CaseDetailEnum.medicalHistory}?view=${MapViewEnum.detailsView}&reportId=${part.reportId}&partId=${part._id}&icd-code=${part.icdCode}&activeYearInView=${activeYearInViewParam}`
                            )
                          }
                        >
                          {part.icdCode}-{part.fileName}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>

            <DiseaseClassificationListView
              tagsArray={tagsArray.slice(0, tagsArray.length - 1)}
              mappingByCategory={mappingByCategory}
              selectedTag={selectedTag}
              loading={loading}
              caseDcTags={caseDcTags}
              handleTagIcdCode={handleTagIcdCode}
              setSelectedTag={setSelectedTag}
              handleCancel={handleCancel}
              handleAddCaseTag={handleAddCaseTag}
              handleUpdateMultipleCaseDcTags={handleUpdateMultipleCaseDcTags}
              handleIcdCodeClick={(part: ImageTypeTwo) =>
                router.push(
                  `/dashboard/case/${caseDetail._id}/${CaseDetailEnum.medicalHistory}?view=${MapViewEnum.detailsView}&reportId=${part.reportId}&partId=${part._id}&icd-code=${part.icdCode}&activeYearInView=${activeYearInViewParam}`
                )
              }
              handleFilterByCategory={handleFilterByCategory}
              caseId={caseId}
              selectedCategory={selectedCategory}
            />

            <Stack
              justifyContent="center"
              sx={{
                // height: "calc(100vh - 260px)",
                flex: 1,
                width: "100%",
                // py: pxToRem(40),
              }}
            >
              <AnatomyView
                images={imageList}
                caseId={caseDetail._id}
                mappingByCategory={mappingByCategory}
                handleFilterByCategory={handleFilterByCategory}
                selectedCategory={selectedCategory}
                // onPartSelect={(path: string) => router.push(path)}
                onPartSelect={(image: ImageTypeTwo) => router.push(getDetailRoute(image))}
              />
              {/* <TimeLineView view={view} caseDetail={caseDetail} /> */}
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
}
