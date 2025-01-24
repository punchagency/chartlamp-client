import { CloseModalIcon } from "@/components/svgs/CloseModalIcon";
import { SECONDARY, pxToRem } from "@/theme";
import NavigatePrevIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, IconButton, Stack } from "@mui/material";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import * as PDFJSWorker from "pdfjs-dist/build/pdf.worker";

pdfjs.GlobalWorkerOptions.workerSrc = PDFJSWorker;

const navStyle = {
  cursor: "pointer",
  height: pxToRem(36.8),
  width: pxToRem(36.8),
  borderRadius: "50%",
  background: SECONDARY[500],
  padding: pxToRem(6.4),
  display: "flex",
  alignItems: "center",
    justifyContent: "center",
  zIndex: 31
};

export default function DocumentModal({
  onClose,
  url,
}: {
  onClose: () => void;
  url: string;
}) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function handleNextPage() {
    if (!numPages) return;
    setPageNumber((prev) => (prev < numPages ? prev + 1 : prev));
  }

  function handlePrevPage() {
    setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
  }

  return (
    <Stack
      sx={{
        position: "relative",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Stack
        sx={{
          alignItems: "center",
          height: "100vh",
          // minWidth: pxToRem(700),
          overflowY: "scroll",
          overflowX: "scroll",
          "&::-webkit-scrollbar": {
            width: pxToRem(8),
          },
        }}
      >
        <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
          <Page
            pageNumber={pageNumber}
            className={"pdf-viewer-page"}
            scale={1}
          />
        </Document>
      </Stack>
      {numPages && Boolean(numPages > 1) && (
        <Box
          onClick={onClose}
          sx={{
            cursor: "pointer",
            height: pxToRem(36.8),
            // width: pxToRem(36.8),
            borderRadius: pxToRem(8),
            background: SECONDARY[500],
            padding: pxToRem(6.4),
            position: "absolute",
            top: pxToRem(16),
            left: pxToRem(16),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            opacity: 0.8,
          }}
        >
          {pageNumber} of {numPages}
        </Box>
      )}
      <Box
        onClick={onClose}
        sx={{
          cursor: "pointer",
          height: pxToRem(36.8),
          width: pxToRem(36.8),
          borderRadius: pxToRem(8),
          background: SECONDARY[500],
          padding: pxToRem(6.4),
          position: "absolute",
          top: pxToRem(16),
          right: pxToRem(16),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 31,
        }}
      >
        <CloseModalIcon fill="#fff" />
      </Box>
      {numPages && Boolean(numPages > 1) && (
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
            position: "absolute",
            bottom: pxToRem(16),
            right: pxToRem(16),
            gap: pxToRem(16),
            alignItems: "center",
            width: "auto",
          }}
        >
          <Box onClick={handlePrevPage} sx={navStyle}>
            <NavigatePrevIcon
              sx={{
                color: "#fff",
              }}
            />
          </Box>
          <Box onClick={handleNextPage} sx={navStyle}>
            <NavigateNextIcon
              sx={{
                color: "#fff",
              }}
            />
          </Box>
        </Stack>
      )}
    </Stack>
  );
}
