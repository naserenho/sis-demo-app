export interface Person {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface StudentResponse extends Person {
  ID: number | undefined;
}

export type NationalityDetails = {
  ID: number;
  Title?: string;
};

export interface Nationality {
  nationality?: NationalityDetails;
}

export type FamilyMemberBasic = {
  relationship: string;
} & StudentResponse;

export type FamilyMembers = FamilyMemberBasic & Nationality;

export type FullStudentProfile = {
  familyMembers: FamilyMembers[];
} & StudentResponse &
  Nationality;

export type StudentNationality = StudentResponse & Nationality;
