"use client";
import { NEUTRAL, pxToRem } from "@/theme";
import { Box, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import MapperContainer from "../mapper";
import SettingsSideMenu from "./Menu";
import NotificationsTab from "./NotificationsTab";
import ProfileTab from "./ProfileTab";
import SecurityTab from "./SecurityTab";

export default function SettingsContainer() {
  const [tab, setTab] = useState("profile");
  const tabContent = useMemo(() => {
    switch (tab) {
      case "profile":
        return <ProfileTab />;
      case "notifications":
        return <NotificationsTab />;
      case "security":
        return <SecurityTab />;
      case "icd-mapper":
        return <MapperContainer />;
      default:
        return <ProfileTab />;
    }
  }
    , [tab]);

  return (

    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      boxShadow: `0px 0px 10px ${NEUTRAL["600"]}`,
      borderRadius: pxToRem(24),
      backgroundColor: NEUTRAL[0],
      width: '100%',
      minHeight: '85vh',
      px: pxToRem(20),
    }}>
      <Grid container spacing={3}>
        <Grid item md={2} sm={12}>
          <SettingsSideMenu setTab={setTab} seletectedTab={tab} />
        </Grid>
        <Grid item container md={10} sm={12} spacing={2}>
          {tabContent}
        </Grid>
      </Grid>
    </Box>
  );
}
