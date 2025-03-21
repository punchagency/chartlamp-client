import { Button } from "@/components/Button";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import CollapsibleSearch from "@/components/CollapsibleSearch";
import { UserAvatar } from "@/components/UserAvatar";
import FilterDrop from "@/containers/cases/components/FilterDrop";
import { AddIcon } from "@/containers/sidebar/svg/AddIcon";
import { OptionsType } from "@/interface";
import { shareModalVar } from "@/state/modal";
import { NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { useReactiveVar } from "@apollo/client";
import { Divider, Grid, Stack, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useState } from "react";
import { IconContainer } from "../../../../../components/IconContainer";
import ShareIcon from "../../../../../components/svgs/ShareIcon";
import { CaseDetailEnum } from "../../constants";
import {
  MaintenanceView,
  maintenanceViewVar,
  notesModalVar,
  showFilterVar,
} from "../../state";
import { GridIcon } from "../svg/GridIcon";
import { ListIcon } from "../svg/ListIcon";
import ExportToCSV from "../reports/export";

export enum TableView {
  cases = "cases",
  archive = "archive",
}

export enum MenuEnum {
  grid = "grid",
  list = "list",
  share = "share",
  filter = "filter",
}

export default function ActionsTab({
  userName,
  profilePicture,
  caseNumber,
  tagsArray,
  csvdata,
  handleSearch,
  handleUpload,
  handleTagSelect,
}: {
  userName: string;
  profilePicture: string;
  caseNumber: string;
  tagsArray?: OptionsType[];
  csvdata?: any;
  handleSearch: (val: string) => void;
  handleTagSelect?: (val: string) => void;
  handleUpload?: () => void;
}) {
  const maintenanceView = useReactiveVar(maintenanceViewVar);
  const showFilter = useReactiveVar(showFilterVar);
  const notesModal = useReactiveVar(notesModalVar);
  const { tab } = useParams();
  const [open, setOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const handleChange = () => {
    setOpen((prev) => !prev);
  };

  const handleShareClick = () => {
    console.log("Share clicked");
    shareModalVar(true);
  };

  return (
    <Grid
      container
      direction={"row"}
      alignItems={"center"}
      sx={{
        borderTop: `1px solid ${NEUTRAL[900]}`,
        borderBottom: `1px solid rgba(241, 243, 243, 1)`,
        height: { sm: "auto", md: pxToRem(80) },
        gap: { xs: pxToRem(24), sm: pxToRem(0) },
        py: { xs: pxToRem(24), sm: pxToRem(0) },
        px: { xs: pxToRem(16), sm: pxToRem(16) },
      }}
    >
      <Grid item xs={12} sm={4}>
        <UserAvatar
          title={userName || ""}
          subtitle={`Case Number: ${caseNumber || ""}`}
          img={profilePicture || ""}
        />
      </Grid>
      <Grid item xs={12} sm={8}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={!open ? pxToRem(8) : pxToRem(16)}
          justifyContent={{ xs: "flex-start", sm: "flex-end" }}
        >
          {tab === CaseDetailEnum.maintenance && (
            <Stack direction={"row"} alignItems={"center"} gap={pxToRem(8)}>
              <IconContainer
                tooltip="List view"
                onClick={() => maintenanceViewVar(MaintenanceView.listView)}
                active={maintenanceView == MaintenanceView.listView}
              >
                <ListIcon />
              </IconContainer>
              <IconContainer
                tooltip="Grid view"
                onClick={() => maintenanceViewVar(MaintenanceView.gridView)}
                active={maintenanceView == MaintenanceView.gridView}
              >
                <GridIcon />
              </IconContainer>
              <Divider
                orientation="vertical"
                sx={{
                  height: pxToRem(33.5),
                  width: pxToRem(1),
                  backgroundColor: NEUTRAL[900],
                  // margin: { xs: `0 ${pxToRem(8)}`, sm: `0 ${pxToRem(16)}` },
                }}
              />
            </Stack>
          )}
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={tab === CaseDetailEnum.reports ? pxToRem(16) : pxToRem(8)}
          >
            <CollapsibleSearch
              open={open}
              handleChange={handleChange}
              placeholder="Search"
              onSearch={(val) => handleSearch(val)}
              // searchVal={searchVal}
            />
            {tab === CaseDetailEnum.reports ? (
              <></>
            ) : (
              // <IconContainer
              //   tooltip="Filter"
              //   onClick={() => showFilterVar(!showFilter)}
              //   active={showFilter}
              // >
              //   <FilterIcon />
              // </IconContainer>
              <IconContainer tooltip="Share" onClick={handleShareClick}>
                <ShareIcon />
              </IconContainer>
            )}

            {/* <IconContainer tooltip="Pin Case" onClick={handleShareClick}>
              <PushPinOutlinedIcon />
            </IconContainer> */}

            <Button
              onClick={() => notesModalVar(!notesModal)}
              sx={{
                backgroundColor: NEUTRAL[0],
                border: `1px solid ${NEUTRAL[200]}`,
                "&:hover": {
                  background: PRIMARY[25],
                  border: `1px solid ${NEUTRAL[200]}`,
                },
              }}
            >
              <Typography variant="subtitle1" color={SECONDARY[400]}>
                Add a note
              </Typography>
            </Button>

            {tab === CaseDetailEnum.medicalHistory && (
              <Button onClick={() => showFilterVar(!showFilter)}>
                View by
              </Button>
            )}
            {tab === CaseDetailEnum.maintenance && (
              <ButtonWithIcon
                text="Upload new file"
                icon={<AddIcon />}
                onClick={handleUpload}
                containerStyles={{
                  bgcolor: "#022625",
                  height: pxToRem(48),
                  width: "auto",
                  py: pxToRem(12),
                  px: pxToRem(20),
                  gap: pxToRem(8),
                  borderRadius: pxToRem(16),
                  color: NEUTRAL[0],
                }}
              />
            )}
            {tab === CaseDetailEnum.reports &&
              tagsArray &&
              tagsArray.length && (
                <Stack direction="row" gap={pxToRem(16)}>
                  <FilterDrop
                    title="Tags"
                    options={tagsArray.slice(0, tagsArray.length - 1)}
                    handleSelect={(option) =>
                      handleTagSelect && handleTagSelect(option)
                    }
                    absoluteStyle={{
                      right: "0px",
                    }}
                  />
                  <ExportToCSV csvdata={csvdata}>
                    <Button
                      sx={{
                        backgroundColor: NEUTRAL[0],
                        border: `1px solid ${NEUTRAL[200]}`,
                        "&:hover": {
                          background: PRIMARY[25],
                          border: `1px solid ${NEUTRAL[200]}`,
                        },
                      }}
                    >
                      <Typography variant="subtitle1" color={SECONDARY[400]}>
                        Export
                      </Typography>
                    </Button>
                  </ExportToCSV>
                </Stack>
              )}
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
}
