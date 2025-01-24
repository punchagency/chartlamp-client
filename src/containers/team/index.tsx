"use client";
import AppBadge from "@/components/AppBadge";
import { ButtonWithIcon } from "@/components/ButtonWithIcon";
import CollapsibleSearch from "@/components/CollapsibleSearch";
import AppDialog from "@/components/DailogBox";
import { useGetRequests } from "@/hooks/useRequests";
import { InvitationDetail, UserDetail, UsersAndInvitations } from "@/interface";
import { endpoints } from "@/lib/axios";
import { GREEN, NEUTRAL, SECONDARY, pxToRem } from "@/theme";
import { useReactiveVar } from "@apollo/client";
import { Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { AddIcon } from "../cases/components/svgs/AddIcon";
import TeamInvitation from "./components/TeamInvitation";
import TeamMembers from "./components/TeamMembers";
import InviteModal from "./components/invite";
import { refetchUsersVar } from "./state";

export default function TeamPageContainer() {
  const refetchUsers = useReactiveVar(refetchUsersVar);
  const [openAddTeamMember, setOpenAddTeamMember] = useState(false);
  const { data, loading, getRequests } = useGetRequests<UsersAndInvitations>();
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<UserDetail[]>([]);
  const [invitations, setInvitations] = useState<InvitationDetail[]>([]);
  const [search, setSearch] = useState("");

  const handleClose = () => setOpenAddTeamMember(false);
  const handleOpen = () => setOpenAddTeamMember(true);

  const handleSearchCollapse = () => {
    setOpen((prev) => !prev);
  };

  const filteredTeamMembers = useMemo(() => {
    if (!search) return teamMembers;
    return teamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [teamMembers, search]);

  const filteredInvitations = useMemo(() => {
    if (!search) return invitations;
    return invitations.filter((invitation) =>
      invitation.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [invitations, search]);

  const getTabContent = useMemo(() => {
    switch (tab) {
      case 0:
        return <TeamMembers data={filteredTeamMembers} loading={loading} />;
      case 1:
        return <TeamInvitation data={filteredInvitations} loading={loading} />;
      default:
        return <TeamMembers data={filteredTeamMembers} loading={loading} />;
    }
  }, [tab, filteredInvitations, filteredTeamMembers, loading]);

  useEffect(() => {
    getRequests(endpoints.invitation.get);
  }, [getRequests]);

  useEffect(() => {
    if (refetchUsers)
      getRequests(endpoints.invitation.get).then(() => refetchUsersVar(false));
  }, [getRequests, refetchUsers]);

  useEffect(() => {
    if (data?.users) setTeamMembers(data.users);
    if (data?.invitations) setInvitations(data.invitations);
  }, [data]);

  return (
    <>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "column",
          boxShadow: `0px 0px 10px ${NEUTRAL["600"]}`,
          borderRadius: pxToRem(24),
          backgroundColor: NEUTRAL[0],
          width: "100%",
          minHeight: "85vh",
        }}
        spacing={0}
      >
        <Stack
          spacing={2}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            px: pxToRem(20),
            height: pxToRem(88),
          }}
        >
          <Stack direction="row" gap={3}>
            <Typography
              variant="body1"
              fontWeight={600}
              fontSize={pxToRem(19)}
              onClick={() => setTab(0)}
              sx={{
                cursor: "pointer",
                color: tab === 0 ? GREEN[500] : NEUTRAL[300],
                "&:hover": {
                  color: GREEN[500],
                },
              }}
            >
              Team Members
            </Typography>
            <Stack
              direction="row"
              gap={pxToRem(8)}
              justifyContent="center"
              alignItems="center"
              onClick={() => setTab(1)}
              sx={{
                cursor: "pointer",
                "&:hover p": {
                  color: GREEN[500],
                },
                "&:hover div": {
                  background: SECONDARY[500],
                },
              }}
            >
              <Typography
                variant="body1"
                fontWeight={600}
                fontSize={pxToRem(19)}
                sx={{
                  color: tab === 1 ? GREEN[500] : NEUTRAL[300],
                }}
              >
                Invitation Sent
              </Typography>
              <AppBadge
                text={data?.invitations?.length || 0}
                sx={{
                  background: tab === 1 ? SECONDARY[500] : GREEN[200],
                }}
              />
            </Stack>
          </Stack>
          <Stack
            direction="row"
            gap={2}
            justifyContent="center"
            alignItems="center"
          >
            <CollapsibleSearch
              open={open}
              handleChange={handleSearchCollapse}
              placeholder="Search team members"
              onSearch={(value) => setSearch(value)}
            />
            <ButtonWithIcon
              text="Add Team Member"
              icon={<AddIcon />}
              onClick={handleOpen}
              textStyles={{
                fontSize: pxToRem(16),
              }}
              containerStyles={{
                bgcolor: "rgba(23, 26, 28, 1)",
                height: pxToRem(48),
                width: pxToRem(211),
                gap: pxToRem(4),
                borderRadius: pxToRem(16),
                color: NEUTRAL[0],
                cursor: "pointer",
              }}
            />
          </Stack>
        </Stack>
        {getTabContent}
      </Stack>
      <AppDialog open={openAddTeamMember} onClose={handleClose}>
        <InviteModal onClose={handleClose} />
      </AppDialog>
    </>
  );
}
