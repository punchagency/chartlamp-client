import { StatusFilter } from "@/containers/cases/constants";
import { pxToRem } from "@/theme";
import { Stack } from "@mui/material";
import FilterDrop from "../../FilterDrop";

export default function Filter({
  handleSelectFilter,
}: {
  handleSelectFilter: (fieldName: string, val: string) => void;
}) {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={pxToRem(12)}
      sx={{
        py: pxToRem(20),
        px: pxToRem(16),
        borderTop: `1px solid rgba(241, 243, 243, 1)`,
        maxHeight: pxToRem(82),
      }}
    >
      <FilterDrop
        title="Claim Status"
        isClaimStatus={true}
        options={StatusFilter}
        handleSelect={(val) => handleSelectFilter("claimStatus", val)}
      />
      <FilterDrop
        title="Action Required"
        options={
          [
            // "Intake Process", "Conduction Review", "Sending to SIU"
          ]
        }
        handleSelect={() => ""}
      />
      <FilterDrop
        title="Date of Claim"
        options={
          [
            // "Intake Process", "Conduction Review", "Sending to SIU"
          ]
        }
        handleSelect={() => ""}
      />
    </Stack>
  );
}
