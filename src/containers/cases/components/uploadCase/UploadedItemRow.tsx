import { IconContainer } from "@/components/IconContainer";
import { NEUTRAL, SECONDARY, SUCCESS, pxToRem } from "@/theme";
import { Stack, Typography } from "@mui/material";
import { CloseIcon } from "../svgs/CloseIcon";
import { DeleteIcon } from "../svgs/DeleteIcon";
import { PdfIcon } from "../svgs/PdfIcon";

export default function UploadedItemRow({
  state,
  progress,
  fileName,
  removeFromList,
}: {
  state: "uploading" | "list";
  progress: number;
  fileName: string;
  removeFromList: () => void;
}) {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      borderRadius={pxToRem(16)}
      border={`1px solid ${NEUTRAL[200]}`}
      width={"100%"}
      padding={pxToRem(8)}
      pr={pxToRem(18)}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        gap={pxToRem(4)}
        width={"100%"}
      >
        <PdfIcon />
        <Stack gap={pxToRem(2)} width={"100%"}>
          <Typography
            variant="subtitle1"
            color={SECONDARY[400]}
            sx={{
              width: pxToRem(500),
              textTransform: "capitalize",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {fileName}
          </Typography>
          {state === "list" && (
            <Typography
              variant="subtitle1"
              color={SECONDARY[300]}
              fontSize={pxToRem(12)}
            >
              {/* Uploaded | 5mb */}
              Uploaded
            </Typography>
          )}
          {state === "uploading" && (
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={pxToRem(8)}
              pr={pxToRem(55)}
            >
              <Stack
                sx={{
                  width: "100%",
                  height: pxToRem(20),
                  //   backgroundColor: SUCCESS[400],
                  borderRadius: pxToRem(5),
                  border: `1px solid #ccc`,
                }}
              >
                <Stack
                  sx={{
                    width: `${progress}%`,
                    height: "100%",
                    backgroundColor: progress < 100 ? "#4caf50" : SUCCESS[400],
                    transition: "width 0.5s ease",
                  }}
                ></Stack>
              </Stack>

              <Typography variant="caption" color={SECONDARY[300]}>
                {progress}%
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
      {state === "list" && (
        <IconContainer tooltip="Delete" onClick={removeFromList}>
          <DeleteIcon />
        </IconContainer>
      )}
      {state === "uploading" && (
        <IconContainer tooltip="Cancel" onClick={removeFromList}>
          <CloseIcon />
        </IconContainer>
      )}
    </Stack>
  );
}
