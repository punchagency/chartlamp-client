import AppDialog from "@/components/DailogBox";
import { IconContainer } from "@/components/IconContainer";
import EditIcon from "@/components/drop-down/svgs/EditIcon";
import { CaseDetail } from "@/interface";
import { NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { useReactiveVar } from "@apollo/client";
import {
  Box,
  IconButton,
  Stack,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import { format } from "date-fns";
import { useState } from "react";
import { CasesEnum, StatusFilter } from "../../constants";
import { useCases } from "../../hooks/useCases";
import { showFilterVar } from "../../state";
import DeleteCase from "../DeleteCase";
import FilterDrop from "../FilterDrop";
import { ArchiveIcon } from "../svgs/ArchiveIcon";
import { DeleteIcon } from "../svgs/DeleteIcon";
import { RetryIcon } from "../svgs/RetryIcon";
import StarIcon from "../svgs/StarIcon";
import StarIconFilled from "../svgs/StarIconFilled";
import UploadcaseModal from "../uploadCase";
import TopNav from "./TopNav";
import CaseCalender from "./calender/CaseCalender";
import Filter from "./filter";

interface TableProps {
  caseData: CaseDetail[];
  loading: boolean;
  refetch: () => void;
  handleSelectFilter: (fieldName: string, val: string) => void;
  handleUpdateFavorite: (caseId: string, isFavorite: boolean) => void;
  handleUpdateClaimStatus: (caseId: string, claimStatus: string) => void;
}

interface TableDataProps {
  _id: string;
  caseNumber: string;
  plaintiff: string;
  dateOfClaim: string;
  claimStatus: string;
  actionRequired: string;
  targetCompletion: string;
  cronStatus: string;
  isFavorite: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: PRIMARY[400],
    color: SECONDARY[500],
    fontWeight: 600,
    fontSize: pxToRem(16),
    "& svg": {
      // marginTop: '1rem'
    },
  },
  [`&.${tableCellClasses.body}`]: {
    color: SECONDARY[400],
    fontWeight: 500,
    fontSize: pxToRem(16),
  },
}));

