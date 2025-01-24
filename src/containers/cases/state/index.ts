import { caseStatus } from "@/interface";
import { ReactiveVar, makeVar } from "@apollo/client";

export const showFilterVar: ReactiveVar<boolean> = makeVar<boolean>(
  false
);

export const refetchCaseDetailsVar: ReactiveVar<boolean> = makeVar<boolean>(
  false
);

export const refetchCaseDetailsWithoutLoadingVar: ReactiveVar<boolean> = makeVar<boolean>(
  false
);

export const scrappingCasesVar: ReactiveVar<caseStatus[]> = makeVar<caseStatus[]>([]);


