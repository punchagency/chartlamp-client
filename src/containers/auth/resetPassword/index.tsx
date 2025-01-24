"use client";
import { useAuthContext } from "@/auth/useAuthContext";
import { Button } from "@/components/Button";
import LogoBlack from "@/components/LogoBlack";
import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import { successAlertVar } from "@/state";
import { pxToRem } from "@/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, IconButton, InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import MuiButton from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { Visibility } from "../components/svgs/Visibility";
import { VisibilityOff } from "../components/svgs/VisibilityOff";

type FormValuesProps = {
  password: string;
  confirmPassword: string;
  [key: string]: string | undefined;
};

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { resetwithtoken, error, isLoading } = useAuthContext();

  const [showPassword, setShowPassword] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<FormValuesProps>({
    password: "",
    confirmPassword: "",
  });

  const defaultValues = {
    password: "",
    confirmPassword: "",
  };

  const SignupSchema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(SignupSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onSubmit = async (data: FormValuesProps) => {
    try {
      if (!token) return;
      await resetwithtoken(data.password, token);
      if (!error) {
        successAlertVar("Password reset successfully");
        navigateToSignIn();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoBack = () => {
    setStep(1);
  };

  const navigateToSignIn = () => {
    router.push("/auth/signin");
  };

  //if formdata is not empty, set the form values
  React.useEffect(() => {
    if (Object.keys(formData).length) {
      Object.keys(formData).forEach((key) => {
        setValue(key, formData[key]);
      });
    }
  }, [formData]);

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        width: {
          xs: "100%",
          sm: pxToRem(564),
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LogoBlack />
      <Typography variant="h1" sx={{ mt: 2 }}>
        Set new password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Your new password must be different to previously used passwords.
      </Typography>
      {error && (
        <Alert severity="error" sx={{ my: 1 }}>
          {error.toString() || "An Error occurred"}
        </Alert>
      )}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          <RHFTextField
            name="password"
            label=""
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  disableRipple
                  disableFocusRipple
                  disableTouchRipple
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          <RHFTextField
            name="confirmPassword"
            label=""
            placeholder="Confirm Password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                  disableRipple
                  disableFocusRipple
                  disableTouchRipple
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              height: pxToRem(56),
            }}
          >
            {isLoading ? "Loading..." : "Save Password"}
          </Button>
          <MuiButton variant="text">Cancel</MuiButton>
        </Box>
      </FormProvider>
    </Box>
  );
}
