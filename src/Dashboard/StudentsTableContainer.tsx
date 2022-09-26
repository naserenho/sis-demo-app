import { useEffect } from "react";
import { getAllStudents } from "../api/base";
import { useAsync } from "../hooks/use-async";
import Alert from "@mui/material/Alert";
import { StudentsTable } from "./StudentsTable";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useAppDispatch } from "../store/hooks";
import { setStudents } from "../features/students/student-slice";

export const StudentsTableContainer = ({ refresh }: { refresh: boolean }) => {
  const {
    status: studentStatus,
    value: studentValue,
    execute: GetStudents,
    setStatus,
  } = useAsync(getAllStudents);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setStatus("idle");
    setTimeout(() => {
      GetStudents(null);
    }, 1000);
  }, [refresh, GetStudents, setStatus]);

  useEffect(() => {
    if (
      studentStatus === "success" &&
      studentValue &&
      studentValue.length > 0
    ) {
      dispatch(setStudents(studentValue));
    }
  }, [studentValue, studentStatus, dispatch]);

  if (studentStatus === "idle" || studentStatus === "pending") {
    return (
      <Stack data-test="loading-overlay" spacing={0.2}>
        <Skeleton variant="rectangular" height={56} animation="wave" />
        <Skeleton variant="rectangular" height={200} animation="wave" />
      </Stack>
    );
  }

  if (studentStatus === "error") {
    return (
      <Alert data-test="students-fetch-error" severity="error">
        Oops, something went wrong
      </Alert>
    );
  }

  if (!studentValue || studentValue.length === 0) {
    return (
      <Alert severity="warning" data-test="empty-placeholder">
        No students Available
      </Alert>
    );
  }

  return <StudentsTable />;
};
