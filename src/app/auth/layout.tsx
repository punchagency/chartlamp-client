"use client";
import FormDialog from "@/components/FormDialog";
import { errorAlertVar, successAlertVar } from "@/state";
import { NEUTRAL } from "@/theme";
import { useReactiveVar } from "@apollo/client";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import * as React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const videoUrl = "https://chartlamp.s3.amazonaws.com/ChartLampExplainer.mp4";

  const successAlert = useReactiveVar(successAlertVar);
  const errorAlert = useReactiveVar(errorAlertVar);

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpen(false);
  };

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

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid item sm={false} md={6}>
        <Box
          sx={{
            m: 2,
            width: "100%",
            borderRadius: 6,
            height: "95vh", // Define a height for the Box
            display: {
              xs: "none",
              sm: "flex",
            },
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            bgcolor: NEUTRAL["300"],
            backgroundImage: `url('/images/loginBg.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Button
            sx={{
              color: "#677D7C",
              bgcolor: "#DDE1E1",
              "&:hover": {
                color: "primary.dark",
                bgcolor: "#DDE1E1",
              },
              width: "135.5px",
              borderRadius: "16px",
              padding: "10px, 20px, 10px, 20px",
              mb: 2,
              textTransform: "none",
            }}
            onClick={() => setOpen(true)}
          >
            Watch Demo
          </Button>
        </Box>
        <FormDialog
          open={open}
          onClose={() => setOpen(false)}
          onFormSubmit={onFormSubmit}
          headline=""
          content={
            <Box
              sx={{
                width: {
                  sm: "200px",
                  md: "850px",
                },
                //style video to fit
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "& video": {
                  width: "100%",
                  // borderRadius: 6,
                  height: "auto",
                },
              }}
            >
              <video className="w-full max-w-lg" controls>
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/avi" />
                <source src={videoUrl} type="video/mkv" />
                Tu navegador no admite la reproducción de videos.
              </video>
            </Box>
          }
        />
      </Grid>
      <Grid
        item
        container
        sm={12}
        md={6}
        justifyContent="center"
        alignItems="center"
      >
        {children}
      </Grid>
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
    </Grid>
  );
}
