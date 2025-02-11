import AnatomyView from "@/components/AnatomyView";
import Button from "@/components/Button";
import { CustomImage } from "@/components/CustomImage";
import {
  CaseDetailEnum,
  MapViewEnum,
} from "@/containers/cases/caseDetail/constants";
import { CaseDetail, ImageTypeTwo } from "@/interface";
import { NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { formatCurrencyToNumber } from "@/utils/general";
import { Divider, Grid, Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CaseIcon } from "../svg/CaseIcon";

export default function LastViewedCase({
  lastViewed,
}: {
  lastViewed: CaseDetail;
}) {
  const router = useRouter();
  const [imageList, setImageList] = useState<ImageTypeTwo[]>([]);

  const handleGetImageList = () => {
    if (!lastViewed) return;
    // console.log("lastViewed 1", lastViewed);
    const images = lastViewed.reports.flatMap((report) => {
      return report.classification.flatMap(
        (classification) => classification.images
      );
    });
    // console.log("lastViewed 2", images);
    setImageList(images);
  };

  useEffect(() => {
    handleGetImageList();
  }, [lastViewed]);

  return (
    <Stack
      sx={{
        borderRadius: pxToRem(15),
        gap: pxToRem(24),
        bgcolor: NEUTRAL[0],
        width: "100%",
        height: "100%",
        padding: pxToRem(16),
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Grid container>
          <Grid item xs={8}>
            <Stack gap={pxToRem(16)} direction={"row"} alignItems={"center"}>
              <CaseIcon fill1={SECONDARY[50]} fill2={NEUTRAL[800]} />
              <Typography variant="subtitle1" color={SECONDARY[0]}>
                Last Viewed Case
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={4} sx={{ textAlign: "right" }}>
            <Button
              sx={{
                height: pxToRem(36),
              }}
              onClick={() =>
                router.push(
                  `/dashboard/case/${lastViewed._id}/${CaseDetailEnum.medicalHistory}?view=${MapViewEnum.detailsView}`
                )
              }
            >
              View case
            </Button>
          </Grid>
        </Grid>
      </Stack>
      <Stack
        direction="row"
        sx={{
          // borderTop: `1px solid ${SECONDARY[100]}`,
          // borderBottom: `1px solid ${SECONDARY[100]}`,
          padding: pxToRem(16),
          borderRadius: pxToRem(16),
          bgcolor: SECONDARY[50],
        }}
      >
        <Stack pr={pxToRem(12)}>
          <CustomImage
            src={lastViewed?.user?.profilePicture || "/images/userHeader.png"}
            wrapperSx={{
              height: pxToRem(44),
              width: pxToRem(44),
              "& img": {
                borderRadius: "50%",
              },
            }}
          />
        </Stack>
        <Stack width="100%" gap={pxToRem(5)}>
          <Stack gap={pxToRem(4)}>
            <Typography variant="h5" color={SECONDARY[500]}>
              {lastViewed?.user?.name}
            </Typography>
            <Typography variant="body1" color={SECONDARY[500]}>
              Case Number: {lastViewed?.caseNumber}
            </Typography>
          </Stack>
          <Divider
            orientation="horizontal"
            sx={{
              //   width: pxToRem(375),
              color: SECONDARY[100],
            }}
          />
          <Stack
            direction="row"
            alignItems={"center"}
            justifyContent={"space-between"}
            gap={pxToRem(8)}
          >
            <Typography variant="subtitle2" color={SECONDARY[300]}>
              Amount Spent
            </Typography>
            <Typography
              variant="subtitle1"
              color={SECONDARY[300]}
              fontWeight={700}
              fontSize={pxToRem(23)}
            >
              $
              {lastViewed?.reports?.length
                ? lastViewed?.reports
                    ?.reduce(
                      (acc: number, report: any) =>
                        acc + formatCurrencyToNumber(report.amountSpent),
                      0
                    )
                    .toLocaleString()
                : 0}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        sx={{
          justifyContent: "center",
          alignItems: "center",
          borderRight: `1px solid ${NEUTRAL[900]}`,
          borderLeft: `1px solid ${NEUTRAL[900]}`,
          width: "100%",
          height: "100%",
          // bgcolor: "red",
        }}
      >
        <AnatomyView images={imageList} />
      </Stack>
    </Stack>
  );
}
