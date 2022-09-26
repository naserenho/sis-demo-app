import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  NationalityDetails,
  StudentResponse,
  FullStudentProfile,
} from "../../api/types";

export type RolesEnum = "Admin" | "Registrar";

interface StudentState {
  selectedRole: RolesEnum;
  isModalOpen: boolean;
  isNew: boolean;
  viewedStudent: FullStudentProfile | null;
  students: StudentResponse[];
  nationalities: NationalityDetails[];
  refresh: boolean;
}

const initialState: StudentState = {
  selectedRole: "Admin",
  isModalOpen: false,
  isNew: true,
  viewedStudent: null,
  students: [],
  nationalities: [],
  refresh: false,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    openModal(
      state,
      action: PayloadAction<{ isNew: boolean; student?: FullStudentProfile }>
    ) {
      state.isModalOpen = true;
      state.isNew = action.payload.isNew;
      if (action.payload.student) {
        state.viewedStudent = action.payload.student;
      } else state.viewedStudent = null;
    },
    closeModal(state) {
      state.isModalOpen = false;
      state.viewedStudent = null;
    },
    setRole(state, action: PayloadAction<RolesEnum>) {
      state.selectedRole = action.payload;
    },
    setStudents(state, action: PayloadAction<StudentResponse[]>) {
      state.students = action.payload;
    },
    refresh(state) {
      state.refresh = !state.refresh;
    },
    setNationalities(state, action: PayloadAction<NationalityDetails[]>) {
      state.nationalities = action.payload;
    },
  },
});

export const {
  openModal,
  closeModal,
  setRole,
  setStudents,
  refresh,
  setNationalities,
} = studentSlice.actions;

export default studentSlice.reducer;
