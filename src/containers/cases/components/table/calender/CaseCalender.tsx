import Button from "@/components/Button";
import { IconContainer } from "@/components/IconContainer";
import { CloseModalIcon } from "@/components/svgs/CloseModalIcon";
import { NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Calendar } from "react-date-range";

export default function CaseCalender({
  onDateChange,
  onClose,
  selectedCaseNumber,
}: {
  onDateChange: (val: Date) => void;
  onClose: () => void;
  selectedCaseNumber: string;
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleChange = (item: any) => {
    setSelectedDate(item);
    onDateChange(item);
  };
  return (
    <Stack
      sx={
        {
          // width: pxToRem(527),
          // padding: pxToRem(20),
          // gap: pxToRem(32),
        }
      }
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        padding={pxToRem(20)}
        // height={pxToRem(64)}
      >
        <Stack gap={1}>
          <Typography
            color={SECONDARY[500]}
            fontWeight={700}
            fontSize={pxToRem(28)}
          >
            Target Completion
          </Typography>
          <Typography variant="body1" color={SECONDARY[300]}>
            Case Number: {selectedCaseNumber}
          </Typography>
        </Stack>
        <IconContainer tooltip="Close" onClick={onClose}>
          <CloseModalIcon />
        </IconContainer>
      </Stack>
      <Stack
        direction={"row"}
        sx={{
          borderTop: `1px solid ${NEUTRAL[200]}`,
          width: "100%",
        }}
      >
        <Stack
          sx={{
            width: "100%",
          }}
        >
          <Calendar
            onChange={(item) => handleChange(item)}
            date={selectedDate}
            minDate={new Date()}
          />
          <Stack
            direction={"row"}
            alignItems={"center"}
            sx={{
              // borderTop: `1px solid ${NEUTRAL[200]}`,
              width: "100%",
              display: "none",
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
                display: "none",
              }}
            >
              <Stack direction={"row"} alignItems={"center"} gap={pxToRem(8)}>
                <Button
                  //   onClick={handleCancel}
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
                  //   onClick={() =>
                  //     onDateRangeChange([
                  //       selectionRange[0].startDate,
                  //       selectionRange[0].endDate,
                  //     ])
                  //   }
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
