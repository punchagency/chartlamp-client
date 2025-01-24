import { NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { Stack, Typography } from "@mui/material";

export enum TableView {
  cases = "cases",
  archive = "archive",
}

export default function TopNav({
  changeView,
  handleClickOpen,
  activeView,
}: {
  changeView: (view: TableView) => void;
  handleClickOpen: () => void;
  activeView: string;
}) {
  return (
    <Stack direction={"row"} alignItems={"center"} gap={pxToRem(48)}>
      <Typography
        variant="body1"
        color={SECONDARY[500]}
        fontWeight={700}
        fontSize={pxToRem(19)}
        onClick={() => changeView(TableView.cases)}
        sx={{
          cursor: "pointer",
          color: activeView === TableView.cases ? SECONDARY[500] : NEUTRAL[300],
        }}
      >
        Medical History
      </Typography>
      <Typography
        variant="body1"
        fontSize={pxToRem(19)}
        onClick={() => changeView(TableView.archive)}
        sx={{
          cursor: "pointer",
          color:
            activeView === TableView.archive ? SECONDARY[500] : NEUTRAL[300],
        }}
      >
        Maintaince
      </Typography>
      <Typography
        variant="body1"
        fontSize={pxToRem(19)}
        onClick={() => changeView(TableView.archive)}
        sx={{
          cursor: "pointer",
          color:
            activeView === TableView.archive ? SECONDARY[500] : NEUTRAL[300],
        }}
      >
        Reports
      </Typography>
    </Stack>
  );
}
