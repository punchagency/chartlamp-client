import { SECONDARY, pxToRem } from "@/theme";
import { Box, Stack, Typography } from "@mui/material";

export default function CompletedAlert({
  caseId,
  completed,
  handleNavigateToDetails,
}: any) {

  return (
    <Stack
      sx={{
        width: pxToRem(434),
        // height: pxToRem(141),
        borderRadius: pxToRem(24),
        padding: pxToRem(16),
        gap: pxToRem(16),
        position: "fixed",
        bottom: 15,
        right: 35,
        bgcolor: "#fff",
        boxShadow: "0px 0px 30px 0px rgba(23, 26, 28, 0.15)",
      }}
    >
      <Typography
        variant="subtitle1"
        color={SECONDARY[400]}
        fontWeight={700}
        fontSize={pxToRem(19)}
      >
        Scrapping information...
      </Typography>
      {/* <Stack direction={"row"} alignItems={"center"} gap={pxToRem(8)}>
        <Stack
          sx={{
            width: "100%",
            height: pxToRem(4),
            borderRadius: pxToRem(30),
          }}
        >
          <Stack
            sx={{
              width: "100%",
              height: pxToRem(4),
              borderRadius: pxToRem(30),
              bgcolor: SUCCESS[500],
            }}
          ></Stack>
        </Stack>
        <Typography
          variant="subtitle2"
          color={SECONDARY[400]}
          fontSize={pxToRem(12)}
        >
          100%
        </Typography>
      </Stack> */}
      {completed && (
        <Box
          onClick={handleNavigateToDetails}
          component={"button"}
          sx={{
            height: pxToRem(40),
            width: pxToRem(129),
            borderRadius: pxToRem(12),
            bgcolor: SECONDARY[500],
            color: "#fff",
            cursor: "pointer",
          }}
        >
          <Typography variant="body1" color={SECONDARY[50]}>
            View Case
          </Typography>
        </Box>
      )}
    </Stack>
  );
}
