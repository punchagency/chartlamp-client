import { PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { Tooltip } from "@mui/material";
import Slider, { SliderValueLabelProps } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

const PrettoSlider = styled(Slider)({
  color: SECONDARY[50],
  height: pxToRem(8),
  "& .MuiSlider-track": {
    border: "none",
    color: SECONDARY[50],
  },
  "& .MuiSlider-thumb": {
    height: pxToRem(20),
    width: pxToRem(20),
    backgroundColor: SECONDARY[400],
    border: "none",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-mark": {
    height: pxToRem(8),
    width: pxToRem(8),
    backgroundColor: PRIMARY[500],
    borderRadius: "50%",
  },
});

function ValueLabelComponent(props: SliderValueLabelProps) {
  const { children, value } = props;

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value} arrow>
      {children}
    </Tooltip>
  );
}

const AppSlider = ({
  handleSliderChange,
  marks,
  sliderValue,
}: {
  marks: { value: number }[];
  sliderValue: number;
  handleSliderChange: (event: any, value: any) => void;
}) => {
  return (
    <PrettoSlider
      valueLabelDisplay="on"
      aria-label="pretto slider"
      value={sliderValue}
      marks={marks}
      step={null}
      track={false}
      min={marks[0].value}
      max={marks[marks.length - 1].value}
      onChange={handleSliderChange}
      slots={{
        valueLabel: ValueLabelComponent,
      }}
    />
  );
};

export default AppSlider;
