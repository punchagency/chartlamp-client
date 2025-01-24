import { StatusType } from "@/interface";

export enum CasesEnum {
  management = "management",
  archive = "archive",
}


export const StatusFilter = [
  {
    label: "New",
    value: StatusType.NEW,
  },
  {
    label: "Pre Litigation",
    value: StatusType.IN_PROGRESS,
  },
  {
    label: "Litigated",
    value: StatusType.ESCALATED,
  },
];
