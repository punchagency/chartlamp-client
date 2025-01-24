export enum ClaimStatus {
  NEW = "new",
  IN_PROGRESS = "in_progress",
  ESCALATED = "escalated",
}

export enum ActionRequired {
  INTAKE_PROCESS = "Intake process",
  CONDUCTION_REVIEW = "conduction_review",
  SENDING_SIU = "sending_siu",
}

export enum CronStatus {
  Pending = "pending",
  Processing = "processing",
  Processed = "processed",
}