import { NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { Box, Stack, Typography } from "@mui/material";
import { CaseIcon } from "./svg/CaseIcon";
import { UpTrendIcon } from "./svg/UpTrendIcon";

export default function CasesCard() {
  return (
    <Stack
      sx={{
        // height: pxToRem(213),
        // width: pxToRem(341),
        width: "100%",
        borderRadius: pxToRem(16),
        gap: pxToRem(16),
        padding: pxToRem(16),
        bgcolor: NEUTRAL[50],
      }}
    >
      <Stack
        direction={"row"}
        // alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack gap={pxToRem(16)}>
          <Box
            sx={{
              bgcolor: NEUTRAL[300],
              padding: pxToRem(10),
              borderRadius: pxToRem(10),
              width: pxToRem(40),
              height: pxToRem(40),
            }}
          >
            <CaseIcon />
          </Box>
          <Typography variant="subtitle1" color={SECONDARY[500]}>
            Total Active Cases
          </Typography>
        </Stack>
        <Box
          component={"button"}
          sx={{
            height: pxToRem(36),
            borderRadius: pxToRem(12),
            border: `1px solid ${SECONDARY[200]}`,
            outline: "none",
          }}
        >
          <Typography variant="body2" color={SECONDARY[200]}>
            View All
          </Typography>
        </Box>
      </Stack>
      <Stack gap={pxToRem(16)}>
        <Typography
          variant="body2"
          color={SECONDARY[200]}
          fontSize={pxToRem(40)}
          fontWeight={700}
        >
          150
        </Typography>
        <Stack direction={"row"} gap={pxToRem(4)}>
          <UpTrendIcon />
          <Typography variant="body2" color={SECONDARY[200]}>
            55% vs last month
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
