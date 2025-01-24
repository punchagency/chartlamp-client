import { PRIMARY, pxToRem, SECONDARY } from "@/theme";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  CSSObject,
  IconButton,
  Stack,
  styled,
  Theme,
  Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import Image from "next/image";
import React from "react";
import { AddIcon } from "./svg/AddIcon";
import DefaultMenu from "./views/DefaultMenu";
import { useSidebar } from "./hook";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  display: "none",
  [theme.breakpoints.up("sm")]: {
    display: "block",
  },
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  display: "none",
  width: `calc(${theme.spacing(10)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    // width: `calc(${theme.spacing(12)} + 1px)`,
    display: "block",
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      // margin: pxToRem(6),
      background:
        "linear-gradient(186.48deg, #011716 59.52%, #08BDBA 175.75%), #FFFFFF",
      borderRadius: pxToRem(24),
      height: `98vh`,
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      // margin: pxToRem(6),
      background:
        "linear-gradient(186.48deg, #011716 59.52%, #08BDBA 175.75%), #FFFFFF",
      borderRadius: pxToRem(24),
      height: `98vh`,
    },
  }),
}));

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  mobileOpen,
  handleDrawerToggle,
  expanded,
  setExpanded,
}: SidebarProps) {
  const { userCases } = useSidebar();
  const toggleDrawerExpand = () => {
    setExpanded(!expanded);
  };


  const drawerContent = React.useMemo(
    () => (
      <Stack
        sx={{
          height: `98vh`,
          width: "100%",
          padding: expanded ? pxToRem(16) : pxToRem(16),
          flexShrink: 0,
          pt: 1,
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={expanded ? "space-between" : "center"}
        >
          <Image
            src={expanded ? "/images/logo.svg" : "/images/logoSmall.svg"}
            width={expanded ? 176 : 40}
            height={53}
            alt="logo"
          />
          <IconButton
            onClick={toggleDrawerExpand}
            sx={{ color: SECONDARY[50] }}
          >
            <ArrowBackIosIcon
              sx={{
                transform: !expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
                width: expanded ? pxToRem(24) : pxToRem(16),
              }}
            />
          </IconButton>
        </Stack>
        <DefaultMenu open={expanded} userCases={userCases} />
        <Stack
          direction={"row"}
          sx={{
            alignItems: "center",
            justifyContent: "center",
            gap: pxToRem(5),
            mt: "auto",
            height: pxToRem(56),
            width: "100%",
            borderRadius: pxToRem(16),
            border: expanded ? `1px solid ${SECONDARY[50]}` : "none",
            ":hover": {
              backgroundColor: PRIMARY[800],
              cursor: "pointer",
            },
          }}
        >
          <AddIcon />
          {expanded && (
            <Typography variant="body1" color={SECONDARY[50]}>
              Invite Member
            </Typography>
          )}
        </Stack>
      </Stack>
    ),
    [expanded, userCases]
  );

  return (
    <Stack>
        <Drawer
          variant="permanent"
          open={expanded}
          sx={{
            // ml: 10
            "& .MuiDrawer-paper": {
              ml: "10px",
              mb: "20px",
              mt: "10px",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      <MuiDrawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },

          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </MuiDrawer>
    </Stack>
  );
}
