import { CustomImage } from "@/components/CustomImage";
import {
  CaseDetailEnum,
  MapViewEnum,
} from "@/containers/cases/caseDetail/constants";
import { NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { formatCurrencyToNumber } from "@/utils/general";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

function MostVisitedRow({
  name,
  caseNumber,
  amountSpent,
  isLast,
  profilePicture,
  onClick,
}: {
  name: string;
  caseNumber: string;
  amountSpent: string;
  profilePicture: string;
  isLast: boolean;
  onClick: () => void;
}) {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      onClick={onClick}
      //   justifyContent={"space-between"}
      minHeight={pxToRem(66)}
      sx={{
        p: pxToRem(8),
        borderRadius: pxToRem(16),
        ":hover": {
          backgroundColor: PRIMARY[25],
          cursor: "pointer",
        },
      }}
    >
      <Stack gap={pxToRem(6)} direction={"row"} alignItems={"center"} flex={1}>
        <CustomImage
          src={profilePicture || "/images/userHeader.png"}
          wrapperSx={{
            height: pxToRem(44),
            width: pxToRem(44),
            "& img": {
              borderRadius: "50%",
            },
          }}
        />
        <Stack gap={pxToRem(4)}>
          <Typography variant="h5" color={SECONDARY[400]}>
            {name}
          </Typography>
          <Typography variant="body1" color={SECONDARY[400]} fontWeight={500}>
            {`Case Number: ${caseNumber}`}
          </Typography>
        </Stack>
      </Stack>
      <Stack gap={pxToRem(4)} width={pxToRem(130)}>
        <Typography
          variant="subtitle2"
          fontSize={pxToRem(12)}
          color={SECONDARY[400]}
        >
          Amount Spent
        </Typography>
        <Typography
          variant="subtitle1"
          color={SECONDARY[400]}
          fontWeight={700}
          fontSize={pxToRem(23)}
        >
          ${amountSpent}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default function FavoriteCases({
  favoriteCases,
}: {
  favoriteCases: any[];
}) {
  const router = useRouter();
  return (
    <Stack
      sx={{
        padding: pxToRem(16),
        gap: pxToRem(16),
        width: "100%",
        borderRadius: pxToRem(24),
        bgcolor: NEUTRAL[0],
        boxShadow: "0px 0px 10px rgba(5, 113, 112, 0.04)",
      }}
    >
      <Stack gap={pxToRem(16)}>
        <Stack direction={"row"} minHeight={pxToRem(35)} padding={pxToRem(8)}>
          <Typography variant="h5" color={SECONDARY[500]}>
            Favorite Cases
          </Typography>
        </Stack>
        <Stack gap={pxToRem(8)}>
          {favoriteCases?.map((item, index) => (
            <MostVisitedRow
              {...item}
              name={item.userDetails.name}
              profilePicture={item.userDetails.profilePicture}
              caseNumber={item.caseNumber}
              amountSpent={item.reports
                ?.reduce(
                  (acc: number, report: any) =>
                    acc + formatCurrencyToNumber(report.amountSpent),
                  0
                )
                .toLocaleString()}
              key={index}
              isLast={favoriteCases.length - 1 === index}
              onClick={() =>
                router.push(
                  `/dashboard/case/${item._id}/${CaseDetailEnum.medicalHistory}?view=${MapViewEnum.detailsView}`
                )
              }
            />
          ))}
        </Stack>

        {!Boolean(favoriteCases?.length) && (
          <Stack
            sx={{
              width: "100%",
              height: "100%",
              minHeight: 150,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Stack>
              <Typography variant="h6" color={SECONDARY[400]}>
                No data available
              </Typography>
            </Stack>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
}
