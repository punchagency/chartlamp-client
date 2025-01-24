/* eslint-disable react/prop-types */ // Add this line to disable prop-types validation for this file

import { GREEN, pxToRem } from "@/theme";
import { Stack, SxProps, Typography, TypographyProps } from "@mui/material";

interface ButtonWithIconProps {
  text: string; // text
  icon: React.ReactNode; // The icon can be any React node (component or element)
  containerStyles?: SxProps; // Styles for the container using MUI's `SxProps`
  hoverStyles?: any; // Styles for the container using MUI's `SxProps`
  textStyles?: TypographyProps["sx"]; // Styles for the text using MUI's `sx` property of Typography
  onClick?: () => void;
}

export const ButtonWithIcon: React.FC<ButtonWithIconProps> = ({
  text,
  icon,
  containerStyles,
  hoverStyles,
  textStyles,
  onClick
}) => {
  return (
    <Stack
      direction={"row"}
      onClick={onClick}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        gap: pxToRem(5),
        mt: "auto",
        height: pxToRem(56),
        background: GREEN[500],
        ...containerStyles,
        "&:hover": {
          background: GREEN[700],
          ...hoverStyles,
        },
      }}
    >
      {icon}
      <Typography sx={textStyles}>{text}</Typography>
    </Stack>
  );
};