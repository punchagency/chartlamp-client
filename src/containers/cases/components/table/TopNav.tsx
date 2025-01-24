import AppBadge from "@/components/AppBadge";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import SearchBoxWithIcon from "@/components/SearchBoxWithIcon";
import { SearchIcon } from "@/components/svgs/SearchIcon";
import { GREEN, NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { Collapse, Grid, Stack, Typography } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { IconContainer } from "../../../../components/IconContainer";
import { CasesEnum } from "../../constants";
import { AddIcon } from "../svgs/AddIcon";
import { CloseIcon } from "../svgs/CloseIcon";
import { FilterIcon } from "../svgs/FilterIcon";

export enum TableView {
  cases = "cases",
  archive = "archive",
}

export default function TopNav({
  handleClickOpen,
  handleFilterClick,
  showFilter,
  archivedCasesLength,
}: {
    showFilter: boolean;
    archivedCasesLength: number;
  handleClickOpen: () => void;
  handleFilterClick: () => void;
}) {
  const router = useRouter();
  const { tab } = useParams();
  const [open, setOpen] = useState(false);

  const handleChange = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Stack
      padding={pxToRem(14)}
      sx={{
        position: "sticky",
        top: 0,
      }}
    >
      <Grid container direction={"row"} alignItems={"center"}>
        <Grid item xs={12} md={6}>
          <Stack direction={"row"} alignItems={"center"} gap={pxToRem(48)}>
            <Typography
              variant="body1"
              color={SECONDARY[500]}
              fontWeight={600}
              fontSize={pxToRem(19)}
              onClick={() =>
                router.push(`/dashboard/cases/${CasesEnum.management}`)
              }
              sx={{
                cursor: "pointer",
                color: tab === CasesEnum.management ? GREEN[500] : NEUTRAL[300],
                "&:hover": {
                  color: GREEN[500],
                },
              }}
            >
              Case Management
            </Typography>
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={pxToRem(8)}
              onClick={() =>
                router.push(`/dashboard/cases/${CasesEnum.archive}`)
              }
              sx={{
                cursor: "pointer",
                "&:hover p": {
                  color: GREEN[500],
                },
                "&:hover div": {
                  background: SECONDARY[500],
                },
              }}
            >
              <Typography
                variant="body1"
                fontWeight={600}
                fontSize={pxToRem(19)}
                sx={{
                  color: tab === CasesEnum.archive ? GREEN[500] : NEUTRAL[300],
                }}
              >
                Archive
              </Typography>
              <AppBadge
                text={archivedCasesLength}
                sx={{
                  background:
                    tab === CasesEnum.archive ? SECONDARY[500] : GREEN[200],
                }}
              />
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={pxToRem(16)}
            justifyContent={{ md: "flex-end", sm: "flex-start" }}
          >
            <Stack direction={"row"} alignItems={"center"} gap={pxToRem(8)}>
              <Collapse in={open} orientation="horizontal">
                <SearchBoxWithIcon />
              </Collapse>
              {open ? (
                <>
                  <IconContainer tooltip="" open={true} onClick={handleChange}>
                    <CloseIcon size={pxToRem(24)} />
                  </IconContainer>
                </>
              ) : (
                <IconContainer tooltip="" onClick={handleChange}>
                  <SearchIcon />
                </IconContainer>
              )}
              <IconContainer
                tooltip="Filter"
                onClick={handleFilterClick}
                active={showFilter}
              >
                <FilterIcon />
              </IconContainer>
            </Stack>
            <ButtonWithIcon
              text="Add New Case"
              icon={<AddIcon />}
              onClick={handleClickOpen}
              textStyles={{
                fontWeight: 600,
                fontSize: pxToRem(14),
              }}
              containerStyles={{
                bgcolor: "rgba(23, 26, 28, 1)",
                height: pxToRem(48),
                width: pxToRem(182),
                gap: pxToRem(4),
                borderRadius: pxToRem(16),
                color: NEUTRAL[0],
                cursor: "pointer",
              }}
            />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
