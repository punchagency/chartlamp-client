import AnatomyView from "@/components/AnatomyView";
import { ImageType, ImageTypeTwo } from "@/interface";
import { NEUTRAL } from "@/theme";
import { Stack } from "@mui/material";

export default function HumanAnatomyView({
  imageList,
  caseId,
  mappingByCategory,
  selectedCategory,
  handleFilterByCategory,
  onPartSelect,
}: {
  imageList: ImageTypeTwo[];
  caseId: string;
  mappingByCategory: Record<string, ImageTypeTwo[]>;
  selectedCategory: string;
  handleFilterByCategory: (category: string) => void;
  onPartSelect: (image: ImageTypeTwo) => void;
}) {
  return (
    <Stack
      sx={{
        justifyContent: "center",
        alignItems: "center",
        borderRight: `1px solid ${NEUTRAL[900]}`,
        borderLeft: `1px solid ${NEUTRAL[900]}`,
        width: "100%",
        height: { xs: "50vh", sm: "100%" },
      }}
    >
      <AnatomyView
        images={imageList}
        caseId={caseId}
        mappingByCategory={mappingByCategory}
        handleFilterByCategory={handleFilterByCategory}
        selectedCategory={selectedCategory}
        onPartSelect={onPartSelect}
        hidePopUp={true}
      />
    </Stack>
  );
}
