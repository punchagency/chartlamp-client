"use client";
import { useAuthContext } from "@/auth/useAuthContext";
import { Button } from "@/components/Button";
import { pxToRem, SECONDARY } from "@/theme";
import { maskEmail, maskPhoneNumber } from "@/utils/general";
import { Alert, Link, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { BackIcon } from "../components/svgs/BackIcon";

export default function TwoFactor() {
  const router = useRouter();
  const {
    verifyOTP,
    resendOTP,
    logout,
    error,
    user,
    isLoading,
    isAuthenticated,
  } = useAuthContext();

  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (user?.email && isAuthenticated && !error) {
      router.push("/dashboard/home");
    }
  }, [user, router, isAuthenticated]);

  useEffect(() => {
    if (resendDisabled) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setResendDisabled(false);
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendDisabled]);

  const handleChange = useCallback((otp: string) => {
    setOtp(otp);
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      await verifyOTP(otp);
    } catch (err) {
      console.log(err);
    }
  }, [otp, verifyOTP, router]);

  const handleNavigation = useCallback(() => {
    logout();
    router.push("/auth/signin");
  }, [logout, router]);

  const handleResend = useCallback(async () => {
    try {
      await resendOTP();
      setResendDisabled(true);
    } catch (err) {
      console.log(err);
    }
  }, [resendOTP]);

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        maxWidth: pxToRem(564),
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        gap={pxToRem(4)}
        sx={{ cursor: "pointer", mb: 2 }}
        onClick={handleNavigation}
      >
        <BackIcon />
        <Typography
          variant="subtitle2"
          color={SECONDARY[300]}
          fontSize={pxToRem(14)}
        >
          Go back
        </Typography>
      </Stack>
      <Typography variant="h1" sx={{ mt: 2 }}>
        Please enter code
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ my: 1 }}>
        A verification code has been sent to your email
      </Typography>
      {user?.twoFactorAuth?.method === "email" ? (
        <Typography variant="body2" sx={{ my: 1, fontWeight: 500 }}>
          {user?.email ? maskEmail(user?.email) : ""}
        </Typography>
      ) : (
        <Typography variant="body2" sx={{ my: 1, fontWeight: 500 }}>
          {user?.twoFactorAuth?.phoneNumber
            ? maskPhoneNumber(user?.twoFactorAuth?.phoneNumber)
            : ""}
        </Typography>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 1 }}>
          {error.toString() || "An Error occurred"}
        </Alert>
      )}

      <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <OTPInput
          value={otp}
          onChange={handleChange}
          numInputs={6}
          inputStyle={{
            width: pxToRem(60),
            height: pxToRem(60),
            margin: "0 0.5rem",
            fontSize: "1rem",
            borderRadius: pxToRem(15),
            border: "1px solid #9AA8A8",
          }}
          renderInput={(props) => <input {...props} />}
        />

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography variant="body2" color="text.secondary">
            Don&#39;t receive the code?
          </Typography>
          <Link
            component="button"
            sx={{ textDecoration: "none", fontSize: "0.7rem", fontWeight: 500 }}
            onClick={handleResend}
            disabled={resendDisabled}
          >
            {resendDisabled ? `resend in ${timer}s` : "Resend"}
          </Link>
        </Stack>
        <Button
          onClick={onSubmit}
          fullWidth
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Verify"}
        </Button>
      </Box>
    </Box>
  );
}
