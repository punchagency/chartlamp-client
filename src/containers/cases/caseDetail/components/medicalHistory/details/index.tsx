import { CaseDetail, ImageType, ImageTypeTwo, OptionsType } from "@/interface";
import { SECONDARY } from "@/theme";
import { useReactiveVar } from "@apollo/client";
import { Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { showFilterVar } from "../../../state";
import TimeLineView from "../TimeLineView";
import HumanAnatomyView from "../anatomyView";
import Filter from "../filter";
import DetailsView from "./DetailsView";

interface MapViewProps {
  caseDetail: CaseDetail | null; // Replace 'any' with the actual type of 'caseData'
  view: string;
  bodyParts: any;
  providers: any;
  handleSelect: any;
  imageList: ImageType[];
  selectedCategory: string;
  handleFilterByCategory: any;
  mappingByCategory: { [key: string]: ImageTypeTwo[] };
  tagsArray: OptionsType[] | [];
}

export default function Details({
  caseDetail,
  view,
  bodyParts,
  providers,
  handleSelect,
  imageList,
  selectedCategory,
  handleFilterByCategory,
  mappingByCategory,
  tagsArray,
}: MapViewProps) {
  const router = useRouter();
  console.log("imageList-Details", imageList);
  const showFilter = useReactiveVar(showFilterVar);
  return (
    <>
      <Stack flex={1}>
        <Filter
          showFilter={showFilter}
          bodyParts={bodyParts}
          providers={providers}
          tags={tagsArray}
          handleSelect={handleSelect}
        />
        {caseDetail && caseDetail.reports && caseDetail.reports.length > 0 && (
          <>
            <Grid container flex={1}>
              <Grid item xs={12} sm={6}>
                <HumanAnatomyView
                  imageList={imageList}
                  caseId={caseDetail._id}
                  mappingByCategory={mappingByCategory}
                  handleFilterByCategory={handleFilterByCategory}
                  selectedCategory={selectedCategory}
                  onPartSelect={(path: string) => router.push(path)}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{
                  height: `calc(100vh - 112px - 180px)`,
                  overflowY: "scroll",
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  // [theme.breakpoints.down("lg")]: {
                  //   backgroundColor: "red",
                  // },
                }}
              >
                <DetailsView caseDetail={caseDetail} />
              </Grid>
            </Grid>
            <TimeLineView view={view} caseDetail={caseDetail} />
          </>
        )}
        {(!Boolean(caseDetail) ||
          !Boolean(caseDetail?.reports.length) ||
          !Boolean(caseDetail?.reports)) && (
          <Stack
            sx={{
              width: "100%",
              height: "100%",
              minHeight: "70vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Stack>
              <Typography variant="h6" color={SECONDARY[400]}>
                No data available.
              </Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
    </>
  );
}
