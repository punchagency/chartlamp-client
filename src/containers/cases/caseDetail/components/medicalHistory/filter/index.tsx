import FilterDrop from "@/containers/cases/components/FilterDrop";
import { DiseaseClass, OptionsType } from "@/interface";
import { pxToRem } from "@/theme";
import { getUniqueFileNames } from "@/utils/general";
import { Collapse, Grid } from "@mui/material";

export default function Filter({
  showFilter,
  bodyParts,
  providers,
  tags,
  hideBodyPart,
  handleSelect,
}: {
  showFilter: boolean;
  providers: string[];
  bodyParts: DiseaseClass[];
  tags: OptionsType[] | [];
  handleSelect: (fieldName: string, selectedVal: string) => void;
  hideBodyPart?: boolean;
}) {
  return (
    <Collapse in={showFilter}>
      <Grid
        container
        direction={"row"}
        alignItems={"center"}
        gap={pxToRem(12)}
        sx={{
          py: pxToRem(20),
          px: pxToRem(16),
          borderBottom: `1px solid rgba(241, 243, 243, 1)`,
          maxHeight: { sm: pxToRem(82) },
        }}
      >
        {!hideBodyPart && (
          <FilterDrop
            title="Body part"
            options={getUniqueFileNames(bodyParts)?.map((item) => {
              return { label: item.fileName, value: item.fileId.trim() };
            })}
            handleSelect={(option) => handleSelect("bodyPart", option)}
          />
        )}
        <FilterDrop
          title="Tags"
          // options={["Claim Related", "Privileged", "Yet to be decided"]}
          options={tags}
          handleSelect={(option) => handleSelect("tag", option)}
        />
        <FilterDrop
          title="Provider"
          search={true}
          options={providers?.map((provider) => {
            return { label: provider, value: provider };
          })}
          handleSelect={(option) => handleSelect("provider", option)}
        />
        {/* <FilterDrop
          title="Documents"
          search={true}
          options={["MRI Report.pdf", "X-Ray Report.pdf", "Prescription.pdf"]}
        /> */}
      </Grid>
    </Collapse>
  );
}
