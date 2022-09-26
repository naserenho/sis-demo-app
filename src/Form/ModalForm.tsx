import { Box, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import classes from "./ModalForm.module.css";
import { closeModal } from "../features/students/student-slice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import StudentForm from "./StudentForm";

export default function ModalForm() {
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector((state) => state.student.isModalOpen);
  const isNew = useAppSelector((state) => state.student.isNew);
  const selectedRole = useAppSelector((state) => state.student.selectedRole);

  const ViewMode = selectedRole === "Admin" && !isNew;

  const handleClose = () => dispatch(closeModal());

  return (
    <Modal
      open={isModalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={classes.Modal}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {isNew
            ? "Add a new Student"
            : ViewMode
            ? "View Student Details"
            : "Edit Student Details"}
        </Typography>
        <StudentForm />
      </Box>
    </Modal>
  );
}
