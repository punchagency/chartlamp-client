import {
  CaseDetailEnum,
  MapViewEnum,
} from "@/containers/cases/caseDetail/constants";
import { ImageTypeTwo } from "@/interface";
import { PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Box, Stack, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";

export default function ImageSelectorPopup({
  caseId,
  mappingByCategory,
  selectedCategory,
  handleFilterByCategory,
  handleClickAway,
  onPartSelect,
}: {
  caseId: string;
  mappingByCategory: Record<string, ImageTypeTwo[]>;
  handleFilterByCategory: (category: string) => void;
  selectedCategory: string;
  handleClickAway: () => void;
  onPartSelect: (path: string) => void;
}) {
  const searchParams = useSearchParams();
  const activeYearInViewParam = searchParams.get("activeYearInView");

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Stack
        sx={{
          borderBottomLeftRadius: pxToRem(16),
          borderBottomRightRadius: pxToRem(16),
          overflowY: "auto",
          scrollbarWidth: "thin",
          bgcolor: "white",
          p: pxToRem(16),
          gap: pxToRem(12),
          zIndex: 10,
        }}
      >
        <Stack>
          {Object.values(mappingByCategory).map((value, index) => {
            const imageList = new Set(
              value.map((part) => part.fileName.toLowerCase())
            );
            const filteredImageParts = value.filter((part) =>
              imageList.has(part.fileName.toLowerCase())
            );
            return (
              <Stack key={index}>
                {filteredImageParts.map((part: ImageTypeTwo, index: number) => (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      padding: `${pxToRem(8)} ${pxToRem(16)}`,
                      cursor: "pointer",
                      ":hover": {
                        background: PRIMARY[25],
                        borderRadius: pxToRem(10),
                        color: SECONDARY[400],
                      },
                    }}
                    key={index}
                  >
                    <Typography
                      key={index}
                      variant="subtitle1"
                      sx={{
                        textTransform: "capitalize",
                        height: pxToRem(32),
                        borderRadius: pxToRem(10),
                        color: SECONDARY[300],
                      }}
                      onClick={() =>
                        onPartSelect(
                          `/dashboard/case/${caseId}/${CaseDetailEnum.medicalHistory}?view=${MapViewEnum.detailsView}&reportId=${part.reportId}&partId=${part._id}&activeYearInView=${activeYearInViewParam}`
                        )
                      }
                    >
                      {/* {part.icdCode}-{part.fileName} */}
                      {part.fileName}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </ClickAwayListener>
  );
}
