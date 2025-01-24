import { SECONDARY, pxToRem } from "@/theme";
import { Stack, Typography } from "@mui/material";
import { CustomImage } from "./CustomImage";

export function UserAvatar({
  title,
  subtitle,
  imgSx,
  textStackSx,
  img,
}: {
  title: string;
  subtitle: string;
  img?: string;
  imgSx?: any;
  textStackSx?: any;
}) {
  return (
    <Stack gap={pxToRem(4)} direction={"row"} alignItems={"center"}>
      <CustomImage
        src={img || "/images/userHeader.png"}
        wrapperSx={{
          height: pxToRem(44),
          width: pxToRem(44),
          "& img": {
            borderRadius: "50%",
          },
          ...imgSx,
        }}
      />
      <Stack gap={pxToRem(4)} sx={{ ...textStackSx }}>
        <Typography
          variant="h5"
          sx={{
            fontSize: pxToRem(16),
          }}
          color={SECONDARY[400]}
        >
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: pxToRem(14),
          }}
          color={SECONDARY[300]}
        >
          {subtitle}
        </Typography>
      </Stack>
    </Stack>
  );
}
