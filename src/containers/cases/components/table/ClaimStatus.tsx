import { ERROR, PRIMARY, SUCCESS, pxToRem } from "@/theme";
import { Box } from "@mui/material";
import { statusStyle } from "./constants";

export function ClaimStatusPill({
  claimStatus,
  isFilter,
}: {
  claimStatus: string;
  isFilter?: boolean;
}) {
  return (
    <Box
      sx={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        py: pxToRem(8),
        px: pxToRem(16),
        borderRadius: pxToRem(12),
        width: isFilter ? "100%" : "fit-content",
        height: pxToRem(32),
        fontWeight: 600,
        fontSize: pxToRem(14),
        ...statusStyle(claimStatus),
        "&:hover": {
          background: isFilter ? statusStyle(claimStatus)?.bghover || "" : "",
          cursor: "pointer",
          border: `1px solid ${statusStyle(claimStatus)?.bdHover}`,
        },
      }}
    >
      {claimStatus}
    </Box>
  );
}
