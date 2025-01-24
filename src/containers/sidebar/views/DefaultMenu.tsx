"use client";
import { CasesEnum } from "@/containers/cases/constants";
import { NEUTRAL, pxToRem } from "@/theme";
import { Stack, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { CasesIcon } from "../svg/CasesIcon";
import { DashBoardIcon } from "../svg/DashBoardIcon";
import SettingsIcon from "../svg/SettingsIcon";
import { TeamIcon } from "../svg/TeamIcon";
import CasesListView from "./CasesListView";
import { CaseDetail } from "@/interface";

export default function DefaultMenu({ open, userCases }: { open: boolean, userCases: CaseDetail[] }) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = useMemo(
    () => (name: string) => pathname.includes(name),
    [pathname]
  );
  const navigateTo = (linkUrl: string) => {
    router.push(linkUrl);
  };

  const menuItems = [
    {
      text: "Dashboard",
      Icon: <DashBoardIcon isActive={isActive("home")} />,
      linkUrl: "/dashboard/home",
      name: "home",
    },
    {
      text: "Cases",
      Icon: <CasesIcon isActive={isActive(`cases`)} />,
      linkUrl: `/dashboard/cases/${CasesEnum.management}`,
      name: "cases",
    },
    // {
    //   text: "Mapper",
    //   Icon: <CasesIcon isActive={isActive(`mapper`)} />,
    //   linkUrl: `/dashboard/mapper`,
    //   name: "mapper",
    // },
    {
      text: "Team",
      Icon: <TeamIcon isActive={isActive("team")} />,
      linkUrl: "/dashboard/team",
      name: "team",
    },
    {
      text: "Settings",
      Icon: <SettingsIcon isActive={isActive("settings")} />,
      linkUrl: "/dashboard/settings",
      name: "settings",
    },
  ];

  return (
    <Stack
      sx={{ mt: pxToRem(45), alignItems: !open ? "center" : "flex-start" }}
      spacing={1}
    >
      {menuItems.map(({ text, Icon, linkUrl, name }) => (
        <>
          <Stack
            direction="row"
            onClick={() => navigateTo(linkUrl)}
            key={text}
            sx={{
              alignItems: open ? "flex-start" : "center",
              justifyContent: open ? "flex-start" : "center",
              width: open ? "100%" : "80%",
              borderRadius: pxToRem(16),
              gap: pxToRem(8),
              bgcolor: isActive(name) ? "#39CAC8" : "transparent",
              padding: open
                ? `${pxToRem(12)} ${pxToRem(24)}`
                : `${pxToRem(8)} ${pxToRem(16)}`,
              cursor: "pointer",
              color: isActive(name) ? "#000000" : NEUTRAL["50"],
              "&:hover": {
                bgcolor: isActive(name) ? "#39CAC8" : "#022625",
              },
            }}
          >
            {Icon}
            {open && (
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  fontSize: pxToRem(16),
                }}
              >
                {text}
              </Typography>
            )}
          </Stack>
          {pathname.split("/")?.some((item) => item === "case") &&
            open &&
            name === "cases" && <CasesListView userCases={userCases} />}
        </>
      ))}
    </Stack>
  );
}
