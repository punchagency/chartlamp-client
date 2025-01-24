import { Box, Stack, TableSortLabel, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
// import Paper from "@mui/material/Paper";

import { NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
// import { caseData } from "./constants";
// import AppDialog from "@/components/DailogBox";
// import DeleteCase from "@/containers/cases/components/DeleteCase";
import { ReportsDetail } from "@/interface";
import { getComparator } from "@/utils/general";
import { useReactiveVar } from "@apollo/client";
import { visuallyHidden } from "@mui/utils";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { showFilterVar } from "../../../state";
import Filter from "../filter";

interface TableProps {
  reportData: ReportsDetail[] | undefined;
  loading: boolean;
}

interface Data {
  icdCodes: string;
  nameOfDisease: string;
  amountSpent: number;
  dateOfClaim: Date;
}

interface HeadCell {
  id: keyof Data;
  label: string;
  align: string;
  sx?: any;
}

enum OpenEnums {
  upload = "upload",
  delete = "delete",
  filter = "filter",
}

type Order = "asc" | "desc";

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

function createData(
  icdCodes: string,
  nameOfDisease: string,
  amountSpent: number,
  dateOfClaim: Date
) {
  return {
    icdCodes,
    nameOfDisease,
    amountSpent,
    dateOfClaim,
  };
}

const headCells: readonly HeadCell[] = [
  {
    id: "icdCodes",
    label: "ICD-10",
    align: "left",
  },
  {
    id: "nameOfDisease",
    label: "Description",
    align: "center",
    sx: { display: { xs: "none", sm: "table-cell" } },
  },
  {
    id: "amountSpent",
    label: "Amount Spent",
    align: "left",
  },
  {
    id: "dateOfClaim",
    label: "Claim Date",
    align: "left",
    sx: { display: { xs: "none", sm: "table-cell" } },
  },
];

export default function ReportTable({ reportData, loading }: TableProps) {
  const showFilter = useReactiveVar(showFilterVar);
  const searchParams = useSearchParams();
  const defaultUpload = searchParams.get("upload") === "true";
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState("calories");

  const rows = useMemo(() => {
    if (!reportData) return [];
    if (!reportData.length) return [];
    return reportData.map((data) => {
      const icd = data?.icdCodes?.length ? data?.icdCodes?.join(", ") : "--";
      const amountSpent = parseInt(
        data.amountSpent.replace("$", "").replace(",", "")
      );
      return createData(icd, data.nameOfDisease, amountSpent, data.dateOfClaim);
    });
  }, [reportData]);

  const visibleRows: Data[] = useMemo(
    () =>
      rows && rows.length
        ? [...rows].sort(getComparator(order, orderBy) as any)
        : [],
    [order, orderBy, rows]
  );

  // console.log("visibleRows", visibleRows, rows, reportData);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      handleRequestSort(event, property);
    };

  return (
    <Stack
      flex={1}
      bgcolor={NEUTRAL[0]}
      sx={{
        borderRadius: pxToRem(24),
      }}
    >
      <Filter showFilter={showFilter} />
      <TableContainer>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows?.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {row.icdCodes}
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  sx={{ "& div": { margin: "0" } }}
                >
                  <Stack
                    gap={pxToRem(8)}
                    direction={"row"}
                    alignItems={"left"}
                    justifyContent={"center"}
                  >
                    <Typography variant="body1" color={SECONDARY[400]}>
                      {row.nameOfDisease}
                    </Typography>
                  </Stack>
                </StyledTableCell>
                <StyledTableCell align="left">
                  {row?.amountSpent ?? "--"}
                </StyledTableCell>
                <StyledTableCell
                  align="left"
                  sx={{ display: { xs: "none", sm: "table-cell" } }}
                >
                  {moment(row.dateOfClaim).isValid()
                    ? moment(row.dateOfClaim).format("MMMM Do YYYY")
                    : "--"}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {(!Boolean(reportData?.length) || loading) && (
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
  );
}
