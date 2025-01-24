import { ERROR, NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { Button, Stack, Typography } from "@mui/material";
import { DeleteNotification } from "../svgs/DeleteNotification";

export default function DeleteCase({
  onClose,
  onDelete,
  loading,
  type = "file",
}: {
  onClose: () => void;
  onDelete: () => void;
  loading: boolean;
  type?: string;
}) {
  return (
    <Stack
      sx={{
        width: pxToRem(327),
        padding: pxToRem(20),
        gap: pxToRem(32),
      }}
    >
      <Stack gap={pxToRem(8)} alignItems={"center"}>
        <DeleteNotification />
        <Stack gap={pxToRem(16)}>
          <Typography variant="h5" color={SECONDARY[400]}>
            Delete {type}
          </Typography>
        </Stack>
        <Typography variant="body2" color={SECONDARY[300]} textAlign={"center"}>
          Are you sure you want to delete this {type}? This action can not be
          undone!
        </Typography>
      </Stack>
      <Stack direction={"row"} gap={pxToRem(16)}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            width: "100%",
            border: `1px solid ${NEUTRAL[300]}`,
            borderRadius: pxToRem(16),
            "&:hover": {
              background: PRIMARY[25],
              border: `1px solid ${SECONDARY[100]}`,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onDelete}
          // color="error"
          sx={{
            width: "100%",
            borderRadius: pxToRem(16),
            background: ERROR[500],
            "&:hover": { background: ERROR[600] },
          }}
        >
          {loading ? "Deleting" : "Delete"}
        </Button>
      </Stack>
    </Stack>
  );
}
