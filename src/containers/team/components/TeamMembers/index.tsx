import { UserDetail } from "@/interface";
import TeamTable from "./TeamTable";

export default function TeamMembers({data, loading}: {data: UserDetail[] | undefined, loading: boolean;}) {
  return <TeamTable users={data} loading={loading} />;
}
