import { InvitationDetail } from "@/interface";
import TeamInvitationTable from "./TeamInvitationTable";

export default function TeamMembers({data, loading}: {data: InvitationDetail[] | undefined, loading: boolean}) {
  return (
        <TeamInvitationTable invitations={data} loading={loading} />
  );
}
