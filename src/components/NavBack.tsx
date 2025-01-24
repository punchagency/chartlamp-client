import { BackIcon } from "@/containers/cases/components/svgs/BackIcon";
import { SECONDARY, pxToRem } from "@/theme";
import { Stack, Typography } from "@mui/material";


export default function NavBack({ handleNavigation }: { handleNavigation: () => void }) {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={pxToRem(4)}
      sx={{ cursor: "pointer", mt: pxToRem(5) }}
    >
      <BackIcon />
      <Typography
        variant="subtitle2"
        color={SECONDARY[300]}
        fontSize={pxToRem(12)}
        onClick={handleNavigation}
      >
        Go back
      </Typography>
    </Stack>
  );
}
