import { CustomImage } from "@/components/CustomImage";
import { PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";

export default function ProgressModal({
  percentageCompletion,
  name,
  img,
  caseNumber,
}: {
  percentageCompletion: number;
  name: string;
  caseNumber: string;
  img?: string;
}) {
  return (
    <Stack
      className="status-modal"
      sx={{
        height: pxToRem(414.22),
        width: pxToRem(403.96),
        borderRadius: pxToRem(24),
        boxShadow: `rgba(5, 113, 112, 0.08)`,
        px: pxToRem(72),
        py: pxToRem(40),
        gap: pxToRem(24),
        alignItems: "center",
      }}
    >
      <Stack
        sx={{
          position: "relative",
          height: pxToRem(161.22),
          width: pxToRem(161.96),
          borderRadius: `50%`,
        }}
      >
        <CircularProgress
          variant="determinate"
          sx={(theme) => ({
            color: PRIMARY[25],
            position: "absolute",
          })}
          size="100%"
          thickness={1.5}
          value={100}
        />
        <CircularProgress
          variant="determinate"
          value={percentageCompletion}
          thickness={1.5}
          size="100%"
          sx={(theme) => ({
            color: PRIMARY[500],
            position: "absolute",
          })}
        />
        <Stack
          sx={{
            position: "absolute",
            top: "50%",
            left: "55%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <CustomImage
            src={img || "/images/userHeader.png"}
            wrapperSx={{
              height: pxToRem(116),
              width: pxToRem(116),
              "& img": {
                borderRadius: "50%",
              },
            }}
          />
        </Stack>
      </Stack>
      <Stack gap={pxToRem(16)} alignItems="center">
        <Typography
          color={SECONDARY[50]}
          fontWeight={700}
          fontSize={pxToRem(28)}
        >
          Hey {name}
        </Typography>
        <Typography
          color={SECONDARY[50]}
          fontWeight={500}
          fontSize={pxToRem(16)}
          sx={{
            width: pxToRem(259.96),
            lineHeight: "130%",
            textAlign: "center",
          }}
        >
          We are loading your case, please wait. It wont take much time
        </Typography>
      </Stack>
      <Box
        sx={{
          px: pxToRem(16),
          py: pxToRem(8),
          border: `1px solid rgba(255, 255, 255, 0.1)`,
          backdropFilter: "blur(40px)",
          borderRadius: pxToRem(25),
        }}
      >
        <Typography
          color="rgba(240, 248, 248, 1)"
          fontWeight={500}
          fontSize={pxToRem(14)}
        >
          Case No. {caseNumber}
        </Typography>
      </Box>
    </Stack>
  );
}
