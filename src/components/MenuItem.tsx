import { PRIMARY, pxToRem, SECONDARY } from "@/theme";
import { Stack, Typography } from "@mui/material";
import React from "react";


interface MenuItemProps {
    text: string;
    Icon: JSX.Element;
    name: string;
    isActive: boolean;
    setTab: (tab: string) => void;
  }
  
  const MenuItem: React.FC<MenuItemProps> = ({ text, Icon, name, isActive, setTab }) => (
    <Stack
      direction="row"
      onClick={() => setTab(name)}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        borderRadius: pxToRem(16),
        gap: pxToRem(8),
        bgcolor: isActive ? PRIMARY["10"] : "transparent",
        padding: `${pxToRem(12)} ${pxToRem(24)}`,
        cursor: "pointer",
        color: isActive ? SECONDARY["0"] : SECONDARY["300"],
        "&:hover": {
          bgcolor: PRIMARY["10"],
          color: SECONDARY["0"],
        },
      }}
    >
      {Icon}
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          fontSize: pxToRem(14),
        }}
      >
        {text}
      </Typography>
    </Stack>
  );

  export default MenuItem;