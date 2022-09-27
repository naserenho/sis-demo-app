import axios, { AxiosError } from "axios";
import {
  FamilyMemberBasic,
  FamilyMembers,
  FullStudentProfile,
  Nationality,
  NationalityDetails,
  Person,
  StudentNationality,
  StudentResponse,
} from "./types";

export const sisBackendAPI = axios.create({
  baseURL: `${process.env.REACT_APP_SIS_BACKEND}`,
});

// Get All Students
export const getAllStudents = async () => {
  try {
    const result = await sisBackendAPI.get<StudentResponse[]>("Students");
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error.response?.data);
    }
    return Promise.reject("Unknown Error");
  }
};

// Create A new student with basic details only
export const createStudent = async ({
  dateOfBirth,
  firstName,
  lastName,
}: Person) => {
  try {
    const result = await sisBackendAPI.post<StudentResponse>("Students", {
      dateOfBirth,
      firstName,
      lastName,
    });
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error.response?.data);
    }
    return Promise.reject("Unknown Error");
  }
};

// Update basic details of a student
export const updateStudent = async ({
  ID,
  dateOfBirth,
  firstName,
  lastName,
}: StudentResponse) => {
  try {
    return await sisBackendAPI.put<FullStudentProfile>(`Students/${ID}`, {
      dateOfBirth,
      firstName,
      lastName,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error.response?.data);
    }
    return Promise.reject("Unknown Error");
  }
};

// Get the nationality of a student
export const getStudentNationality = async (id: string) => {
  try {
    const result = await sisBackendAPI.get<Nationality>(
      `Students/${id}/Nationality`
    );
    if (!result) {
      return Promise.reject("Cannot connect to the server");
    }
    return result.data.nationality;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error.response?.data);
    }
    return Promise.reject("Unknown Error");
  }
};

// Update the nationality of a student
export const updateStudentNationality = async (
  id: string,
  nationalityId: string
) => {
  try {
    const result = await sisBackendAPI.put<StudentNationality>(
      `Students/${id}/Nationality/${nationalityId}`
    );
    if (!result) {
      return Promise.reject("Cannot connect to the server");
    }
    return result.data.nationality;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error.response?.data);
    }
    return Promise.reject("Unknown Error");
  }
};

// Gets all family members of a student
export const getStudentFamilyMembers = async (id: string) => {
  try {
    const result = await sisBackendAPI.get<FamilyMembers[]>(
      `Students/${id}/FamilyMembers`
    );
    if (!result) {
      return Promise.reject("Cannot connect to the server");
    }
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error.response?.data);
    }
    return Promise.reject("Unknown Error");
  }
};

// Create a new family member for a student
export const createFamilyMember = async ({
  ID,
  dateOfBirth,
  firstName,
  lastName,
  relationship,
}: FamilyMemberBasic) => {
  try {
    const result = await sisBackendAPI.post<FamilyMemberBasic>(
      `Students/${ID}/FamilyMembers`,
      {
        dateOfBirth,
        firstName,
        lastName,
        relationship,
      }
    );
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error.response?.data);
    }
    return Promise.reject("Unknown Error");
  }
};

// Update a family member for a student
export const updateFamilyMember = async ({
  ID,
  dateOfBirth,
  firstName,
  lastName,
  relationship,
}: FamilyMemberBasic) => {
  try {
    return await sisBackendAPI.put<FamilyMemberBasic>(`FamilyMembers/${ID}`, {
      dateOfBirth,
      firstName,
      lastName,
      relationship,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error.response?.data);
    }
    return Promise.reject("Unknown Error");
  }
};

// Delete a family member for a student
export const deleteFamilyMember = async (id: string) => {
  try {
    const result = await sisBackendAPI.delete(`FamilyMembers/${id}`);
    if (!result) {
      return Promise.reject("Cannot connect to the server");
    }
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error.response?.data);
    }
    return Promise.reject("Unknown Error");
  }
};

