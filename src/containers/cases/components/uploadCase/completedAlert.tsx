import Button from "@/components/Button";
import { UserAvatar } from "@/components/UserAvatar";
import useUpdateParams from "@/hooks/useUpdateParams";
import { CaseDetail } from "@/interface";
import axiosInstance, { endpoints } from "@/lib/axios";
import { NEUTRAL, SECONDARY, SUCCESS, pxToRem } from "@/theme";
import { CronStatus } from "@/types/case";
import { useReactiveVar } from "@apollo/client";
import { Stack, Typography } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { progressModalVar } from "../../caseDetail/state";

export default function CompletedAlert() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeCaseId, setActiveCaseId] = useState(
    searchParams.get("activeCaseId") || localStorage.getItem("activeCaseId")
  );
  const minProgressModal = searchParams.get("bg") === "true";

  const progressModalState = useReactiveVar(progressModalVar);
  const { reloadParams } = useUpdateParams();

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [completed, setCompleted] = useState(false);

  const [activeCaseDetails, setActiveCaseDetails] = useState<CaseDetail | null>(
    null
  );

  const clearActiveCaseId = () => {
    localStorage.removeItem("activeCaseId");
  };

  const getCaseExtractionStatus = async () => {
    if (!activeCaseId) return;
    const response = await axiosInstance.get(
      `${endpoints.case.detail}/${activeCaseId}/status`
    );
    if (response.data) {
      if (
        response.data &&
        response.data._id &&
        response.data.percentageCompletion === 100
      ) {
        // handleNavigateToDetails(response.data._id);
        setActiveCaseDetails(response.data);
        setCompleted(true);
        clearActiveCaseId();
      } else {
        setCompleted(false);
        setActiveCaseDetails(response.data);
      }
    }
  };

  const handleNavigateToDetails = (id: string) => {
    clearActiveCaseId();
    router.push(`/dashboard/case/${id}/medicalHistory?view=mapView`);
  };

  const percentageCompletion = useMemo(() => {
    return activeCaseDetails ? activeCaseDetails.percentageCompletion : 0;
  }, [activeCaseDetails]);

  useEffect(() => {
    setActiveCaseId(
      searchParams.get("activeCaseId") || localStorage.getItem("activeCaseId")
    );
  }, [searchParams]);

  useEffect(() => {
    console.log({ activeCaseId, completed });

    if (!activeCaseId || completed) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current); // Ensure previous interval is cleared
    }

    intervalRef.current = setInterval(() => {
      console.log("activeCaseDetails", activeCaseDetails);
      if (
        activeCaseDetails &&
        activeCaseDetails.cronStatus !== CronStatus.Processed
      ) {
        getCaseExtractionStatus();
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeCaseId, completed, activeCaseDetails]);

  useEffect(() => {
    if (activeCaseId) {
      getCaseExtractionStatus();
    }
  }, [activeCaseId]);

  useEffect(() => {
    console.log("reload", {
      activeCaseDetails,
      activeCaseId,
      progressModalState,
    });
    const updateParams = async () => {
      if (
        activeCaseId &&
        activeCaseDetails &&
        activeCaseDetails.percentageCompletion !== 100 &&
        !progressModalState
      ) {
        reloadParams({ bg: true, activeCaseId });
      } else if (activeCaseDetails?.percentageCompletion === 100) {
        // reloadParams({ bg: null, activeCaseId: null });
      }
    };

    updateParams();
  }, [pathname, activeCaseDetails, activeCaseId, progressModalState]);

  return (
    <Stack
      sx={{
        visibility:
          activeCaseId &&
          minProgressModal &&
          !pathname.includes("dashboard/case/")
            ? "visible"
            : "hidden",
      }}
    >
      {activeCaseDetails && (
        <>
          {!completed ? (
            <Stack
              sx={{
                flexDirection: "column",
                width: pxToRem(434),
                // height: pxToRem(141),
                borderRadius: pxToRem(24),
                padding: pxToRem(16),
                gap: pxToRem(16),
                position: "fixed",
                bottom: pxToRem(44),
                right: pxToRem(31),
                bgcolor: "#fff",
                boxShadow: "0px 0px 30px 0px rgba(23, 26, 28, 0.15)",
              }}
            >
              <Typography
                variant="subtitle1"
                color={SECONDARY[400]}
                fontWeight={700}
                fontSize={pxToRem(19)}
              >
                Scrapping information...
              </Typography>
              <Stack direction={"row"} alignItems={"center"} gap={pxToRem(8)}>
                <Stack
                  sx={{
                    width: "100%",
                    height: pxToRem(4),
                    borderRadius: pxToRem(30),
                    bgcolor: "rgba(221, 225, 225, 1)",
                  }}
                >
                  <Stack
                    sx={{
                      width: `${percentageCompletion}%`,
                      height: pxToRem(4),
                      borderRadius: pxToRem(30),
                      bgcolor: SUCCESS[500],
                    }}
                  ></Stack>
                </Stack>
                <Typography
                  variant="subtitle2"
                  color={SECONDARY[400]}
                  fontSize={pxToRem(12)}
                >
                  {percentageCompletion}%
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <Stack
              width={pxToRem(402)}
              borderRadius={pxToRem(24)}
              // bgcolor={"red"}
              sx={{
                position: "fixed",
                bottom: pxToRem(34),
                right: pxToRem(31),
                bgcolor: "#fff",
                boxShadow: "0px 0px 30px 0px rgba(23, 26, 28, 0.15)",
              }}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                padding={pxToRem(12)}
                borderBottom={`1px solid ${NEUTRAL[100]}`}
              >
                <Typography
                  variant="subtitle1"
                  color={SECONDARY[400]}
                  fontWeight={700}
                  fontSize={pxToRem(16)}
                >
                  Information Scrapped
                </Typography>
                <Button
                  onClick={() => handleNavigateToDetails(activeCaseDetails._id)}
                >
                  Go to case
                </Button>
              </Stack>
              <Stack p={pxToRem(16)}>
                {activeCaseDetails && (
                  <UserAvatar
                    title={activeCaseDetails?.plaintiff}
                    subtitle={`Case Number: ${activeCaseDetails?.caseNumber}`}
                    img={""}
                  />
                )}
              </Stack>
              {/* <Stack sx={{ height: pxToRem(326) }}></Stack> */}
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
}
