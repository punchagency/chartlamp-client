import { StatusType } from "@/interface";
import { PRIMARY, pxToRem, SUCCESS, ERROR } from "@/theme";

export const caseData = [
  {
    caseNumber: "1234-A988",
    plaintiff: "Oliver James",
    dateOfClaim: "4/30/22",
    claimStatus: "New",
    actionRequired: "Intake Process",
    targetCompletion: "7/30/22",
  },
  {
    caseNumber: "1234-A987",
    plaintiff: "Oliver James",
    dateOfClaim: "4/30/22",
    claimStatus: "In progress",
    actionRequired: "Intake Process",
    targetCompletion: "7/30/22",
  },
  {
    caseNumber: "1234-A987",
    plaintiff: "Oliver James",
    dateOfClaim: "4/30/22",
    claimStatus: "In progress",
    actionRequired: "Intake Process",
    targetCompletion: "7/30/22",
  },
  {
    caseNumber: "1234-A987",
    plaintiff: "Oliver James",
    dateOfClaim: "4/30/22",
    claimStatus: "In progress",
    actionRequired: "Intake Process",
    targetCompletion: "7/30/22",
  },
  {
    caseNumber: "1234-A987",
    plaintiff: "Oliver James",
    dateOfClaim: "4/30/22",
    claimStatus: "In progress",
    actionRequired: "Intake Process",
    targetCompletion: "7/30/22",
  },
  {
    caseNumber: "1234-A987",
    plaintiff: "Oliver James",
    dateOfClaim: "4/30/22",
    claimStatus: "Escalated",
    actionRequired: "Intake Process",
    targetCompletion: "7/30/22",
  },
  {
    caseNumber: "1234-A987",
    plaintiff: "Oliver James",
    dateOfClaim: "4/30/22",
    claimStatus: "In progress",
    actionRequired: "Intake Process",
    targetCompletion: "7/30/22",
  },
  {
    caseNumber: "1234-A987",
    plaintiff: "Oliver James",
    dateOfClaim: "4/30/22",
    claimStatus: "In progress",
    actionRequired: "Intake Process",
    targetCompletion: "7/30/22",
  },
  {
    caseNumber: "1234-A987",
    plaintiff: "Oliver James",
    dateOfClaim: "4/30/22",
    claimStatus: "In progress",
    actionRequired: "Intake Process",
    targetCompletion: "7/30/22",
  },
  {
    caseNumber: "1234-A987",
    plaintiff: "Oliver James",
    dateOfClaim: "4/30/22",
    claimStatus: "In progress",
    actionRequired: "Intake Process",
    targetCompletion: "7/30/22",
  },
];

  export const statusStyle = (status?: string) => {
    switch (status) {
      case StatusType.NEW:
        return {
          border: `1px solid ${PRIMARY[200]}`,
          bdHover: `1px solid ${PRIMARY[100]}`,
          color: PRIMARY[700],
          background: PRIMARY[50],
          bghover: PRIMARY[100],
          minWidth: pxToRem(63),
        };
      case StatusType.IN_PROGRESS:
        return {
          border: `1px solid ${PRIMARY[200]}`,
          color: SUCCESS[600],
          background: SUCCESS[50],
          bghover: SUCCESS[100],
          bdHover: `1px solid ${SUCCESS[200]}`,
        };
      case StatusType.ESCALATED:
        return {
          border: `1px solid ${ERROR[200]}`,
          color: ERROR[400],
          background: ERROR[50],
          bghover: ERROR[100],
          bdHover: `1px solid ${ERROR[200]}`,
        };

      default:
        break;
    }
  };
