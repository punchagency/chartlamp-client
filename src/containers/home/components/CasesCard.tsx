import Button from "@/components/Button";
import { NEUTRAL, SECONDARY, SUCCESS, pxToRem } from "@/theme";
import { Stack, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { UpTrendIcon } from "./svg/UpTrendIcon";

interface CaseCardProps {
  title: string;
  icon: React.ReactNode;
  buttonLink: string;
  buttonText: string;
  statNumber: string;
  percentageChange: string;
  onclick?: () => void;
}

export default function CasesCard({
  title,
  icon,
  percentageChange,
  statNumber,
  buttonText,
  buttonLink,
  onclick,
}: CaseCardProps) {
  const router = useRouter();

  const handleNavigation = () => {
    if (onclick) {
      onclick();
      return;
    }
    // console.log("Navigating to ", buttonLink);
    router.push(buttonLink);
  };

  return (
    <Stack
      sx={{
        width: "100%",
        minHeight: pxToRem(213),
        borderRadius: pxToRem(24),
        gap: pxToRem(16),
        padding: pxToRem(16),
        bgcolor: NEUTRAL[0],
        boxShadow: "0px 0px 10px rgba(5, 113, 112, 0.04)",
      }}
    >
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack gap={pxToRem(16)}>
          {icon}
          <Typography variant="subtitle1" color={SECONDARY[500]}>
            {title}
          </Typography>
        </Stack>
        <Button
          onClick={handleNavigation}
          sx={{
            height: pxToRem(36),
            padding: `${pxToRem(12)} ${pxToRem(16)} ${pxToRem(12)} ${pxToRem(
              16
            )}`, //
          }}
        >
          {buttonText}
        </Button>
      </Stack>
      <Stack gap={pxToRem(16)}>
        <Typography
          variant="body2"
          color={SECONDARY[500]}
          fontSize={pxToRem(40)}
          fontWeight={700}
        >
          {statNumber}
        </Typography>
        {/* <Stack direction={"row"} gap={pxToRem(4)}>
          <UpTrendIcon />
          <Typography variant="body2" color={SUCCESS[500]}>
            {percentageChange}
          </Typography>
          <Typography variant="body2" color={SECONDARY[200]}>
            vs last month
          </Typography>
        </Stack> */}
      </Stack>
    </Stack>
  );
}
