import Button from "@/components/Button";
import { IconContainer } from "@/components/IconContainer";
import { CloseModalIcon } from "@/components/svgs/CloseModalIcon";
import axiosInstance, { endpoints } from "@/lib/axios";
import { successAlertVar } from "@/state";
import { GREEN, NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { Box, Stack, Typography } from "@mui/material";
import { useCallback, useState } from "react";
import { refetchCaseDetailsVar } from "../../state";

export default function CustomTagModal({
  onClose,
  caseId,
}: {
  onClose: () => void;
  caseId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [tagName, setTagName] = useState("");

  const createCaseTag = useCallback(
    async (caseId: string) => {
      if (!tagName) return;
      setLoading(true);
      await axiosInstance.post(`${endpoints.case.getById}/${caseId}/tags`, {
        tagName,
      });
      refetchCaseDetailsVar(true);
      setLoading(false);
      successAlertVar("Tag added successfully");
      onClose();
    },
    [tagName]
  );

  return (
    <Stack
      sx={{
        // width: pxToRem(650),
        // minHeight: pxToRem(306),
        padding: pxToRem(24),
        gap: pxToRem(32),
        position: "relative",
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography
            variant="subtitle1"
            color={SECONDARY[500]}
            fontWeight={700}
            fontSize={pxToRem(28)}
          >
            Custom tag
          </Typography>
          <Typography variant="body1" color={SECONDARY[300]}>
            Please add your custom tags here
          </Typography>
        </Stack>
        <Stack direction={"row"} gap={pxToRem(8)} alignItems={"center"}>
          <IconContainer tooltip="Close" onClick={onClose}>
            <CloseModalIcon />
          </IconContainer>
        </Stack>
      </Stack>

      <Stack gap={pxToRem(12)}>
        <Stack direction={"row"} alignItems={"center"} gap={pxToRem(8)}>
          <Box
            // ref={setAnchorEl}
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",

              border: `1px solid ${NEUTRAL[301]}`,
              width: pxToRem(491),
              px: pxToRem(8),
              // py: pxToRem(14.5),
              borderRadius: pxToRem(16),
              "& input": {
                border: "none",
                outline: "none",
                width: 0,
                height: pxToRem(48),
                minWidth: pxToRem(48),
                flexGrow: 1,
                padding: `${pxToRem(4)} ${pxToRem(6)}`,
              },
            }}
          >
            <input
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder="Add a tag"
            />
          </Box>
          <Button
            onClick={() => createCaseTag(caseId)}
            disabled={loading || !tagName}
            sx={{
              height: pxToRem(48),
              width: pxToRem(95),
              borderRadius: pxToRem(16),
              fontSize: pxToRem(16),
              fontWeight: 600,
              backgroundColor: GREEN[500],
              px: pxToRem(20),
              py: pxToRem(13.5),
              cursor: loading || !tagName ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Loading..." : "Add"}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