const StyledTableRow = styled(TableRow)<{ disableRow: boolean }>(
  ({ theme, disableRow }) => ({
    opacity: disableRow ? 0.5 : 1,
    cursor: disableRow ? "not-allowed" : "pointer",
    borderBottom: SECONDARY[300],
    "&:hover": {
      backgroundColor: PRIMARY[25],
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  })
);

function formatDate(date: any) {
  return format(date, "MMMM d, yyyy");
}

const actionStyles = {
  margin: "auto",
  "&:hover": {
    background: NEUTRAL[0],
    borderRadius: pxToRem(12),
    cursor: "pointer",
  },
};

export default function CasesTable() {
  const showFilter = useReactiveVar(showFilterVar);
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  const {
    visibleRows,
    rowsPerPage,
    page,
    headCells,
    orderBy,
    order,
    selectedCaseId,
    openConfirmation,
    caseList,
    tab,
    rows,
    archivedCasesLength,
    loading,
    openChangeDateModal,
    selectedCaseNumber,
    handleChangePage,
    handleChangeRowsPerPage,
    refetch,
    handleSelectFilter,
    handleUpdateFavorite,
    handleUpdateClaimStatus,
    handleNavigateToDetails,
    handleFavorite,
    handleStatusChange,
    handleArchiveCase,
    handleDeleteCase,
    handleRestoreArchivedCase,
    handleConfirmationModalChange,
    handleTargetCompletionChange,
    handleTargetComModalChange,
    createSortHandler,
    formatDate,
  } = useCases();

  return (
    <Stack
      bgcolor={NEUTRAL[0]}
      sx={{
        boxShadow: `0px 0px 10px ${NEUTRAL["600"]}`,
        borderRadius: pxToRem(24),
        height: "calc(100vh - 105px)",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      <TopNav
        handleClickOpen={() => {
          console.log("open upload modal");
          setOpenUploadModal(true);
        }}
        handleFilterClick={() => showFilterVar(!showFilter)}
        showFilter={showFilter}
        archivedCasesLength={archivedCasesLength}
      />
      {showFilter && <Filter handleSelectFilter={handleSelectFilter} />}
      <TableContainer
        sx={{
          height: "calc(100vh - 90px - 60px)",
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <Table aria-label="customized table">
          <TableHead
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 100,
            }}
          >
            <TableRow>
              <StyledTableCell></StyledTableCell>
              {headCells.map((headCell) => (
                <StyledTableCell
                  key={headCell.id}
                  align={headCell.align as any}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                    // IconComponent={SortIcon}
                    // hideSortIcon={true}
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

          {Boolean(caseList.length) && !loading && (
            <TableBody>
              {visibleRows.map((row) => (
                <StyledTableRow
                  key={row.caseNumber}
                  onClick={() => handleNavigateToDetails(row?._id)}
                  disableRow={false}
                >
                  <TableCell
                    padding="checkbox"
                    onClick={(e) => handleFavorite(e, row._id, !row.isFavorite)}
                  >
                    <Tooltip title="Add favorites" arrow placement="top">
                      <IconButton>
                        {!row.isFavorite ? <StarIcon /> : <StarIconFilled />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.caseNumber}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.plaintiff}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {formatDate(row.dateOfClaim)}
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    sx={{ "& div": { margin: "auto" } }}
                  >
                    {/* <ClaimStatusPill claimStatus={row.claimStatus} /> */}
                    <FilterDrop
                      title={row.claimStatus}
                      isClaimStatus={true}
                      options={StatusFilter}
                      handleSelect={(val) => handleStatusChange(row._id, val)}
                      isCaseClaimStatus={true}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.actionRequired}
                  </StyledTableCell>
                  <StyledTableCell
                    align="center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTargetComModalChange(true, row._id);
                    }}
                  >
                    {formatDate(row.targetCompletion)}
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {tab === CasesEnum.archive ? (
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        // gap={pxToRem(4)}
                      >
                        <IconContainer
                          tooltip="Delete"
                          sx={actionStyles}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmationModalChange(true, row._id);
                          }}
                        >
                          <DeleteIcon />
                        </IconContainer>
                        <IconContainer
                          tooltip="Restore"
                          sx={actionStyles}
                          onClick={(e) => handleRestoreArchivedCase(e, row._id)}
                        >
                          <RetryIcon />
                        </IconContainer>
                      </Stack>
                    ) : (
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        // gap={pxToRem(4)}
                      >
                        <IconContainer
                          tooltip="Delete"
                          sx={actionStyles}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirmationModalChange(true, row._id);
                          }}
                        >
                          <DeleteIcon />
                        </IconContainer>
                        <Tooltip title="Archive">
                          <IconContainer
                            tooltip="Archive"
                            sx={actionStyles}
                            onClick={(e) => handleArchiveCase(e, row._id)}
                          >
                            <ArchiveIcon />
                          </IconContainer>
                        </Tooltip>
                      </Stack>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          )}
        </Table>
        {(!Boolean(caseList.length) || loading) && (
          <Stack
            sx={{
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!loading ? (
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
      <TablePagination
        rowsPerPageOptions={[5, 10, , { value: -1, label: "All" }] as any}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          "&.MuiTablePagination-root": {
            overflow: "hidden",
            font: "inherit",
          },
          "& .MuiTablePagination-selectLabel, .MuiSelect-select, .MuiTablePagination-displayedRows":
            {
              font: "inherit",
              color: SECONDARY[500],
              fontWeight: 600,
              fontSize: pxToRem(16),
            },
        }}
      />
      <AppDialog
        open={openUploadModal}
        onClose={() => setOpenUploadModal(false)}
      >
        <UploadcaseModal
          onClose={() => {
            setOpenUploadModal(false);
            refetch();
          }}
        />
      </AppDialog>

      <AppDialog
        open={openConfirmation}
        onClose={() => handleConfirmationModalChange(false)}
      >
        <DeleteCase
          onClose={() => handleConfirmationModalChange(false)}
          onDelete={async () => {
            if (selectedCaseId) {
              await handleDeleteCase(selectedCaseId);
              handleConfirmationModalChange(false);
            }
          }}
          type="case"
          loading={false}
        />
      </AppDialog>

      <AppDialog
        open={openChangeDateModal}
        onClose={() => handleTargetComModalChange(false)}
      >
        {selectedCaseNumber && (
          <CaseCalender
            selectedCaseNumber={selectedCaseNumber}
            onDateChange={handleTargetCompletionChange}
            onClose={() => handleTargetComModalChange(true)}
          />
        )}
      </AppDialog>
    </Stack>
  );
}
