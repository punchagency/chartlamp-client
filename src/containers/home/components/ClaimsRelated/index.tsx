import { NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { Box, Stack, Typography } from "@mui/material";
import ClaimsTable from "./ClaimsTable";

export default function ClaimRelated({ claimRelatedReports }: { claimRelatedReports: any[] }) {
  return (
    <Stack
      sx={{
        borderRadius: pxToRem(24),
        bgcolor: NEUTRAL[0],
        // padding: pxToRem(16),
        boxShadow: "0px 0px 10px rgba(5, 113, 112, 0.04)",
        minHeight: pxToRem(319),
      }}
    >
      <Stack
        direction={"row"}
        gap={pxToRem(8)}
        pl={pxToRem(16)}
        pt={pxToRem(16)}
        minHeight={pxToRem(52)}
      >
        <Typography variant="h5" color={SECONDARY[500]}>
          Claim Related
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: pxToRem(20),
            width: pxToRem(44),
            padding: pxToRem(8),
            borderRadius: pxToRem(30),
            bgcolor: SECONDARY[500],
          }}
        >
          <Typography variant="caption" color={NEUTRAL[0]}>
            Tags
          </Typography>
        </Box>
      </Stack>
      <Stack>
        <ClaimsTable claimRelatedReports={claimRelatedReports} />
      </Stack>
    </Stack>
  );
}
