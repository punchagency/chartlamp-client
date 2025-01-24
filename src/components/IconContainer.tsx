import { Hoverable } from "@/interface";
import { NEUTRAL, PRIMARY, pxToRem } from "@/theme";
import { Stack, Tooltip, TooltipProps, tooltipClasses, styled } from "@mui/material";
import React, { useEffect, useState } from "react";

const AppTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#022625",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#022625",
  },
}));

export function IconContainer({
  children,
  sx,
  tooltip,
  onClick,
  open = false,
  active,
}: {
  children: React.ReactNode;
  tooltip: string;
  open?: boolean;
  active?: boolean;
  onClick?: (e?: any) => void;
  sx?: any;
}) {
  const [isHovered, setIsHovered] = useState(active || open);

  useEffect(() => {
    setIsHovered(active || open);
  }, [active]);

  return (
    <AppTooltip title={tooltip} placement="top">
      <Stack
        className={active || open ? "active" : ""}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: pxToRem(12),
          gap: pxToRem(8),
          width: pxToRem(48),
          height: pxToRem(48),
          background: isHovered ? PRIMARY[25] : "transparent",
          borderRadius: pxToRem(12),
          cursor: onClick ? "pointer" : "default",
          "&:hover": {
            background: PRIMARY[25],
          },
          "&.active": {
            background: PRIMARY[50],
            // border: `1px solid ${NEUTRAL[300]}`,
          },
          ...sx,
        }}
        onMouseEnter={() => !active && setIsHovered(true)}
        onMouseLeave={() => !active && setIsHovered(false)}
        onClick={(e) => {
          if (onClick) {
            onClick(e);
          }
        }}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement<Hoverable>(child)) {
            return React.cloneElement(child, { isHovered });
          }
          return child;
        })}
      </Stack>
    </AppTooltip>
  );
}
