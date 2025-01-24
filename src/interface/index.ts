export interface Hoverable {
  isHovered?: boolean;
  size?: number;
}

export interface DocumentDetail {
  _id: string;
  case: string;
  url: string;
  content: string;
  extractedData: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetail {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePicture?: string;
}

export interface TableDataProps {
  id: string;
  name: string;
  uploadedBy: string;
  dateUploaded: string;
  size: string;
  url: string;
}

export enum TagsType {
  CLAIM_RELATED = "claim_related",
  PRIVILEGED = "privileged",
  CUSTOM_TAG = "custom_tag",
}

export enum StatusType {
  NEW = "New",
  IN_PROGRESS = "Pre Litigation",
  ESCALATED = "Litigated",
}

export interface MapViewFilter {
  bodyPart: string;
  provider: string;
  tag: TagsType | "";
}

export interface NameOfDiseaseByIcdCode {
  icdCode: string;
  nameOfDisease: string;
}


export interface ReportsDetail {
  icdCodes?: string[];
  nameOfDisease: string;
  amountSpent: string;
  providerName: string;
  doctorName: string;
  document?: string;
  medicalNote: string;
  dateOfClaim: Date;
  _id: string;
  tags: TagsType[];
  nameOfDiseaseByIcdCode?: NameOfDiseaseByIcdCode[];
}

export interface ImageType {
  _id: string;
  fileName: string;
  categoryName: string;
  __v: number;
  svg: string;
  score: number;
}

export interface ImageTypeTwo extends ImageType {
  reportId: string;
  icdCode: string;
}

export interface DiseaseReport {
  images: ImageType[];
  bodyParts: string;
  description: string;
  reportId: string;
  icdCode: string;
}

export interface ReportsDetailWithBodyPart extends ReportsDetail {
  classification: DiseaseReport[];
  icdCodes: string[];
}

export interface CaseNote {
  _id: string;
  case: string;
  user: {
    _id: string;
    name: string;
    profilePicture: string;
  };
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteCellData {
  noteId: string;
  note: string;
  caseId: string;
  userName: string;
  userImg: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface caseTags {
  _id: string;
  case: string;
  tagName: string;
}

export interface CaseDetail {
  _id: string;
  caseNumber: string;
  plaintiff: string;
  dateOfClaim: string;
  claimStatus: string;
  actionRequired: string;
  targetCompletion: Date;
  organization: string;
  user: UserDetail;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
  isArchived: boolean;
  cronStatus: string;
  documents: DocumentDetail[];
  reports: ReportsDetailWithBodyPart[];
  report: ReportsDetailWithBodyPart;
  classification: DiseaseReport[];
  tags?: caseTags[];
}


export interface caseStatus {
  caseId: string;
  completed: boolean;
}

export interface OptionsType {
  label: string;
  value: string;
}

export interface UserDetail {
  _id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  accessLevel?: string;
  //profilePicture
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvitationDetail {
  _id: string;
  invitedBy: string;
  organization: string;
  email: string;
  role: string;
  token: string;
  expiresAt: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersAndInvitations {
  users: UserDetail[];
  invitations: InvitationDetail[];
}