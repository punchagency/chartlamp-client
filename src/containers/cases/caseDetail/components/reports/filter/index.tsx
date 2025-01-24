import FilterDrop from "@/containers/cases/components/FilterDrop";
import { pxToRem } from "@/theme";
import { Collapse, Stack } from "@mui/material";

export default function Filter({ showFilter }: { showFilter: boolean }) {
  return (
    <Collapse in={showFilter}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={pxToRem(12)}
        sx={{
          py: pxToRem(20),
          px: pxToRem(16),
          borderBottom: `1px solid rgba(241, 243, 243, 1)`,
          maxHeight: pxToRem(82),
        }}
      >
        <FilterDrop
          title="ICD-Code"
          options={
            [
              // "ICD-10-CM Codes",
              // "ICD-10-PCS Codes",
              // "Legacy ICD-9-CM Codes",
            ]
          }
          handleSelect={() => ""}
        />
        <FilterDrop
          title="Group"
          options={[
            // "Head", "Shoulder", "Chest", "Chest", "Lower body"
          ]}
          handleSelect={() => ""}
        />
      </Stack>
    </Collapse>
  );
}
