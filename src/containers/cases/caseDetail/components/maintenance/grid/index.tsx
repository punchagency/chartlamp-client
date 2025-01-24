"use client";

import { CustomImage } from "@/components/CustomImage";
import AppDialog from "@/components/DailogBox";
import { IconContainer } from "@/components/IconContainer";
import DeleteCase from "@/containers/cases/components/DeleteCase";
import { TableDataProps } from "@/interface";
import { NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { downloadFile } from "@/utils/general";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Box, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import * as PDFJSWorker from "pdfjs-dist/build/pdf.worker";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { MoreIcon } from "../../svg/MoreIcon";
import { useMaintenance } from "../hooks";
import DocumentModal from "./DocumentModal";

pdfjs.GlobalWorkerOptions.workerSrc = PDFJSWorker;

interface GridProps {
  maintenanceData: TableDataProps[];
  loading: boolean;
}

const GridCard = ({
  id,
  name,
  uploadedBy,
  dateUploaded,
  size,
  url,
  handleSelect,
  downloadFile,
  handleDelete,
}: any) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const handleSelectOption = (option: string) => {
    if (option === "Download") {
      downloadFile(url);
    }
    if (option === "Delete") {
      handleDelete(id);
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Stack
        sx={{
          borderRadius: pxToRem(16),
          border: `1px solid rgba(221, 225, 225, 1)`,
          width: "fit-content",
          position: "relative",
        }}
      >
        {open && (
          <Stack
            sx={{
              background: NEUTRAL[0],
              boxShadow: "0px 0px 20px rgba(23, 26, 28, 0.08)",
              borderRadius: pxToRem(16),
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: pxToRem(8),
              gap: pxToRem(4),
              position: "absolute",
              top: pxToRem(8),
              right: pxToRem(8),
              zIndex: 30,
              width: pxToRem(172),
              minWidth: "max-content",
            }}
          >
            {["Download", "Share", "Delete"].map((option: string, index) => (
              <Stack
                key={index}
                onClick={() => handleSelectOption(option)}
                width="100%"
                // height={pxToRem(32)}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    padding: `${pxToRem(8)} ${pxToRem(16)}`,
                    height: pxToRem(32),
                    borderRadius: pxToRem(10),
                    color: SECONDARY[300],
                    ":hover": {
                      background: PRIMARY[25],
                      borderRadius: pxToRem(10),
                      cursor: "pointer",
                      color: SECONDARY[400],
                    },
                    "&.active": {
                      background: PRIMARY[25],
                      color: SECONDARY[400],
                    },
                  }}
                >
                  <Typography variant="subtitle1" color="inherit">
                    {option}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        )}
        <Stack
          alignItems={"center"}
          direction={"row"}
          justifyContent={"space-between"}
          sx={{
            padding: pxToRem(16),
            borderTopLeftRadius: pxToRem(16),
            borderTopRightRadius: pxToRem(16),
            maxHeight: pxToRem(56),
          }}
        >
          <Typography
            variant={"h3"}
            sx={{
              maxWidth: pxToRem(200),
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {name}
          </Typography>
          <IconContainer
            tooltip="More"
            sx={{ "&:hover": { background: "transparent" } }}
            onClick={handleClick}
          >
            <MoreIcon />
          </IconContainer>
        </Stack>
        <Stack
          onClick={() => handleSelect(url)}
          sx={{
            position: "relative",
            height: pxToRem(200),
            width: pxToRem(373),
            overflow: "hidden",
            cursor: "pointer",
          }}
        >
          {/* <CustomImage
            src="/images/pdf_sample.png"
            wrapperSx={{
              height: pxToRem(200),
              width: pxToRem(373),
            }}
          /> */}
          <Stack
            sx={{
              position: "absolute",
              zIndex: 10,
              background:
                "linear-gradient(0deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.03))",
              // background: "red",
              "&:hover": {
                background:
                  "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))",
              },
              height: pxToRem(200),
              width: pxToRem(373),
            }}
          ></Stack>

          <Document file={url}>
            <Page
              pageNumber={1}
              height={10}
              width={280}
              className={"pdf-viewer-page"}
            />
          </Document>
        </Stack>
        <Stack
          alignItems={"center"}
          direction={"row"}
          sx={{
            padding: pxToRem(16),
            borderBottomLeftRadius: pxToRem(16),
            borderBottomRightRadius: pxToRem(16),
            maxHeight: pxToRem(69),
          }}
        >
          <Stack gap={pxToRem(8)} direction={"row"} alignItems={"center"}>
            <CustomImage
              src="/images/userHeader.png"
              wrapperSx={{
                height: pxToRem(30),
                width: pxToRem(30),
              }}
            />
            <Stack gap={pxToRem(2)}>
              <Typography variant="subtitle1" color={SECONDARY[400]}>
                {uploadedBy}
              </Typography>
              <Typography variant="caption" color={SECONDARY[200]}>
                {format(new Date(dateUploaded), "dd MMM, yyyy")}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </ClickAwayListener>
  );
};

export default function MaintenanceGridView({
  maintenanceData,
  loading,
}: GridProps) {
  const { loading: deleteLoading, deleteFile } = useMaintenance();
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>();

  return (
    <>
      <Stack
        direction={"row"}
        sx={{
          padding: pxToRem(24),
          gap: pxToRem(24),
          flexWrap: "wrap",
        }}
      >
        {maintenanceData.map((row, index) => (
          <GridCard
            key={index}
            {...row}
            handleSelect={(url: string) => {
              setSelectedUrl(url);
              setOpen(true);
            }}
            downloadFile={() => downloadFile(row.url, row.name)}
            handleDelete={(id: string) => {
              setSelectedDocumentId(id);
              setOpenDelete(true);
            }}
          />
        ))}
        {(!Boolean(maintenanceData?.length) || loading) && (
          <Stack
            sx={{
              width: "100%",
              height: "100%",
              minHeight: "65vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!loading ? (
              <Stack>
                <Typography variant="h6" color={SECONDARY[400]}>
                  No data available, please check back later
                </Typography>
              </Stack>
            ) : (
              <Stack>
                <Typography variant="h6" color={SECONDARY[400]}>
                  Loading...
                </Typography>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
      <AppDialog open={open} onClose={() => setOpen(false)}>
        <DocumentModal onClose={() => setOpen(false)} url={selectedUrl} />
      </AppDialog>
      <AppDialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DeleteCase
          onClose={() => setOpenDelete(false)}
          onDelete={async () => {
            if (selectedDocumentId) {
              await deleteFile(selectedDocumentId);
              setOpenDelete(false);
            }
          }}
          loading={deleteLoading}
        />
      </AppDialog>
    </>
  );
}
