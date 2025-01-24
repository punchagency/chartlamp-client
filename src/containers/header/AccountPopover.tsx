"use client";
import { MouseEvent, useState } from "react";
// @mui
import {
  Box,
  Divider,
  MenuItem,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
// mocks_
import { DonwArrowIcon } from "@/containers/header/svg/DonwArrowIcon";
import { PRIMARY, pxToRem, SECONDARY } from "@/theme";
// import { useRouter } from 'next/router';
import { useAuthContext } from "@/auth/useAuthContext";
import { CustomImage } from "../../components/CustomImage";
import LogoutIcon from "./svg/LogoutIcon";
import NotificationIcon from "./svg/NotificationIcon";
import ProfileIcon from "./svg/ProfileIcon";
import SecurityIcon from "./svg/SecuirtyIcon";
import UpArrowIcon from "./svg/UpArrowIcon";
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function AccountPopover() {
  // const containerRef = useRef<any>(null);
  const [open, setOpen] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuthContext();

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (route: string | false = false) => {
    setOpen(null);
    if (route) {
      //  navigate.push(route);
    }
  };

  const menuItems = [
    { text: "Profile", Icon: <ProfileIcon />, name: "profile" },
    { text: "Password & Security", Icon: <SecurityIcon />, name: "security" },
    { text: "Notification", Icon: <NotificationIcon />, name: "notifications" },
  ];

  const handleLogout = () => {
    // Redirect to home page
    logout();
    window.location.assign("/");
  };

  return (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={pxToRem(20)}
        onClick={handleOpen}
        sx={{
          cursor: "pointer",
        }}
      >
        <CustomImage
          src={user?.profilePicture || "/images/userHeader.png"}
          wrapperSx={{
            height: pxToRem(40),
            width: pxToRem(40),
            '& img': {
              borderRadius: '50%'
            }
          }}
        />
        <Typography variant="subtitle1" color={SECONDARY[400]}>
          {user?.name || ""}
        </Typography>
        {open ? <UpArrowIcon /> : <DonwArrowIcon />}
      </Stack>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={() => handleClose()}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            borderRadius: pxToRem(24),
            width: 210,
            "& .MuiMenuItem-root": {
              typography: "body2",
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Stack direction={"row"} alignItems={"center"} gap={pxToRem(20)}>
            <CustomImage
              src={user?.profilePicture || "/images/userHeader.png"}
              wrapperSx={{
                height: pxToRem(40),
                width: pxToRem(40),
              }}
            />
            <Typography variant="subtitle2" noWrap>
              {user?.name}
            </Typography>
          </Stack>
        </Box>

        <Divider />

        <Stack padding={pxToRem(12)} gap={pxToRem(16)}>
          {menuItems.map(({ text, Icon, name }) => (
            <MenuItem
              key={name}
              onClick={() => handleClose()}
              sx={{
                // m: 1,
                borderRadius: pxToRem(16),
                px: pxToRem(12),
                py: pxToRem(16),
                "&:hover": {
                  backgroundColor: PRIMARY[25],
                },
              }}
            >
              <Stack direction={"row"} alignItems={"center"} gap={pxToRem(20)}>
                {Icon}
                <Typography variant="body1" noWrap color={SECONDARY[300]}>
                  {text}
                </Typography>
              </Stack>
            </MenuItem>
          ))}

          <MenuItem
            onClick={handleLogout}
            sx={{
              borderRadius: pxToRem(16),
              px: pxToRem(12),
              py: pxToRem(16),
              backgroundColor: PRIMARY[25],
              "&:hover": {
                backgroundColor: PRIMARY[100],
              },
            }}
          >
            <Stack direction={"row"} alignItems={"center"} gap={pxToRem(20)}>
              <LogoutIcon />
              <Typography variant="body1" noWrap color={SECONDARY[300]}>
                Logout
              </Typography>
            </Stack>
          </MenuItem>
        </Stack>
      </Popover>
    </>
  );
}
