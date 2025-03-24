"use client";
import AuthGuard from "@/auth/AuthGuard";
import AppDialog from "@/components/DailogBox";
import ShareModal from "@/containers/cases/components/share";
import UploadcaseModal from "@/containers/cases/components/uploadCase";
import Header from "@/containers/header";
import Sidebar from "@/containers/sidebar";
import { shareModalVar, uploadModalVar } from "@/state/modal";
import { pxToRem } from "@/theme";
import { useReactiveVar } from "@apollo/client";
import { Alert, Snackbar, SnackbarCloseReason, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import React, { useState } from "react";
import "react-calendar/dist/Calendar.css";
import "../globals.css";
import { successAlertVar, errorAlertVar } from "@/state";
import CompletedAlert from "@/containers/cases/components/uploadCase/completedAlert";
import { progressModalVar } from "@/containers/cases/caseDetail/state";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const uploadModalState = useReactiveVar(uploadModalVar);
  const shareModalState = useReactiveVar(shareModalVar);
  const progressModalState = useReactiveVar(progressModalVar);
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = React.useState<boolean>(true);

    const successAlert = useReactiveVar(successAlertVar);
    const errorAlert = useReactiveVar(errorAlertVar);

    const handleClose = (
      event?: React.SyntheticEvent | Event,
      reason?: SnackbarCloseReason
    ) => {
      if (reason === "clickaway") {
        return;
      }

      successAlertVar("");
      errorAlertVar("");
    };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 240;

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AuthGuard>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <Header
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
          expanded={expanded}
        />
        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          expanded={expanded}
          setExpanded={setExpanded}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            // p: { xs: 0, sm: 3 },
            width: isMobile ? "100%" : `calc(100% - ${drawerWidth}px)`,
          }}
        >
          <Toolbar />
          <Box
            sx={{
              display: "flex",
              mx: pxToRem(20),
              ml: pxToRem(30),
              justifyContent: "center",
              alignItems: "center",
              // bgcolor: 'red',
              mt: pxToRem(30),
            }}
          >
            {children}
          </Box>
        </Box>
        <AppDialog
          open={uploadModalState}
          onClose={() => uploadModalVar(false)}
        >
          <UploadcaseModal onClose={() => uploadModalVar(false)} />
        </AppDialog>
        {/* <AppDialog open={shareModalState} onClose={() => shareModalVar(false)}>
          <ShareModal onClose={() => shareModalVar(false)} />
        </AppDialog> */}
        <Snackbar
          open={Boolean(successAlert)}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
            {successAlert}
          </Alert>
        </Snackbar>
        <Snackbar
          open={Boolean(errorAlert)}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
            {errorAlert}
          </Alert>
        </Snackbar>
       <CompletedAlert />
      </Box>
    </AuthGuard>
  );
}
