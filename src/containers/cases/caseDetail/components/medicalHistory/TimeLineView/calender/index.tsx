import Button from "@/components/Button";
import { IconContainer } from "@/components/IconContainer";
import { CloseModalIcon } from "@/components/svgs/CloseModalIcon";
import { showTimelIneCalenderVar } from "@/containers/cases/caseDetail/state";
import { NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import { DateRangePicker, StaticRange } from "react-date-range";

const dateBoxStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: pxToRem(39),
  width: pxToRem(134),
  borderRadius: pxToRem(12),
  border: `1px solid ${NEUTRAL[200]}`,
  py: pxToRem(11.5),
  px: pxToRem(24),
  cursor: "pointer",
  color: SECONDARY[400],
  fontWeight: 600,
  fontSize: pxToRem(14),

  "&:hover": {
    // bgcolor: PRIMARY[25],
  },
};

const iconStyle = {
  width: "auto",
  height: "auto",
};

export default function TimelineCalender({
  onDateRangeChange,
  staticRanges,
  activateCustomRange,
  selectionRange,
  setSelectionRange,
  handleChange,
  handleCancel,
}: {
  onDateRangeChange: (dateRange: Date[]) => void;
  staticRanges: StaticRange[];
  activateCustomRange: boolean;
  selectionRange: any;
  setSelectionRange: (value: any) => void;
  handleChange: (item: any) => void;
  handleCancel: () => void;
}) {
  return (
    <Stack
      sx={{
        position: "absolute",
        bottom: pxToRem(115),
        left: "50%",
        transform: "translateX(-50%)",
        // height: pxToRem(485),
        // width: pxToRem(810),
        bgcolor: NEUTRAL[0],
        borderRadius: pxToRem(16),
        boxShadow: "0px 0px 24px rgba(2, 38, 37, 0.1)",
        zIndex: 100,
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        padding={pxToRem(20)}
        height={pxToRem(64)}
      >
        <Typography variant={"h5"} color={SECONDARY[400]}>
          Select a timeline
        </Typography>
        <IconContainer
          tooltip="Close"
          onClick={() => showTimelIneCalenderVar(false)}
        >
          <CloseModalIcon />
        </IconContainer>
      </Stack>
      <Stack
        direction={"row"}
        // alignItems={"center"}
        sx={{
          borderTop: `1px solid ${NEUTRAL[200]}`,
          width: "100%",
          // bgcolor: "red",
        }}
      >
        <Stack
          sx={{
            width: "100%",
            "& .rdrDefinedRangesWrapper": {
              width: pxToRem(145),
            },
            "& .rdrStaticRange": {
              border: "none",
              width: "100%",
            },
            "& .rdrStaticRanges": {
              borderRight: `1px solid ${NEUTRAL[200]}`,
              padding: pxToRem(8),
              gap: pxToRem(8),
              width: "100%",
              // width: "min-content",
              alignItems: "flex-start",
              height: "100%",
              // backgroundColor: "red",
            },
            "& .rdrStaticRangeLabel": {
              display: "flex",
              alignItems: "center",
              height: pxToRem(32),
              width: "100%",
              // minWidth: "max-content",
              borderRadius: pxToRem(10),
              p: 0,
              pl: pxToRem(16),
              "&:hover": {
                background: PRIMARY[25],
                cursor: "pointer",
              },
            },
            "& .rdrStaticRangeSelected": {
              background: PRIMARY[25],
              color: SECONDARY[300],
            },
            "& .rdrDayInPreview": {
              border: "none",
            },
            "& .rdrDayEndPreview": {
              border: "none",
            },
          }}
        >
          <DateRangePicker
            ranges={selectionRange}
            onChange={(item) => handleChange(item)}
            // showSelectionPreview={true}
            months={2}
            direction="horizontal"
            staticRanges={staticRanges}
            inputRanges={[]}
            // editableDateInputs={true}
            renderStaticRangeLabel={(range: StaticRange) => {
              return (
                <Typography variant="subtitle2" color={SECONDARY[400]}>
                  {range.label}
                </Typography>
              );
            }}
            showPreview={false}
            showDateDisplay={false}
            rangeColors={["rgba(53, 81, 81, 1)"]}
            color="red"
            maxDate={new Date()}
          />
          <Stack
            direction={"row"}
            alignItems={"center"}
            sx={{
              // borderTop: `1px solid ${NEUTRAL[200]}`,
              width: "100%",
            }}
          >
            <Box
              sx={{
                width: pxToRem(145),
                // backgroundColor: "red",
                height: "100%",
                padding: pxToRem(16),
                borderRight: `1px solid ${NEUTRAL[200]}`,
                borderTop: `1px solid ${NEUTRAL[200]}`,
              }}
            />
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
              sx={{
                borderTop: `1px solid ${NEUTRAL[200]}`,
                padding: pxToRem(16),
                gap: pxToRem(8),
                flex: 1,
                // height: pxToRem(72),
              }}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                gap={pxToRem(8)}
                className="a-date-range"
              >
                <Box
                  sx={dateBoxStyle}
                  component={"input"}
                  value={
                    !activateCustomRange
                      ? format(selectionRange[0].startDate, "MMM dd, yyyy")
                      : format(selectionRange[0].startDate, "yyyy-MM-dd")
                  }
                  disabled={!activateCustomRange}
                  onChange={(e) => {
                    const newStartDate = new Date(e.target.value);
                    if (!isNaN(newStartDate.getTime())) {
                      // Ensure valid date
                      setSelectionRange((prev: any) => [
                        {
                          ...prev[0], // Keep other properties unchanged
                          startDate: newStartDate,
                        },
                      ]);
                    }
                  }}
                  type={!activateCustomRange ? "text" : "date"}
                />

                <Divider
                  orientation="horizontal"
                  sx={{
                    width: pxToRem(16),
                    color: NEUTRAL[200],
                  }}
                />
                <Box
                  sx={dateBoxStyle}
                  component={"input"}
                  value={
                    !activateCustomRange
                      ? format(selectionRange[0].endDate, "MMM dd, yyyy")
                      : format(selectionRange[0].endDate, "yyyy-MM-dd")
                  }
                  disabled={!activateCustomRange}
                  onChange={(e) => {
                    const newEndDate = new Date(e.target.value);
                    if (!isNaN(newEndDate.getTime())) {
                      // Ensure valid date
                      setSelectionRange((prev: any) => [
                        {
                          ...prev[0], // Keep other properties unchanged
                          endDate: newEndDate,
                        },
                      ]);
                    }
                  }}
                  type={!activateCustomRange ? "text" : "date"}
                />
              </Stack>
              <Stack direction={"row"} alignItems={"center"} gap={pxToRem(8)}>
                <Button
                  onClick={handleCancel}
                  sx={{
                    height: pxToRem(40),
                    width: pxToRem(86),
                    bgcolor: NEUTRAL[0],
                    border: `1px solid ${NEUTRAL[200]}`,
                    fontSize: pxToRem(16),
                    color: SECONDARY[300],
                    "&:hover": {
                      bgcolor: PRIMARY[25],
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  sx={{
                    height: pxToRem(40),
                    width: pxToRem(86),
                  }}
                  onClick={() =>
                    onDateRangeChange([
                      selectionRange[0].startDate,
                      selectionRange[0].endDate,
                    ])
                  }
                >
                  Apply
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
