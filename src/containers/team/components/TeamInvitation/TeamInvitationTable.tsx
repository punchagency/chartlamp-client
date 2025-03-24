import OutlinedButton from "@/components/OutlinedButton";
import { usePostRequests } from "@/hooks/useRequests";
import { InvitationDetail } from "@/interface";
import { endpoints } from "@/lib/axios";
import { successAlertVar } from "@/state";
import { ERROR, NEUTRAL, PRIMARY, pxToRem, SECONDARY } from "@/theme";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Avatar,
  Stack,
  styled,
  TableCell,
  tableCellClasses,
  TableContainer,
  Typography,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import { useEffect } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: PRIMARY[400],
    color: SECONDARY[500],
    fontWeight: 600,
    fontSize: pxToRem(16),
  },
  [`&.${tableCellClasses.body}`]: {
    color: SECONDARY[400],
    fontWeight: 500,
    fontSize: pxToRem(16),
  },
}));

export default function TeamInvitationTable({
  invitations,
  loading,
}: {
  invitations: InvitationDetail[] | undefined;
  loading: boolean;
}) {
  const { data, loading: isReminding, error, postRequests } = usePostRequests();
  useEffect(() => {
    if (data) {
      successAlertVar("Reminder sent successfully");
    }
  }, [data]);

  return (
    <TableContainer>
      <Table
        aria-label="simple table"
        sx={{
          minWidth: 650,
          "& th": {
            fontSize: pxToRem(16),
            fontWeight: 700,
            color: NEUTRAL[700],
          },
        }}
      >
        <TableHead
          sx={{
            "& th": {
              color: SECONDARY[500],
              backgroundColor: NEUTRAL[300],
            },
          }}
        >
          <TableRow>
            <StyledTableCell>
              <Stack direction="row" alignItems="center">
                <span> Name</span>
                <ArrowDropDownIcon />
              </Stack>
            </StyledTableCell>
            <StyledTableCell align="center">Date Added</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody
          sx={{
            "& td": {
              fontSize: pxToRem(16),
              fontWeight: 600,
            },
            "& td, th": {
              color: SECONDARY[300],
            },
            "& td:last-child": {
              color: SECONDARY[500],
            },
          }}
        >
          {invitations?.map((row) => (
            <TableRow
              key={row.email}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <StyledTableCell component="th" scope="row">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    src={""}
                    alt={row.email}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Stack direction={"column"} spacing={0}>
                    <span>{row.email}</span>
                  </Stack>
                </Stack>
              </StyledTableCell>
              <StyledTableCell align="center">
                {moment(row.createdAt).format("MMMM Do YYYY")}
              </StyledTableCell>
              <StyledTableCell align="center">
                <OutlinedButton
                  bgColor={ERROR["50"]}
                  hoverColor="transparent"
                  sx={{
                    padding: "5px 20px",
                    border: `1px solid ${ERROR["200"]}`,
                    color: ERROR["400"],
                    "&:hover": {
                      color: ERROR["400"],
                      backgroundColor: ERROR["100"],
                    },
                  }}
                >
                  Pending
                </OutlinedButton>
              </StyledTableCell>
              <StyledTableCell align="center">
                <OutlinedButton
                  sx={{
                    border: `1px solid ${NEUTRAL["200"]}`,
                    color: SECONDARY["300"],
                    backgroundColor: NEUTRAL["0"],
                    "&:hover": {
                      color: SECONDARY["400"],
                      border: `1px solid ${SECONDARY["100"]}`,
                      backgroundColor: PRIMARY["25"],
                    },
                  }}
                  onClick={() => {
                    postRequests(endpoints.invitation.reminder, {
                      email: row.email,
                    });
                  }}
                >
                  {isReminding ? "Laoding..." : "Send Reminder"}
                </OutlinedButton>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {(!Boolean(invitations?.length) || loading) && (
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
  );
}
