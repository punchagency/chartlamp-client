import SearchBoxWithIcon from "@/components/SearchBoxWithIcon";
import { StatusType } from "@/interface";
import { GREEN, NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import {
  Box,
  ClickAwayListener,
  Collapse,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CarretDown from "./svgs/CarretDown";
import { CarretUp } from "./svgs/CarretUp";
import { CloseIcon } from "./svgs/CloseIcon";
import { ClaimStatusPill } from "./table/ClaimStatus";
import { statusStyle } from "./table/constants";

interface OptionProps {
  label: string;
  value: string;
}

export default function FilterDrop({
  title,
  options,
  isClaimStatus,
  isCaseClaimStatus = false,
  search,
  bodyStyle,
  containerStyle,
  absoluteStyle,
  topStyle,
  hideClose = false,
  handleSelect,
}: {
  title: string;
  options: { label: string; value: string }[] | [];
  isClaimStatus?: boolean;
  hideClose?: boolean;
  isCaseClaimStatus?: boolean;
  search?: boolean;
  bodyStyle?: any;
  absoluteStyle?: any;
  containerStyle?: any;
  topStyle?: any;
  handleSelect: (option: string) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<OptionProps | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleSelectOption = (option: OptionProps) => {
    handleSelect(option.value);
    setSelectedOption(option);
    setOpen(false);
  };

  const handleRemoveOption = (e: any) => {
    e.stopPropagation();
    handleSelect("");
    setSelectedOption(null);
  };

  const filterPill = (
    <Stack
      onClick={handleClick}
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      className={selectedOption && !hideClose ? "active" : ""}
      sx={{
        gap: pxToRem(8),
        py: pxToRem(10),
        px: pxToRem(16),
        border: `1px solid ${NEUTRAL[300]}`,
        borderRadius: pxToRem(12),
        maxHeight: { sm: pxToRem(48) },
        minWidth: selectedOption?.value === "new" ? pxToRem(156) : "auto",
        cursor: "pointer",
        ...bodyStyle,
        "&:hover": {
          background: PRIMARY[25],
          border: `1px solid ${NEUTRAL[300]}`,
        },
        "&.active": {
          background: PRIMARY[50],
          border: `1px solid ${NEUTRAL[300]}`,
        },
      }}
    >
      <Typography
        variant="subtitle1"
        color={GREEN[400]}
        textTransform={"capitalize"}
      >
        {selectedOption?.label ?? title}
      </Typography>
      {!selectedOption && !hideClose && (
        <>{open ? <CarretUp /> : <CarretDown />}</>
      )}
      {hideClose && <>{open ? <CarretUp /> : <CarretDown />}</>}
      {selectedOption && !hideClose && (
        <IconButton onClick={handleRemoveOption}>
          <CloseIcon />
        </IconButton>
      )}
    </Stack>
  );

  const ClaimStatusFilterPill = () => {
    const val = selectedOption?.value || title;
    return (
      <Stack
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        sx={{
          gap: pxToRem(8),
          py: pxToRem(8),
          px: pxToRem(16),
          borderRadius: pxToRem(12),
          width: "fit-content",
          height: pxToRem(32),
          zIndex: 0,
          ...statusStyle(val),
          "& svg > path": {
            fill: statusStyle(val)?.color,
          },
          "&:hover": {
            background: statusStyle(val)?.bghover,
            cursor: "pointer",
            border: `1px solid ${statusStyle(val)?.bdHover}`,
            "& svg > path": {
              fill: statusStyle(val)?.bdHover,
            },
          },
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontSize: pxToRem(14),
          }}
        >
          {selectedOption?.label || title}
        </Typography>
        {open ? <CarretUp /> : <CarretDown />}
      </Stack>
    );
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Grid item xs={12} sm={"auto"} sx={{ ...topStyle }}>
        <Stack
          sx={{
            position: "relative",
            minWidth: "max-content",
            ...containerStyle,
          }}
        >
          {isCaseClaimStatus ? <ClaimStatusFilterPill /> : filterPill}
          {open && (
            <Collapse in={open}>
              <Stack
                sx={{
                  background: NEUTRAL[0],
                  boxShadow: "0px 0px 20px rgba(23, 26, 28, 0.08)",
                  borderRadius: pxToRem(16),
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: pxToRem(8),
                  gap: pxToRem(8),
                  position: "absolute",
                  top: "120%",
                  zIndex: 300,
                  width: "100%",
                  minWidth: "max-content",
                  ...absoluteStyle,
                }}
              >
                {search && (
                  <SearchBoxWithIcon
                    boxStyles={{ height: pxToRem(40), width: "100%" }}
                    inputProps={{
                      placeholder: "Search here",
                    }}
                  />
                )}
                {options.map(
                  (option: { label: string; value: string }, index) => (
                    <Stack
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectOption(option);
                      }}
                      width="100%"
                      // height={pxToRem(32)}
                    >
                      {isClaimStatus ? (
                        <ClaimStatusPill
                          claimStatus={option.label}
                          isFilter={true}
                        />
                      ) : (
                        <Box
                          className={
                            selectedOption?.value === option.value
                              ? "active"
                              : ""
                          }
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            padding: `${pxToRem(8)} ${pxToRem(16)}`,
                            height: pxToRem(32),
                            borderRadius: pxToRem(10),
                            color: SECONDARY[300],
                            ":hover": {
                              background: PRIMARY[25],
                              borderRadius: pxToRem(10),
                              cursor: "pointer",
                              color: SECONDARY[400],
                            },
                            "&.active": {
                              background: PRIMARY[25],
                              color: SECONDARY[400],
                            },
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            color="inherit"
                            textTransform={"capitalize"}
                          >
                            {option.label}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  )
                )}
              </Stack>
            </Collapse>
          )}
        </Stack>
      </Grid>
    </ClickAwayListener>
  );
}
