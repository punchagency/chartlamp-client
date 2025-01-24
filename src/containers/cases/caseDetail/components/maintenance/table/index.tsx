import { CustomImage } from "@/components/CustomImage";
import AppDialog from "@/components/DailogBox";
import { IconContainer } from "@/components/IconContainer";
import ShareIcon from "@/components/svgs/ShareIcon";
import DeleteCase from "@/containers/cases/components/DeleteCase";
import { DeleteIcon } from "@/containers/cases/components/svgs/DeleteIcon";
import { TableDataProps } from "@/interface";
import { NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { Stack, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
// import Paper from "@mui/material/Paper";
import { downloadFile } from "@/utils/general";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DownloadIcon } from "../../svg/DownloadIcon";
import { PdfIcon } from "../../svg/PdfIcon";
import { useMaintenance } from "../hooks";

interface TableProps {
  maintenanceData: TableDataProps[];
  loading: boolean;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: PRIMARY[400],
    color: SECONDARY[500],
    fontWeight: 700,
    fontSize: pxToRem(16),
  },
  [`&.${tableCellClasses.body}`]: {
    color: SECONDARY[400],
    fontWeight: 500,
    fontSize: pxToRem(16),
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  borderBottom: SECONDARY[300],
  "&:hover": {
    backgroundColor: PRIMARY[25],
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const actionStyles = {
  margin: "auto",
  "&:hover": {
    background: NEUTRAL[0],
    borderRadius: pxToRem(12),
    cursor: "pointer",
  },
};

enum OpenEnums {
  upload = "upload",
  delete = "delete",
  filter = "filter",
}

export default function MaintenanceTable({ maintenanceData, loading }: TableProps) {
  const searchParams = useSearchParams();
  const { loading: deleteLoading, deleteFile } = useMaintenance();
  const defaultUpload = searchParams.get("upload") === "true";
  const [selectedDocumentId, setSelectedDocumentId] = useState<string>();

  const [open, setOpen] = useState({
    upload: defaultUpload || false,
    delete: false,
    filter: false,
  });

  const [tableData, setTableData] = useState(maintenanceData);

  useEffect(() => {
    setTableData(maintenanceData);
  }, [maintenanceData]);

  const rows = useMemo(() => {
    return tableData.map(({ name, uploadedBy, dateUploaded, size, url, id }) => {
      return {
     id, name, uploadedBy, dateUploaded, size, url
      };
    });
  }, [tableData]);

  const handleClickOpen = (view: OpenEnums) => {
    setOpen((prev) => ({ ...prev, [view]: !prev[view] }));
  };

  const handleClose = (view: OpenEnums) => {
    setOpen((prev) => ({ ...prev, [view]: false }));
  };

  return (
    <Stack
      flex={1}
      bgcolor={NEUTRAL[0]}
      sx={{
        borderRadius: pxToRem(24),
      }}
    >
      <TableContainer>
        <Table
          sx={{ minWidth: { xs: "100%", sm: 700 } }}
          aria-label="customized table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell
                align="center"
                sx={{ display: { xs: "none", sm: "table-cell" } }}
              >
                Uploaded by
              </StyledTableCell>
              <StyledTableCell
                align="center"
                sx={{ display: { xs: "none", sm: "table-cell" } }}
              >
                Date Uploaded
              </StyledTableCell>
              <StyledTableCell align="center">Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">
                  <Stack
                    gap={pxToRem(16)}
                    direction={"row"}
                    alignItems={"center"}
                  >
                    <PdfIcon />
                    <Stack gap={pxToRem(4)}>
                      <Typography variant="h5" color={SECONDARY[400]}>
                        {row.name}
                      </Typography>
                      <Typography variant="caption" color={SECONDARY[300]}>
                        {row.size}
                      </Typography>
                    </Stack>
                  </Stack>
                </StyledTableCell>

                <StyledTableCell
                  align="center"
                  sx={{
                    "& div": { margin: "0" },
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  <Stack
                    gap={pxToRem(8)}
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <CustomImage
                      src="/images/userHeader.png"
                      wrapperSx={{
                        height: pxToRem(30),
                        width: pxToRem(30),
                      }}
                    />
                    <Typography variant="body1" color={SECONDARY[400]}>
                      {row.uploadedBy}
                    </Typography>
                  </Stack>
                </StyledTableCell>

                <StyledTableCell
                  align="center"
                  sx={{
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  <Typography variant="body1" color={SECONDARY[400]}>
                    {moment(row.dateUploaded).format("MMMM Do YYYY")}
                  </Typography>
                </StyledTableCell>

                <StyledTableCell
                  align="center"
                  sx={{ "& div": { margin: "0" } }}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    gap={pxToRem(8)}
                  >
                    <IconContainer
                      tooltip="Download"
                      sx={actionStyles}
                      onClick={() => downloadFile(row.url, row.name)}
                    >
                      <DownloadIcon />
                    </IconContainer>
                    <IconContainer tooltip="Share" sx={actionStyles}>
                      <ShareIcon />
                    </IconContainer>
                    <IconContainer
                      tooltip="Delete"
                      sx={actionStyles}
                      onClick={() => {
                        setSelectedDocumentId(row.id);
                        handleClickOpen(OpenEnums.delete);
                      }}
                    >
                      <DeleteIcon />
                    </IconContainer>
                  </Stack>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {(!Boolean(rows?.length) || loading) && (
        <Stack
          sx={{
            width: "100%",
            height: "100%",
            minHeight: '65vh',
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
      <AppDialog
        open={open.delete}
        onClose={() => handleClose(OpenEnums.delete)}
      >
        <DeleteCase
          onClose={() => handleClose(OpenEnums.delete)}
          onDelete={async () => {
            if (selectedDocumentId) {
              await deleteFile(selectedDocumentId);
              handleClose(OpenEnums.delete);
            }
          }}
          loading={deleteLoading}
        />
      </AppDialog>
    </Stack>
  );
}