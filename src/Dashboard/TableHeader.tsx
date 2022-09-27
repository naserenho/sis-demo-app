import { Box, Grid, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  openModal,
  setNationalities,
} from "../features/students/student-slice";
import { getNationalities } from "../api/base";
import { useCallback } from "react";

export default function TableHeader() {
  const role = useAppSelector((state) => state.student.selectedRole);
  const nationalities = useAppSelector((state) => state.student.nationalities);
  const dispatch = useAppDispatch();

  const addNewPopup = useCallback(async () => {
    dispatch(openModal({ isNew: true }));
    if (nationalities.length === 0) {
      const ntn = await getNationalities();
      dispatch(setNationalities(ntn));
    }
  }, [dispatch, nationalities.length]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container alignItems="flex-end" justifyContent="space-between">
        <h2>All Students</h2>
        <p data-test="add-student" hidden={role === "Registrar"}>
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            size="small"
            onClick={addNewPopup}
          >
            Add Student
          </Button>
        </p>
      </Grid>
    </Box>
  );
}
