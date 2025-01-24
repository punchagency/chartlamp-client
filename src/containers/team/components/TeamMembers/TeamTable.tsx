import AppDialog from "@/components/DailogBox";
import { IconContainer } from "@/components/IconContainer";
import DeleteCase from "@/containers/cases/components/DeleteCase";
import FilterDrop from "@/containers/cases/components/FilterDrop";
import { DeleteIcon } from "@/containers/cases/components/svgs/DeleteIcon";
import { usePatchRequests } from "@/hooks/useRequests";
import { UserDetail } from "@/interface";
import { endpoints } from "@/lib/axios";
import { successAlertVar } from "@/state";
import { NEUTRAL, PRIMARY, pxToRem, SECONDARY } from "@/theme";
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
import { useState } from "react";
import { refetchUsersVar } from "../../state";

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

const accessLevels = [
  {
    label: "All access",
    value: "all_access",
  },
  {
    label: "View Only",
    value: "view_Only",
  },
];

export default function TeamTable({
  users,
  loading,
}: {
  users: UserDetail[] | undefined;
  loading: boolean;
}) {
  const [roles, setRoles] = useState([]);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { loading: loadingPatch, patchRequests } =
    usePatchRequests<UserDetail>();

  const handleRoleChange = (email: string, newRole: string) => {
    setRoles((prevRoles) => ({
      ...prevRoles,
      [email]: newRole,
    }));
  };

  const handleUpdateUser = async ({
    userId,
    accessLevel,
  }: {
    userId: string;
    accessLevel: string;
  }) => {
    await patchRequests(`${endpoints.user.update}/${userId}/access-level`, {
      accessLevel,
    });
    successAlertVar("Access updated successfully");
  };

  const handleDeleteUser = async (userId: string) => {
    await patchRequests(`${endpoints.user.update}/${userId}/delete`, {});
    refetchUsersVar(true);
    successAlertVar("User deleted successfully");
  };

  const handleConfirmationClose = () => {
    setOpenConfirmation(false);
  };

  return (
    <TableContainer
      sx={{
        // minWidth: 700,
        height: "calc(100vh - 220px)",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
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
            <StyledTableCell align="center">Access</StyledTableCell>
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
          {users?.map((row) => (
            <TableRow
              key={row.name}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": { background: PRIMARY[25] },
              }}
            >
              <StyledTableCell component="th" scope="row">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    src={row.profilePicture}
                    alt={row.name}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Stack direction={"column"} spacing={0}>
                    <Typography variant="h4" sx={{ color: "#282833" }}>
                      {row.name}
                    </Typography>
                    <span>{row.email}</span>
                  </Stack>
                </Stack>
              </StyledTableCell>
              <StyledTableCell align="center">
                {moment(row.createdAt).format("MMMM Do YYYY")}
              </StyledTableCell>
              <StyledTableCell
                align="center"
                sx={{ "& div": { margin: "auto" } }}
              >
                <FilterDrop
                  title={
                    accessLevels.find((item) => item.value === row.accessLevel)
                      ?.label || "All access"
                  }
                  hideClose={true}
                  options={accessLevels}
                  topStyle={{
                    maxWidth: "max-content",
                  }}
                  containerStyle={{
                    maxWidth: "max-content",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  handleSelect={(val) =>
                    handleUpdateUser({
                      userId: row._id,
                      accessLevel: val,
                    })
                  }
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <IconContainer
                  tooltip="Delete"
                  sx={{
                    margin: "auto",
                    "&:hover": {
                      background: NEUTRAL[0],
                      borderRadius: pxToRem(12),
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => {
                    setSelectedUserId(row._id);
                    setOpenConfirmation(true);
                  }}
                >
                  <DeleteIcon />
                </IconContainer>
              </StyledTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {(!Boolean(users?.length) || loading) && (
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
      <AppDialog
        open={openConfirmation}
        onClose={() => handleConfirmationClose()}
      >
        <DeleteCase
          onClose={() => handleConfirmationClose()}
          onDelete={async () => {
            if (selectedUserId) {
              await handleDeleteUser(selectedUserId);
              handleConfirmationClose();
            }
          }}
          type="user"
          loading={loadingPatch}
        />
      </AppDialog>
    </TableContainer>
  );
}
