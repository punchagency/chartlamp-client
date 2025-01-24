import { pxToRem } from "@/theme";
import Dialog from "@mui/material/Dialog";
import React from "react";

interface SimpleDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  children: React.ReactNode;
  fullScreen?: boolean;
}

export default function AppDialog({
  onClose,
  open,
  children,
  fullScreen = false,
}: SimpleDialogProps) {
  const handleClose = () => {
    onClose("");
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          borderRadius: !fullScreen ? pxToRem(24) : "none",
          "&.MuiPaper-root": {
            maxWidth: "100%",
          },
        },
      }}
    >
      {children}
    </Dialog>
  );
}
