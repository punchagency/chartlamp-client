import { SECONDARY, pxToRem } from "@/theme";
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

interface CustomButtonProps extends MuiButtonProps {
  customColor?: string;
  bgColor?: string;
  hoverColor?: string;
}

const RoundedButton = styled(MuiButton)<CustomButtonProps>(({ theme, customColor, bgColor, hoverColor }) => ({
  textTransform: "initial",
  border: `1px solid ${customColor || SECONDARY[500]}`,
  background: bgColor || "transparent",
  color: customColor || SECONDARY[500],
  fontStyle: "normal",
  fontWeight: 600,
  fontSize: pxToRem(14),
  borderRadius: pxToRem(12),
  "&:hover": {
    background: hoverColor || SECONDARY[100],
  },
}));

export const OutlinedButton: React.FC<CustomButtonProps> = (props) => (
  <RoundedButton {...props} />
);

export default OutlinedButton;