// Gets nationality of a family member of a student
export const getFamilyMemberNationality = async (id: string) => {
  try {
    const result = await sisBackendAPI.get<NationalityDetails>(
      `FamilyMembers/${id}/Nationality`
    );
    if (!result) {
      return Promise.reject("Cannot connect to the server");
    }
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error.response?.data);
    }
    return Promise.reject("Unknown Error");
  }
};

// Update the nationality of a family member for a student
export const updateFamilyMemberNationality = async (
  id: string,
  nationalityId: string
) => {
  try {
    return await sisBackendAPI.put<FamilyMembers[]>(
      `FamilyMembers/${id}/Nationality/${nationalityId}`
    );
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error.response?.data);
    }
    return Promise.reject("Unknown Error");
  }
};

// Get all nationalities in the system
export const getNationalities = async () => {
  try {
    const result = await sisBackendAPI.get<NationalityDetails[]>(
      `Nationalities`
    );
    if (!result) {
      return Promise.reject("Cannot connect to the server");
    }
    return result.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return Promise.reject(error.response?.data);
    }
    return Promise.reject("Unknown Error");
  }
};

export const getStudentDetails = async (student: StudentResponse) => {
  try {
    let studentDetails: FullStudentProfile = {
      ...student,
      familyMembers: [],
    };
    const nationality = await getStudentNationality(`${student.ID}`);
    studentDetails.nationality = nationality;
    const res = await getStudentFamilyMembers(`${student.ID}`);
    studentDetails.familyMembers = res;
    return studentDetails;
  } catch (error) {
    return Promise.reject("Unknown Error");
  }
};

export const postStudentDetails = async ({
  student,
  existing,
}: {
  student: FullStudentProfile;
  existing: FullStudentProfile | null;
}) => {
  try {
    let crntId: number = 0;
    if (student.ID) {
      crntId = student.ID;
      if (
        existing?.firstName !== student.firstName ||
        existing.lastName !== student.lastName ||
        existing.dateOfBirth !== student.dateOfBirth
      ) {
        // Update only if any field is different
        const updateBasicDetails = await updateStudent(student);
      }
    } else {
      const newStudent = await createStudent({ ...student });
      if (newStudent.ID) {
        crntId = newStudent.ID;
      }
    }
    if (!existing || existing.nationality?.ID !== student.nationality?.ID) {
      // If student exists with same nationality, no need to update
      const updateNationality = await updateStudentNationality(
        crntId.toString(),
        student.nationality?.ID.toString() ?? ""
      );
    }

    // Handle Family Members
    if (student.familyMembers.length > 0) {
      student.familyMembers.forEach(async (member) => {
        let crntMemberID: number | null = null;
        if (member.ID) {
          crntMemberID = member.ID;
          // Update Family member details and nationality
          const updatedFam = await updateFamilyMember({
            ID: crntMemberID,
            firstName: member.firstName,
            lastName: member.lastName,
            relationship: member.relationship,
            dateOfBirth: member.dateOfBirth,
          });
        } else {
          // Create new Family member
          const createdFam = await createFamilyMember({
            ID: crntId,
            firstName: member.firstName,
            lastName: member.lastName,
            relationship: member.relationship,
            dateOfBirth: member.dateOfBirth,
          });
          if (createdFam.ID) crntMemberID = createdFam.ID;
        }
        if (crntMemberID && member.nationality) {
          const updateNtn = await updateFamilyMemberNationality(
            crntMemberID.toString(),
            member.nationality.ID.toString()
          );
        }
      });
    }

    // Handle deleting family members
    if (existing && existing.familyMembers.length > 0) {
      existing.familyMembers.forEach(async (member) => {
        if (
          member.ID &&
          student.familyMembers.findIndex((value) => value.ID === member.ID) ===
            -1
        ) {
          // Family member doesn't exist in the post payload, hence deleted
          const removedMember = await deleteFamilyMember(member.ID.toString());
        }
      });
    }

    return student;
  } catch (error) {
    return Promise.reject("Unknown Error");
  }
};
