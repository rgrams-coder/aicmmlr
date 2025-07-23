export enum UserCategory {
  MINING_DEALER = 'MINING_DEALER',
  LEASEE = 'LEASEE',
  GOVERNMENT_OFFICIAL = 'GOVERNMENT_OFFICIAL',
  FIRM = 'FIRM',
  COMPANY = 'COMPANY',
  STUDENT = 'STUDENT',
  RESEARCHER = 'RESEARCHER',
}

export enum UserType {
  PREMIUM = 'PREMIUM',
  ACADEMIC = 'ACADEMIC',
}

export interface UserCategoryInfo {
  value: UserCategory;
  label: string;
  type: UserType;
}

export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  password: string;
}

export interface ProfileData {
  address: string;
  bio: string;
  profilePicture: File | null;
}

export interface UserData extends RegistrationFormData, ProfileData {
  category: UserCategory;
}

export enum DocumentType {
  BARE_ACT = 'BARE_ACT',
  NOTIFICATION = 'NOTIFICATION',
  CIRCULAR = 'CIRCULAR',
  GOVERNMENT_ORDER = 'GOVERNMENT_ORDER',
  JUDGEMENT = 'JUDGEMENT',
}

export interface LibraryDocument {
  id: string;
  type: DocumentType;
  title: string;
  description: string;
  date: string;
  content: string;
}

export enum ConsultancyStatus {
  PENDING = 'PENDING',
  SOLUTION_READY = 'SOLUTION_READY',
  COMPLETED = 'COMPLETED',
}

export interface ConsultancyCase {
  id: string;
  date: string;
  issue: string;
  document: File | null;
  documentName: string;
  status: ConsultancyStatus;
  solution?: string;
  isPaid: boolean;
  userName: string;
  userEmail: string;
}
