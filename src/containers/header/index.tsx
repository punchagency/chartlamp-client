import { useAuthContext } from "@/auth/useAuthContext";
import { IconContainer } from "@/components/IconContainer";
import SearchBoxWithIcon from "@/components/SearchBoxWithIcon";
import { SECONDARY, pxToRem } from "@/theme";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Divider,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from "react";
import AccountPopover from "./AccountPopover";
import { BellIcon } from "./svg/BellIcon";

export default function Header({
  drawerWidth,
  handleDrawerToggle,
  expanded,
}: {
  drawerWidth: number;
  expanded: Boolean;
  handleDrawerToggle: () => void;
}) {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const componsedDrawerWidth = useMemo(
    () => (!expanded ? 80 : drawerWidth),
    [expanded, drawerWidth]
  );

  const { user, isAuthenticated } = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated]);

  const SearchBar = () => (
    <SearchBoxWithIcon
    />
  );

  return (
    <AppBar
      position="fixed"
      color="inherit"
      sx={{
        //add smooth transition
        transition: "all 0.3s ease",
        width: isMobile ? "100%" : `calc(100% - ${componsedDrawerWidth}px)`,
        ml: isMobile ? 0 : `${componsedDrawerWidth}px`,
        //add animation
        // zIndex: theme.zIndex.drawer + 1,
        // backgroundColor: "white",
        pt: pxToRem(8),
        pr: pxToRem(16),
        pl: pxToRem(24),
        boxShadow: "none",
        bgcolor: theme.palette.background.default,
        // bgcolor: 'green'
      }}
    >
      <Toolbar sx={{ p: { xs: 0, md: 0 } }}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          sx={{
            width: "100%",
            height: pxToRem(76),
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          {!isMobile && (
            <>
              <Stack gap={pxToRem(4)}>
                <Typography variant="caption" color={SECONDARY[300]}>
                  Welcome
                </Typography>
                <Typography
                  variant="body2"
                  color={SECONDARY[500]}
                  fontWeight={700}
                  fontSize={pxToRem(28)}
                  lineHeight={pxToRem(33.6)}
                >
                  {user?.name || ''}
                </Typography>
              </Stack>
              <Stack direction={"row"} alignItems={"center"} gap={pxToRem(24)}>
                <SearchBar />
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  gap={pxToRem(32)}
                >
                  <IconContainer
                    tooltip=""
                    onClick={() => ""}
                    sx={{
                      "&:hover": {
                        background: SECONDARY[50],
                        borderRadius: pxToRem(12),
                      },
                    }}
                  >
                    <BellIcon />
                  </IconContainer>
                  <Divider orientation="vertical" variant="middle" flexItem />
                  <AccountPopover />
                </Stack>
              </Stack>
            </>
          )}
          {isMobile && (
            <Stack direction={"row"} alignItems={"center"} gap={pxToRem(32)}>
              <BellIcon />
              <Divider orientation="vertical" variant="middle" flexItem />
              <AccountPopover />
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
