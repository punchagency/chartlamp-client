import Button from "@/components/Button";
import { CustomImage } from "@/components/CustomImage";
import { IconContainer } from "@/components/IconContainer";
import { UserAvatar } from "@/components/UserAvatar";
import { CloseModalIcon } from "@/components/svgs/CloseModalIcon";
import axiosInstance, { endpoints } from "@/lib/axios";
import { successAlertVar } from "@/state";
import { GREEN, NEUTRAL, PRIMARY, SECONDARY, pxToRem } from "@/theme";
import { ChartLampUser } from "@/types/user";
import {
  AutocompleteGetTagProps,
  useAutocomplete,
} from "@mui/base/useAutocomplete";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { AddIcon } from "../svgs/AddIcon";
import { CopyIcon } from "../svgs/CopyIcon";

interface UserRowProps extends ReturnType<AutocompleteGetTagProps> {
  label: string;
}

function UserRow(props: UserRowProps) {
  const { label, onDelete, ...other } = props;
  return (
    <Stack
      {...other}
      direction={"row"}
      alignItems={"center"}
      gap={pxToRem(8)}
      sx={{
        width: "fit-content",
        height: pxToRem(32),
        borderRadius: pxToRem(8),
        border: `1px solid ${NEUTRAL[200]}`,
        backgroundColor: NEUTRAL[100],
        color: NEUTRAL[500],
        padding: pxToRem(8),
        pl: pxToRem(12),
      }}
    >
      <span>{label}</span>
      <IconButton onClick={onDelete}>
        <CloseModalIcon />
      </IconButton>
    </Stack>
  );
}

export default function ShareModal({
  onClose,
  teamMembers,
  caseNumber,
  caseId,
  name,
  profilePicture,
}: {
  onClose: () => void;
  teamMembers: ChartLampUser[];
  caseNumber: string;
  caseId: string;
  name: string;
  profilePicture: string;
}) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl,
  } = useAutocomplete({
    id: "share-case",
    // defaultValue: [top100Films[1]],
    multiple: true,
    options: teamMembers,
    // getOptionLabel: (option) => option.title,
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy: ", error);
    }
  };

  const selectedValues = useMemo(() => value.map((v) => v._id), [value]);

  const handleInvite = useCallback(async () => {
    if (!selectedValues.length) return;
    setLoading(true);
    // console.log("selectedValues", selectedValues);
    await axiosInstance.post(`${endpoints.case.getById}/${caseId}/share`, {
      userIds: selectedValues,
    });
    setLoading(false);
    successAlertVar("Case shared successfully");
    onClose();
  }, [selectedValues]);

  return (
    <Stack
      sx={{
        // width: pxToRem(650),
        minHeight: pxToRem(306),
        padding: pxToRem(24),
        gap: pxToRem(24),
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
            Share
          </Typography>
          <Typography variant="body1" color={SECONDARY[300]}>
            Invite your team to view collaboration.
          </Typography>
        </Stack>
        <Stack direction={"row"} gap={pxToRem(8)} alignItems={"center"}>
          <Stack
            onClick={handleCopy}
            direction={"row"}
            alignItems={"center"}
            sx={{
              gap: pxToRem(8),
              borderRadius: pxToRem(12),
              border: `1px solid ${NEUTRAL[201]}`,
              py: pxToRem(10),
              px: pxToRem(16),
              height: pxToRem(40),
              cursor: "pointer",
            }}
          >
            {!copied && <CopyIcon />}
            <Typography variant="subtitle1" color={SECONDARY[300]}>
              {copied ? "Link Copied!" : "Copy Link"}
            </Typography>
            {!copied && <AddIcon fill={GREEN[301]} />}
          </Stack>
          <IconContainer tooltip="Close" onClick={onClose}>
            <CloseModalIcon />
          </IconContainer>
        </Stack>
      </Stack>
      <Stack
        justifyContent={"center"}
        sx={{
          width: "100%",
          height: pxToRem(72),
          padding: pxToRem(16),
          borderRadius: pxToRem(16),
          bgcolor: PRIMARY[26],
        }}
      >
        <UserAvatar
          title={name}
          subtitle={`Case Number: ${caseNumber}`}
          img={profilePicture}
        />
      </Stack>
      <Stack gap={pxToRem(12)}>
        <Typography variant="subtitle1" color={SECONDARY[300]}>
          Share with team member
        </Typography>
        <Stack
          direction={"row"}
          alignItems={"center"}
          gap={pxToRem(8)}
          {...getRootProps()}
        >
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
            {value.map((option: ChartLampUser, index: number) => {
              const { key, ...tagProps } = getTagProps({ index });
              return <UserRow key={key} {...tagProps} label={option.name} />;
            })}
            <input {...getInputProps()} />
          </Box>
          <Button
            onClick={handleInvite}
            disabled={loading || !selectedValues.length}
            sx={{
              height: pxToRem(48),
              width: pxToRem(95),
              borderRadius: pxToRem(16),
              fontSize: pxToRem(16),
              fontWeight: 600,
              backgroundColor: GREEN[500],
              px: pxToRem(20),
              py: pxToRem(13.5),
            }}
          >
            {loading ? "Loading..." : "Invite"}
          </Button>
        </Stack>
      </Stack>
      {groupedOptions.length > 0 ? (
        <Box
          component={"ul"}
          {...getListboxProps()}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: pxToRem(8),
            width: pxToRem(491),
            height: pxToRem(300),
            overflowY: "auto",
            position: "fixed",
            bottom: { lg: -5, xl: pxToRem(45) },
            zIndex: 1000,
            border: `1px solid ${NEUTRAL[301]}`,
            borderRadius: pxToRem(24),
            padding: pxToRem(8),
            backgroundColor: NEUTRAL[0],
            boxShadow: "0px 0px 24px 0px rgba(23, 26, 28, 0.1)",
            // remove decoration on list item
            "& li": {
              listStyle: "none",
            },
            // hide scroll bar
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {(groupedOptions as typeof teamMembers).map((option, index) => {
            const { ...optionProps } = getOptionProps({
              option,
              index,
            });
            return (
              <Box component={"li"} key={index} {...optionProps}>
                <Stack direction={"row"} alignItems={"center"}>
                  <Stack
                    gap={pxToRem(4)}
                    direction={"row"}
                    alignItems={"center"}
                  >
                    <CustomImage
                      src={option.profilePicture || "/images/userHeader.png"}
                      wrapperSx={{
                        height: pxToRem(44),
                        width: pxToRem(44),
                        "& img": {
                          borderRadius: "50%",
                        },
                      }}
                    />
                    <Stack gap={pxToRem(4)}>
                      <Typography variant="h5" color={SECONDARY[400]}>
                        {option.name}
                      </Typography>
                      <Typography variant="body2" color={SECONDARY[400]}>
                        {option.email}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Box>
            );
          })}
        </Box>
      ) : null}
    </Stack>
  );
}
