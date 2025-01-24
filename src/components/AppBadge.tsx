import { NEUTRAL, pxToRem } from "@/theme";
import { Stack, Typography } from "@mui/material";

export default function AppBadge({ sx, text }: { sx?: any; text: number }) {
  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        width: pxToRem(24),
        height: pxToRem(24),
        borderRadius: "50%",
        ...sx,
      }}
    >
      <Typography variant="subtitle1" color={NEUTRAL[0]}>
        {text}
      </Typography>
    </Stack>
  );
}
