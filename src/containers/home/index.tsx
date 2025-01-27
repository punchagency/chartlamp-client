"use client";
import LoadingScreen from "@/components/loading";
import { uploadModalVar } from "@/state/modal";
import { Grid } from "@mui/material";
import { CasesEnum } from "../cases/constants";
import CasesCard from "./components/CasesCard";
import ClaimRelated from "./components/ClaimsRelated";
import LastViewedCase from "./components/LastViewedCase";
import MostVisitedCase from "./components/MostVisitedCase";
import RecentlyJoined from "./components/RecentlyJoined";
import { ArchiveIcon } from "./components/svg/ArchiveIcon";
import { CaseIcon } from "./components/svg/CaseIcon";
import { useDashboard } from "./hooks";
import FavoriteCases from "./components/Favorites";

const CaseCardData = [
  {
    title: "Total Active Cases",
    icon: <CaseIcon fill1="#CEF2F1" fill2="#057170" />,
    buttonText: "View all",
    buttonLink: `/dashboard/cases/${CasesEnum.management}?referrer=home`,
    statNumber: "150",
    percentageChange: "55%",
    apiKey: "totalActiveCases",
  },
  {
    title: "New Cases",
    icon: <CaseIcon />,
    buttonText: "Add new",
    buttonLink: `/dashboard/cases/${CasesEnum.management}?upload=true`,
    statNumber: "33",
    percentageChange: "98%",
    onclick: () => uploadModalVar(true),
    apiKey: "totalCases",
  },
  {
    title: "Archived",
    icon: <ArchiveIcon />,
    buttonText: "View all",
    buttonLink: "/dashboard/cases/archive",
    statNumber: "19",
    percentageChange: "100%",
    apiKey: "totalArchivedCases",
  },
];

export default function HomePageContainer() {
  const {
    loading,
    stats,
    claimRelatedReports,
    mostVisitedCases,
    recentlyJoined,
    lastViewed,
  } = useDashboard();
  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <Grid container spacing={2}>
          <Grid item container md={9} sm={12} spacing={2}>
            {CaseCardData.map((item: any, index) => (
              <Grid item xs={12} md={4} key={index}>
                <CasesCard
                  {...{
                    ...item,
                    statNumber: stats[item.apiKey] || 0,
                  }}
                />
              </Grid>
            ))}
            <Grid item xs={12} md={12}>
              <ClaimRelated
                claimRelatedReports={claimRelatedReports.slice(0, 3)}
              />
            </Grid>
            <Grid item xs={12} md={recentlyJoined.length ? 8 : 12}>
              <FavoriteCases favoriteCases={mostVisitedCases} />
            </Grid>
            {Boolean(recentlyJoined.length) && (
              <Grid item xs={12} md={4}>
                <RecentlyJoined recentlyJoined={recentlyJoined} />
              </Grid>
            )}
          </Grid>
          {lastViewed && (
            <Grid item md={3} sm={12}>
              <LastViewedCase lastViewed={lastViewed} />
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
}
