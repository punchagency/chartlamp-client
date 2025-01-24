import { ReactiveVar, makeVar } from "@apollo/client";

export const refetchUsersVar: ReactiveVar<boolean> = makeVar<boolean>(
  false
);



