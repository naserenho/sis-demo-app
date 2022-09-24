import axios, { AxiosError } from "axios";

export const invoiceBackendAPI = axios.create({
  baseURL: `${process.env.REACT_APP_SIS_BACKEND}`,
});

interface Person {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

interface StudentResponse extends Person {
  ID: number;
}

type NationalityDetails = {
  ID: number;
  Title: string;
};

interface Nationality {
  nationality?: NationalityDetails;
}

type FamilyMemberBasic = {
  relationship: string;
} & StudentResponse;

type FamilyMembers = FamilyMemberBasic & Nationality;

type FullStudentProfile = {
  familyMembers: FamilyMembers[];
} & StudentResponse &
  Nationality;

type StudentNationality = StudentResponse & Nationality;

// Get All Students
export const getAllStudents = async () => {
  try {
    const result = await invoiceBackendAPI.get<StudentResponse[]>("Students");
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
    const result = await invoiceBackendAPI.post<StudentResponse>("Students", {
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
    return await invoiceBackendAPI.put<FullStudentProfile>(`Students/${ID}`, {
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
    const result = await invoiceBackendAPI.get<Nationality>(
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
    const result = await invoiceBackendAPI.put<StudentNationality>(
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
    const result = await invoiceBackendAPI.get<FamilyMembers[]>(
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
    return await invoiceBackendAPI.post<FamilyMemberBasic>(
      `Students/${ID}/FamilyMembers`,
      {
        dateOfBirth,
        firstName,
        lastName,
        relationship,
      }
    );
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
    return await invoiceBackendAPI.put<FamilyMemberBasic>(
      `FamilyMembers/${ID}`,
      {
        dateOfBirth,
        firstName,
        lastName,
        relationship,
      }
    );
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
    const result = await invoiceBackendAPI.delete(`FamilyMembers/${id}`);
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
    const result = await invoiceBackendAPI.get<NationalityDetails>(
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
    return await invoiceBackendAPI.put<FamilyMembers[]>(
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
    const result = await invoiceBackendAPI.get<NationalityDetails[]>(
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
