import { NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { Grid, Stack, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { CaseDetailEnum } from "../constants";

export enum TableView {
  medicalHistory_detailview = "medicalHistory_detailview",
  medicalHistory_mapview = "medicalHistory_mapview",
  maintenance = "maintenance",
  reports = "reports",
}

interface TopNavProps {
  tab: CaseDetailEnum;
  setTab: React.Dispatch<React.SetStateAction<CaseDetailEnum>>;
}

export default function TopNav() {
  const router = useRouter();
  const { id, tab } = useParams<{ id: string; tab: CaseDetailEnum }>();

  const getViewName = (view: CaseDetailEnum) => {
    switch (view) {
      case CaseDetailEnum.medicalHistory:
        return "Medical History";
      case CaseDetailEnum.maintenance:
        return "Maintenance";
      case CaseDetailEnum.reports:
        return "Reports";
      case CaseDetailEnum.comments:
        return "All Notes";
      default:
        return "";
    }
  };

  return (
    <Stack padding={pxToRem(14)} backgroundColor={NEUTRAL[0]}>
      <Grid container direction={"row"} alignItems={"center"}>
        <Grid item xs={12} md={12}>
          <Grid container alignItems={"center"} gap={pxToRem(48)}>
            {Object.values(CaseDetailEnum).map((view, index) => (
              <Grid item xs={12} md={"auto"} key={index}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  fontSize={pxToRem(19)}
                  onClick={() => router.push(`/dashboard/case/${id}/${view}`)}
                  sx={{
                    cursor: "pointer",
                    color: tab === view ? SECONDARY[500] : NEUTRAL[300],
                  }}
                >
                  {getViewName(view)}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Stack>
  );
}
