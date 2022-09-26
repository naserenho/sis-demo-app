import {
  DataGrid,
  GridCell,
  GridCellProps,
  GridRow,
  GridRowProps,
  GridCellParams,
  GridColDef,
  GridValueGetterParams,
  GridColumnHeaderParams,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { useCallback } from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import { IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  openModal,
  setNationalities,
} from "../features/students/student-slice";
import { getNationalities, getStudentDetails } from "../api/base";

export const StudentColumns: GridColDef[] = [
  {
    field: "ID",
    renderHeader: (params: GridColumnHeaderParams) => (
      <span data-test="student-id">Student ID</span>
    ),
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => `${params.row.ID}`,
  },
  {
    field: "firstName",
    renderHeader: (params: GridColumnHeaderParams) => (
      <span data-test="student-first-name">First Name</span>
    ),
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => `${params.row.firstName}`,
  },
  {
    field: "lastName",
    renderHeader: (params: GridColumnHeaderParams) => (
      <span data-test="student-last-name">Last Name</span>
    ),
    flex: 1,
    valueGetter: (params: GridValueGetterParams) => `${params.row.lastName}`,
  },
  {
    field: "dateOfBirth",
    renderHeader: (params: GridColumnHeaderParams) => (
      <span data-test="student-birthday">Date of Birth</span>
    ),
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      `${new Date(params.row.dateOfBirth).toISOString().split("T")[0]}`,
  },
  {
    field: "actions",
    headerName: "",
    renderCell: (params: GridRenderCellParams) => (
      <span>
        <IconButton aria-label="delete" onClick={() => {}}>
          <SettingsIcon />
        </IconButton>
      </span>
    ),
    flex: 0.6,
  },
];

export const StudentRow = (
  props: React.HTMLAttributes<HTMLDivElement> & GridRowProps
) => {
  return <GridRow data-test={`student-row-${props.rowId}`} {...props} />;
};

export const StudentCell = (props: GridCellProps) => {
  return <GridCell data-test={`student-${props.field}`} {...props} />;
};

const StudentComponentsWithDataTests = {
  Row: StudentRow,
  Cell: StudentCell,
};

export const StudentsTable = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.student.students);
  const nationalities = useAppSelector((state) => state.student.nationalities);

  const cellHandleClick = useCallback(
    async (params: GridCellParams) => {
      const selectedId = params.row.ID;
      if (params.field === "actions") {
        // Open the popup
        if (nationalities.length === 0) {
          const ntn = await getNationalities();
          dispatch(setNationalities(ntn));
        }
        const index = data.find((val) => val.ID === selectedId);
        if (index) {
          const fullDetails = await getStudentDetails(index);
          dispatch(openModal({ isNew: false, student: fullDetails }));
        }
      }
    },
    [data, dispatch, nationalities.length]
  );

  return (
    <div
      data-test="students-table"
      style={{
        height: 52 * data.length + 58,
        minHeight: 200,
        width: "100%",
      }}
    >
      <DataGrid
        components={StudentComponentsWithDataTests}
        rows={data}
        columns={StudentColumns}
        getRowId={(row) => row.ID}
        hideFooter
        onCellClick={cellHandleClick}
      />
    </div>
  );
};
