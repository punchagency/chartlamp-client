import { NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { IconButton, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { SmallAddIcon } from "./svg/SmallAddIcon";
import { SmallCloseIcon } from "./svg/SmallCloseIcon";

export default function DiseaseTag({
  tag,
  savedTags,
  reportIndex,
  handleTagSelect,
}: {
  tag: {label: string, value: string};
  savedTags: string[];
  reportIndex: number;
  handleTagSelect: (isRemove: boolean) => void;
}) {
  const [selected, setSelected] = useState<string[] | []>([]);

  const handleSelect = (tag: string) => {
    if (selected.includes(tag as never)) {
      setSelected(selected.filter((item) => item !== tag));
      handleTagSelect(true);
    } else {
      setSelected([...selected, tag]);
      handleTagSelect(false);
    }
  };

  const isSelect = (tag: string) => {
    return selected?.includes(tag as never);
  };

  useEffect(() => {
    setSelected(savedTags);
  }, [savedTags]);

  return (
    <Stack
      onClick={() => handleSelect(tag.value as never)}
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: pxToRem(8),
        // justifyContent: "center",
        alignItems: "center",
        // minWidth: pxToRem(127),
        px: pxToRem(16),
        width: "fit-content",
        minWidth: 'fit-content',
        height: pxToRem(33),
        borderRadius: pxToRem(16),
        backgroundColor: isSelect(tag.value) ? NEUTRAL[200] : "#FFFFFF",
        border: `1px solid ${SECONDARY[200]}`,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: NEUTRAL[100],
        },
      }}
    >
      <Typography
        variant="subtitle2"
        color={isSelect(tag.value) ? SECONDARY[400] : SECONDARY[300]}
      >
        {tag.label}
      </Typography>
      {isSelect(tag.value) ? (
        <IconButton
        // onClick={(e) => {
        //   e.stopPropagation();
        //   handleTagSelect(true);
        // }}
        >
          <SmallCloseIcon />
        </IconButton>
      ) : (
        <IconButton
        // onClick={(e) => {
        //   e.stopPropagation();
        //   handleTagSelect(false);
        // }}
        >
          <SmallAddIcon />
        </IconButton>
      )}
    </Stack>
  );
}
