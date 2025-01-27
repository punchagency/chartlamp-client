import { DocumentDetail, ReportsDetail } from "@/interface";
import { SECONDARY, pxToRem } from "@/theme";
import { getFileName } from "@/utils/general";
import { Stack, Typography } from "@mui/material";
import { PdfIcon } from "../../../svg/PdfIcon";
import axios from "axios";
import DocumentModal from "../../../maintenance/grid/DocumentModal";
import AppDialog from "@/components/DailogBox";
import { useState } from "react";

export default function MedicalTab({
  report,
  sourceFile,
}: {
  report: ReportsDetail;
  sourceFile: DocumentDetail | undefined;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Stack
      sx={{
        px: pxToRem(16),
        pt: pxToRem(24),
        pb: pxToRem(24),
        gap: pxToRem(32),
      }}
    >
      <Stack gap={pxToRem(8)}>
        <Typography variant="h5" color={SECONDARY[500]}>
          Provider:
        </Typography>

        <Typography variant="body1" color={SECONDARY[400]}>
          {report.providerName}
        </Typography>
      </Stack>
      <Stack gap={pxToRem(8)}>
        <Typography variant="h5" color={SECONDARY[500]}>
          Doctor:
        </Typography>

        <Typography variant="body1" color={SECONDARY[400]}>
          {report.doctorName}
        </Typography>
      </Stack>
      <Stack gap={pxToRem(8)}>
        <Typography variant="h5" color={SECONDARY[500]}>
          Source File
        </Typography>
        {sourceFile && (
          <Stack
            gap={pxToRem(16)}
            direction={"row"}
            alignItems={"center"}
            onClick={() => setOpen(true)}
            sx={{ cursor: "pointer" }}
          >
            <PdfIcon />
            <Stack gap={pxToRem(4)}>
              <Typography variant="h5" color={SECONDARY[400]}>
                {getFileName(sourceFile?.url || "")}
              </Typography>
              {/* <Typography variant="caption" color={SECONDARY[300]}>
              {getFileSize(sourceFile?.url) || "0 KB"}
            </Typography> */}
            </Stack>
          </Stack>
        )}
      </Stack>
      <AppDialog open={open} onClose={() => setOpen(false)} fullScreen={true}>
        {sourceFile && (
          <DocumentModal onClose={() => setOpen(false)} url={sourceFile.url} />
        )}
      </AppDialog>
    </Stack>
  );
}
