import {
  CaseDetailEnum,
  MapViewEnum,
} from "@/containers/cases/caseDetail/constants";
import { DashboardClaimRelatedReports } from "@/interface";
import { PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { Stack, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: PRIMARY[25],
  },
  "& td, & th": {
    border: 0,
    fontSize: pxToRem(16),
    fontWeight: 600,
  },
}));

function createData(
  icdCode: string,
  description: string,
  caseNumber: string,
  amount: string,
  caseId: string,
  reportId: string
) {
  return { icdCode, description, caseNumber, amount, caseId, reportId };
}

// const rows = [
//   createData("A15-A19", "Tuberculosis", "1234-A988", "$15,000"),
//   createData(
//     "H30-H36",
//     "Disorders of choroid and retina",
//     "1A34-A988",
//     "$5,000"
//   ),
//   createData("H30-H32", "Chorioretinal disorders in...", "1234-A988", "$2,000"),
// ];

const subtitle1 = {
  fontSize: pxToRem(16),
  fontWeight: 600,
  color: SECONDARY[400],
};

export default function ClaimsTable({
  claimRelatedReports,
}: {
  claimRelatedReports: DashboardClaimRelatedReports[];
}) {
  const router = useRouter();
  const rows = claimRelatedReports.map((report) => {
    return createData(
      report.icdCode,
      report.nameOfDisease,
      report.caseNumber,
      report.amountSpent || "not available",
      report.case,
      report.report
    );
  });
  return (
    <TableContainer>
      <Table
        aria-label="simple table"
        sx={{
          minWidth: 650,
          "& th": {
            fontSize: pxToRem(16),
            fontWeight: 700,
            color: SECONDARY[500],
            borderBottom: `1px solid ${SECONDARY[100]}`,
            // pl: pxToRem(32),
          },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>ICD-Code</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Case Number</TableCell>
            <TableCell align="center">Amount</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            // bgcolor: 'red',
            "& td": {
              ...subtitle1,
            },
            "& td, th": {
              ...subtitle1,
            },
            "& td:last-child": {
              ...subtitle1,
            },
          }}
        >
          {rows.map((row) => (
            <StyledTableRow
              key={row.icdCode}
              onClick={() =>
                router.push(
                  `/dashboard/case/${row.caseId}/${CaseDetailEnum.medicalHistory}?view=${MapViewEnum.detailsView}&reportId=${row.reportId}&icd-code=${row.icdCode}`
                )
              }
            >
              <TableCell component="th" scope="row">
                {row.icdCode}
              </TableCell>
              <TableCell align="center">
                {row.description.length > 24
                  ? `${row.description.slice(0, 24)}...`
                  : row.description}
              </TableCell>
              <TableCell align="center">{row.caseNumber}</TableCell>
              <TableCell align="center">{row.amount}</TableCell>
              <TableCell align="right" sx={{ cursor: "pointer" }}>
                View
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>

      {!Boolean(rows?.length) && (
        <Stack
          sx={{
            width: "100%",
            height: "100%",
            minHeight: 200,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack>
            <Typography variant="h6" color={SECONDARY[400]}>
              No data available
            </Typography>
          </Stack>
        </Stack>
      )}
    </TableContainer>
  );
}
