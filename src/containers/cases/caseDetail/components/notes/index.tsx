import { CustomImage } from "@/components/CustomImage";
import AppDialog from "@/components/DailogBox";
import { IconContainer } from "@/components/IconContainer";
import { DeleteIcon } from "@/components/drop-down/svgs/DeleteIcon";
import EditIcon from "@/components/drop-down/svgs/EditIcon";
import NotesModal from "@/containers/cases/components/notesModal";
import { CaseNote, NoteCellData } from "@/interface";
import { NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { Box, Stack, TableSortLabel, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import formatDistance from "date-fns/formatDistance";
import TopNav from "../TopNav";
import UseNotes from "./hooks";
import DeleteCase from "@/containers/cases/components/DeleteCase";

const actionStyles = {
  margin: "auto",
  "&:hover": {
    background: NEUTRAL[0],
    borderRadius: pxToRem(12),
    cursor: "pointer",
  },
};

interface Data {
  userNote: NoteCellData;
}

interface HeadCell {
  id: keyof Data;
  label: string;
  align: string;
  sx?: any;
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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const headCells: readonly HeadCell[] = [
  {
    id: "userNote",
    label: "Comments",
    align: "left",
  },
];

export default function NotesView({
  caseId,
  caseNotes,
  loadingCaseNotes,
}: {
  caseId: string;
  caseNotes: CaseNote[];
  loadingCaseNotes: boolean;
}) {
  const {
    order,
    orderBy,
    createSortHandler,
    visibleRows,
    handleEditNoteOpen,
    selectedCell,
    handleEditNote,
    setOpenEditModal,
    openEditModal,
    loadingCreateNote,
    openDeleteConfirmation,
    handleDeleteConfirmationModalChange,
    handleDeleteNote,
  } = UseNotes({
    caseNotes,
  });

  return (
    <Stack
      flex={1}
      bgcolor={NEUTRAL[0]}
      sx={{
        boxShadow: { xs: "none", sm: "0px 0px 10px rgba(5, 113, 112, 0.04)" },
        borderRadius: { xs: 0, sm: pxToRem(24) },
        height: "100%",
      }}
    >
      <TopNav />
      <Stack
        flex={1}
        bgcolor={NEUTRAL[0]}
        sx={{
          borderRadius: pxToRem(24),
        }}
      >
        <TableContainer
          sx={{
            height: "calc(100vh - 90px - 60px)",
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Table
            sx={{ minWidth: { xs: "100%", sm: 700 } }}
            aria-label="customized table"
          >
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <StyledTableCell
                    key={headCell.id}
                    align={headCell.align as any}
                    sortDirection={orderBy === headCell.id ? order : false}
                    sx={{ ...headCell?.sx }}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={createSortHandler(headCell.id)}
                    >
                      {headCell.label}
                      {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </StyledTableCell>
                ))}
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>
            {Boolean(caseNotes.length) && !loadingCaseNotes && (
              <TableBody>
                {visibleRows?.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      <Stack
                        gap={pxToRem(12)}
                        direction={"row"}
                        alignItems={"center"}
                      >
                        <CustomImage
                          src={row.userNote.userImg || "/images/userHeader.png"}
                          wrapperSx={{
                            height: pxToRem(30),
                            width: pxToRem(30),
                            "& img": {
                              borderRadius: "50%",
                            },
                          }}
                        />
                        <Stack gap={pxToRem(4)}>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            gap={pxToRem(8)}
                          >
                            <Typography
                              variant="h5"
                              sx={{
                                fontSize: pxToRem(16),
                              }}
                              color={SECONDARY[400]}
                            >
                              {row.userNote.userName}
                            </Typography>
                            <Typography
                              variant="caption"
                              color={SECONDARY[300]}
                            >
                              {formatDistance(
                                new Date(row.userNote.updatedAt),
                                new Date()
                              )}
                            </Typography>
                          </Stack>
                          <Typography variant="body1" color={SECONDARY[400]}>
                            {row.userNote.note}
                          </Typography>
                        </Stack>
                      </Stack>
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{ "& div": { margin: "auto", width: "fit-content" } }}
                    >
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        gap={pxToRem(18)}
                      >
                        <IconContainer
                          tooltip="Edit"
                          sx={actionStyles}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditNoteOpen(row.userNote);
                          }}
                        >
                          <EditIcon />
                        </IconContainer>
                        <IconContainer
                          tooltip="Delete"
                          sx={actionStyles}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteConfirmationModalChange(
                              true,
                              row.userNote.noteId
                            );
                          }}
                        >
                          <DeleteIcon />
                        </IconContainer>
                      </Stack>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            )}
          </Table>
          {(!Boolean(caseNotes.length) || loadingCaseNotes) && (
            <Stack
              sx={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!loadingCaseNotes ? (
                <Stack>
                  <Typography variant="h6" color={SECONDARY[400]}>
                    No data available
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
        </TableContainer>
      </Stack>
      <AppDialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <NotesModal
          onClose={() => setOpenEditModal(false)}
          handleEditNote={handleEditNote}
          caseId={caseId}
          note={selectedCell}
          loadingNote={loadingCreateNote}
        />
      </AppDialog>
      <AppDialog
        open={openDeleteConfirmation}
        onClose={() => handleDeleteConfirmationModalChange(false)}
      >
        <DeleteCase
          onClose={() => handleDeleteConfirmationModalChange(false)}
          onDelete={handleDeleteNote}
          type="note"
          loading={false}
        />
      </AppDialog>
    </Stack>
  );
}
