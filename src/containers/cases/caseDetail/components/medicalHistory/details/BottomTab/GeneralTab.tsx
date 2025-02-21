import { ReportsDetail } from "@/interface";
import { SECONDARY, pxToRem } from "@/theme";
import { Stack, Typography } from "@mui/material";

export default function GeneralTab({
  report,
  chartNote,
}: {
  report: ReportsDetail;
  chartNote: string;
}) {
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
          Charts Notes:
        </Typography>

        <Typography
          variant="body1"
          color={SECONDARY[400]}
          lineHeight={pxToRem(19.2)}
        >
          {chartNote}
        </Typography>
      </Stack>
      {/* <Stack gap={pxToRem(8)}>
        <Typography variant="h5" color={SECONDARY[500]}>
          Related:
        </Typography>

        <Typography variant="body1" color={SECONDARY[400]}>
          25 March, 2021
        </Typography>
      </Stack> */}
    </Stack>
  );
}
