"use client";
import Button from "@/components/Button";
import { IconContainer } from "@/components/IconContainer";
import { CloseModalIcon } from "@/components/svgs/CloseModalIcon";
import { NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { Box, Stack, Typography } from "@mui/material";
import { useCaseUpload } from "../../hooks/useCaseUpload";
import { DropAddIcon } from "../svgs/DropAddIcon";
import { InfoIcon } from "../svgs/InfoIcon";
import UploadedItemRow from "./UploadedItemRow";
import { filePath } from "@/utils/s3";

// if input
// /* Neutral/100 */
// background: #F1F3F3;
// /* Neutral/200 */
// border: 1px solid #DDE1E1;

const inputStyle = {
  border: `1px solid rgba(201, 206, 206, 1)`,
  width: "100%",
  paddingLeft: pxToRem(15),
  height: pxToRem(48),
  borderRadius: pxToRem(16),
  outline: "none",
  fontSize: pxToRem(16),
  fontWeight: 600,
  color: "#355151",
  "&:hover": {
    background: NEUTRAL[50],
    borderColor: `${NEUTRAL[300]}`,
  },
  "&:focus": {
    background: NEUTRAL[0],
    border: `2px solid ${NEUTRAL[400]}`,
  },
  "&::placeholder": {
    color: "#CCD4D3",
    fontSize: pxToRem(16),
    fontWeight: 500,
  },
};

export default function UploadcaseModal({
  onClose,
  plaintiff,
  caseNumber,
  caseId,
  callBkFn,
}: {
  onClose: () => void;
  plaintiff?: string;
  caseNumber?: string;
  caseId?: string;
  callBkFn?: () => void;
}) {
  const {
    formik,
    getRootProps,
    getInputProps,
    isDragActive,
    files,
    progress,
    getFileName,
    isSubmitting,
    currentIndex,
    isUploaded,
    attachments,
    removeFromList,
  } = useCaseUpload({ onClose, plaintiff, caseNumber, caseId, callBkFn });

  return (
    <Stack
      sx={{
        maxHeight: pxToRem(950),
        // backgroundColor: "red",
        minWidth: pxToRem(950),
        padding: pxToRem(24),
        gap: pxToRem(25),
        position: "relative",
        // overflowY: "auto",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none", // IE and Edge
        "scrollbar-width": "none", // Firefox
      }}
    >
      <Stack direction={"row"} alignItems={"center"}>
        <Stack gap={pxToRem(5)}>
          <Typography
            variant="subtitle1"
            color={SECONDARY[500]}
            fontWeight={700}
            fontSize={pxToRem(28)}
          >
            File Upload
          </Typography>
          <Typography variant="body1" color={SECONDARY[300]}>
            Upload your document or drag and drop it here.
          </Typography>
        </Stack>
      </Stack>
      <Stack alignItems={"center"} height={"100%"}>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: pxToRem(25),
            width: "100%",
            height: "100%",
          }}
          onSubmit={formik.handleSubmit}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            gap={pxToRem(16)}
            width={"100%"}
            // sx={{ color: NEUTRAL[400] }}
          >
            <input
              placeholder="Plaintiff"
              style={inputStyle}
              id="plaintiff"
              name="plaintiff"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.plaintiff}
              disabled={Boolean(caseId)}
            />
            <input
              placeholder="1458-CDAD"
              id="caseNumber"
              name="caseNumber"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.caseNumber}
              style={inputStyle}
              disabled={Boolean(caseId)}
            />
          </Stack>

          <Box
            component="div"
            {...getRootProps()}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `1px dashed ${NEUTRAL[200]}`,
              height: "100%",
              minHeight: files.length ? pxToRem(290) : pxToRem(436),
              width: "100%",
              borderRadius: pxToRem(30),
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here ...</p>
            ) : (
              <Stack
                gap={pxToRem(16)}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <DropAddIcon />
                <Typography variant="subtitle1" color={SECONDARY[300]}>
                  Drag & Drop or Click to Choose
                </Typography>
                <Stack direction={"row"} alignItems={"center"} gap={pxToRem(8)}>
                  <InfoIcon />
                  <Typography variant="subtitle2" color={SECONDARY[200]}>
                    PDF, Tiff Files, Max File Size : 200MB
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Box>
          <Stack gap={pxToRem(8)} width={"100%"}>
            {Boolean(files.length) && (
              <Stack gap={pxToRem(8)} width={"100%"}>
                {files.map((item, index) => (
                  <UploadedItemRow
                    key={index}
                    progress={currentIndex === index ? progress : 0}
                    fileName={getFileName(item)}
                    state={
                      !attachments.includes(filePath(item)) ? "uploading" : "uploaded"
                    }
                    removeFromList={() => removeFromList(index)}
                  />
                ))}
              </Stack>
            )}
          </Stack>

          <Button type="submit">
            {isSubmitting ? "Uploading..." : "Submit"}
          </Button>
        </form>
      </Stack>
      <IconContainer
        tooltip="Close"
        onClick={onClose}
        sx={{
          position: "absolute",
          top: pxToRem(24),
          right: pxToRem(24),
        }}
      >
        <CloseModalIcon />
      </IconContainer>
    </Stack>
  );
}
