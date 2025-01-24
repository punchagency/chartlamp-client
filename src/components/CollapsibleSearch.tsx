import { CloseIcon } from "@/containers/cases/components/svgs/CloseIcon";
import { pxToRem } from "@/theme";
import { Collapse, Stack } from "@mui/material";
import { IconContainer } from "./IconContainer";
import SearchBoxWithIcon from "./SearchBoxWithIcon";
import { SearchIcon } from "./svgs/SearchIcon";

export default function CollapsibleSearch({
  open,
  placeholder,
  handleChange,
  onSearch,
}: {
  open: boolean;
  placeholder: string;
  handleChange: () => void;
  onSearch?: (val: string) => void;
}) {
  return (
    <Stack direction={"row"} alignItems={"center"} gap={pxToRem(8)}>
      <Collapse in={open} orientation="horizontal">
        <SearchBoxWithIcon
          inputProps={{
            placeholder,
            onChange: (e) => onSearch && onSearch(e.target.value),
          }}
        />
      </Collapse>
      {open ? (
        <>
          <IconContainer tooltip="Close" open={true} onClick={handleChange}>
            <CloseIcon />
          </IconContainer>
        </>
      ) : (
        <IconContainer tooltip="Search" onClick={handleChange}>
          <SearchIcon />
        </IconContainer>
      )}
    </Stack>
  );
}
