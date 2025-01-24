import { NEUTRAL, pxToRem } from "@/theme";
import { Box, Stack } from "@mui/material";
import React from "react";
import { IconContainer } from "./IconContainer";
import { SearchIcon } from "./svgs/SearchIcon";

export default function SearchBoxWithIcon({
  inputProps,
  inputStyles,
  boxStyles,
  showSearchIcon = true,
}: {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  inputStyles?: React.CSSProperties;
    boxStyles?: React.CSSProperties;
  showSearchIcon?: boolean;
}) {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      sx={{
        position: "relative",
        height: pxToRem(48),
        width: pxToRem(400),
        gap: pxToRem(8),
        cursor: "text",
        borderRadius: pxToRem(16),
        backgroundColor: "transparent",
        ...boxStyles,
        "& input": {
          border: `1px solid ${NEUTRAL[300]}`,
          outline: "none",
          // border: "none",
          width: "100%",
          pl: pxToRem(50),
          py: pxToRem(11),
          borderRadius: pxToRem(16),
          backgroundColor: "transparent",
          fontSize: pxToRem(16),
          fontWeight: 600,
          color: "#355151",
          "&:hover": {
            background: NEUTRAL[50],
            borderColor: `${NEUTRAL[300]}`,
          },
          "&:focus": {
            background: NEUTRAL[0],
            border: `2px solid ${NEUTRAL[400]}`,
          },
          "&::placeholder": {
            color: "#CCD4D3",
            fontSize: pxToRem(16),
            fontWeight: 500,
          },
          ...inputStyles,
        },
      }}
    >
      {showSearchIcon && (
        <IconContainer
          tooltip=""
          onClick={() => ""}
          sx={{
            position: "absolute",
            left: pxToRem(5),
            cursor: "pointer",
            "&:hover": {
              background: "none",
            },
          }}
        >
          <SearchIcon />
        </IconContainer>
      )}
      <Box component={"input"} placeholder="Search" {...inputProps} />
    </Stack>
  );
}
