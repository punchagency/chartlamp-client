"use client";
import { useAuthContext } from "@/auth/useAuthContext";
import Button from "@/components/Button";
import FormDialog from "@/components/FormDialog";
import { RHFTextField } from "@/components/hook-form";
import FormProvider from "@/components/hook-form/FormProvider";
import OutlinedButton from "@/components/OutlinedButton";
import axiosInstance, { endpoints } from "@/lib/axios";
import { errorAlertVar, successAlertVar } from "@/state";
import { PRIMARY, pxToRem, SECONDARY } from "@/theme";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  styled,
  Switch,
  SwitchProps,
} from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import MuiPhoneNumber from "material-ui-phone-number";
import { useRouter } from "next/navigation";
import {
  memo,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = memo(({ children, value, index }: TabPanelProps) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
));

CustomTabPanel.displayName = "CustomTabPanel";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  margin: theme.spacing(1),
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#FFFFFF" : "#000000",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

type FormValuesProps = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function SecurityTab() {
  const router = useRouter();
  const { user, initialize } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [isEmailTwofaEnabled, setIsEmailTwofaEnabled] = useState(false);
  const [isSmsTwofaEnabled, setIsSmsTwofaEnabled] = useState(false);
  const [value, setValue] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [openAddTeamMember, setOpenAddTeamMember] = useState(false);
  const [howToGetCode, setHowToGetCode] = useState("");

  const handleChangeTwoFAMethod = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setHowToGetCode((event.target as HTMLInputElement).value);
  };

  const UpdateSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string().required("New password is required"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("newPassword"), "test"], "Passwords must match"),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(UpdateSchema) as any,
  });

  const {
    reset,
    // setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      setLoading(true);
      const response = await axiosInstance.patch(
        `${endpoints.user.update}/${user?._id}/password`,
        {
          ...data,
        }
      );
      setLoading(false);
      successAlertVar("Password updated successfully");
    } catch (err: any) {
      // reset();
      console.log(err);
      // setError('email', { type: 'manual', message: err.message });
      errorAlertVar(err.message);
      setLoading(false);
    }
  };

  const handleClose = useCallback(() => {
    setOpenAddTeamMember(false);
    setHowToGetCode("");
    setPhoneNumber("");
  }, []);

  const handleChange = useCallback(
    (event: SyntheticEvent, newValue: number) => {
      setValue(newValue);
    },
    []
  );

  const handleTwoFactorAuth = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, howToGetCode: string) => {
      if (howToGetCode === "email")
        setIsEmailTwofaEnabled(event.target.checked);
      if (howToGetCode === "sms") setIsSmsTwofaEnabled(event.target.checked);
      // update the server after 2 seconds
      setTimeout(() => {
        axiosInstance
          .patch(`${endpoints.user.update}/${user?._id}/2fa-toggle`, {
            isEnabled: event.target.checked,
            howToGetCode,
          })
          .then(async (response) => {
            if (response.status === 200) {
              await initialize();
              successAlertVar("2FA updated successfully");
            }
          })
          .catch((error: any) => {
            errorAlertVar(error.message);
          });
      }, 2000);
    },
    []
  );

  // const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   setOpenAddTeamMember(true);
  // }, [router]);

  const onPhoneNumberChange = useCallback((value: any) => {
    setPhoneNumber(value);
  }, []);

  const handleAddPhoneNumberSubmit = useCallback(async () => {
    try {
      if (!phoneNumber || !howToGetCode) return;
      setLoading(true);
      const response = await axiosInstance.patch(
        `${endpoints.user.update}/${user?._id}/2fa-update`,
        {
          phoneNumber,
          howToGetCode,
        }
      );
      setLoading(false);
      if (response.status === 200) {
        await initialize();
        successAlertVar("Phone number added successfully");
        handleClose();
      }
    } catch (error: any) {
      errorAlertVar(error.message);
      setLoading(false);
    }
  }, [howToGetCode, phoneNumber]);

  const isPhoneAddValid = useMemo(() => {
    if (!phoneNumber || !howToGetCode) return false;
    if (phoneNumber.length < 10) return false;
    return true;
  }, [howToGetCode, phoneNumber]);

  useEffect(() => {
    if (user?.twoFactorAuth) {
      if (user?.twoFactorAuth.method === "email") {
        setIsEmailTwofaEnabled(user?.twoFactorAuth.isEnabled);
        if (user?.twoFactorAuth.isEnabled) setIsSmsTwofaEnabled(false);
      }
      if (user?.twoFactorAuth.method === "sms") {
        setIsSmsTwofaEnabled(user?.twoFactorAuth.isEnabled);
        if (user?.twoFactorAuth.isEnabled) setIsEmailTwofaEnabled(false);
      }
    }
  }, [user]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        borderLeft: `1px solid ${PRIMARY["10"]}`,
        mt: 2,
        minHeight: "85vh",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", p: 2 }}>
        <Typography variant="h2" color="primary">
          Password & Security
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Set a password to protect your account.
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label="Password"
              {...a11yProps(0)}
              sx={{ textTransform: "none" }}
            />
            <Tab
              label="2 Factor authentication"
              {...a11yProps(1)}
              sx={{ textTransform: "none" }}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                mt: 1,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: pxToRem(500),
              }}
            >
              <Stack direction="column" spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Current Password
                </Typography>
                <RHFTextField
                  name="currentPassword"
                  autoComplete="currentPassword"
                  label=""
                  placeholder="Enter your current password"
                  type="password"
                  autoFocus
                  required
                  size="small"
                  sx={{ borderRadius: "16px" }}
                />
              </Stack>
              <Stack direction="column" spacing={1}>
                <Typography variant="body1" color="text.secondary">
                  New Password
                </Typography>
                <RHFTextField
                  name="newPassword"
                  label=""
                  placeholder="Enter your new password"
                  type="password"
                  required
                  size="small"
                  sx={{ borderRadius: "16px" }}
                />
              </Stack>

              <Stack direction="column" spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Confirm New Password
                </Typography>
                <RHFTextField
                  name="confirmPassword"
                  label=""
                  placeholder="Confirm your new password"
                  type="password"
                  required
                  size="small"
                  sx={{ borderRadius: "16px" }}
                />
              </Stack>

              <Button
                type="submit"
                variant="contained"
                sx={{
                  maxWidth: pxToRem(180),
                }}
              >
                {loading ? "Loading..." : "Update Password"}
              </Button>
            </Box>
          </FormProvider>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              maxWidth: pxToRem(500),
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack direction="column" spacing={1}>
                <Typography variant="h4" color="text.primary">
                  Email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Two factor authentication is by default enabled on your email{" "}
                  <b>“{user?.email}”</b>
                </Typography>
              </Stack>
              <FormControlLabel
                control={
                  <IOSSwitch
                    checked={isEmailTwofaEnabled}
                    onChange={(e) => handleTwoFactorAuth(e, "email")}
                  />
                }
                label=""
              />
            </Stack>

            <Stack direction="column" spacing={1}>
              <Typography variant="h4" color="text.primary">
                Phone Number
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use your phone number to receive security code
              </Typography>
              {user?.twoFactorAuth?.phoneNumber ? (
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h4" color="text.primary">
                    {user?.twoFactorAuth?.phoneNumber}
                  </Typography>
                  <FormControlLabel
                    control={
                      <IOSSwitch
                        checked={isSmsTwofaEnabled}
                        onChange={(e) => handleTwoFactorAuth(e, "sms")}
                      />
                    }
                    label=""
                  />
                </Stack>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    maxWidth: pxToRem(220),
                  }}
                  onClick={() => setOpenAddTeamMember(true)}
                >
                  + Add phone number
                </Button>
              )}
            </Stack>
          </Box>
        </CustomTabPanel>
      </Box>

      <FormDialog
        headline="Add phone number"
        subText="A phone number can be used as a second step, to help you sign back in if you lose access, and to receive alerts if there’s unusual activity "
        open={openAddTeamMember}
        onClose={handleClose}
        onFormSubmit={(e) => {
          e.preventDefault();
          handleClose();
        }}
        maxWidth="xs"
        content={
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Stack direction="column">
              <Typography variant="subtitle1" color={SECONDARY[200]}>
                Phone number
              </Typography>
              <MuiPhoneNumber
                defaultCountry={"us"}
                variant="outlined"
                fullWidth
                size="small"
                id="phone"
                label=""
                placeholder="Enter your phone number"
                name="phone"
                autoComplete="phone"
                value={phoneNumber}
                onChange={onPhoneNumberChange}
                InputProps={{
                  style: { borderRadius: pxToRem(12) },
                }}
              />
            </Stack>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                How do you want to get the code?{" "}
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={howToGetCode}
                onChange={handleChangeTwoFAMethod}
              >
                <FormControlLabel
                  value="sms"
                  control={<Radio />}
                  label="Text Message"
                />
                <FormControlLabel
                  value="phone"
                  control={<Radio />}
                  label="Phone Call"
                />
              </RadioGroup>
            </FormControl>
            <Stack direction="row" spacing={2}>
              <OutlinedButton
                customColor={SECONDARY["350"]}
                onClick={handleClose}
                size="small"
                sx={{
                  width: "48%",
                }}
              >
                Cancel
              </OutlinedButton>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddPhoneNumberSubmit}
                size="small"
                disabled={loading || !isPhoneAddValid}
                sx={{
                  width: "48%",
                  cursor: !isPhoneAddValid ? "not-allowed" : "pointer",
                  color: "#fff",
                }}
              >
                {loading ? "loading..." : "Add Phone Number"}
              </Button>
            </Stack>
          </Box>
        }
      />
    </Box>
  );
}
