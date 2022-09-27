import { Backdrop, Button, CircularProgress, Grid } from "@mui/material";
import { useAppDispatch } from "../store/hooks";
import { closeModal } from "../features/students/student-slice";

const FormActions = ({
  disabled,
  postStatus,
}: {
  disabled: boolean;
  postStatus: "idle" | "pending" | "success" | "error";
}) => {
  const dispatch = useAppDispatch();

  const handleClose = () => dispatch(closeModal());

  return (
    <Grid item xs={12} sx={{ textAlign: "end" }}>
      <Button
        sx={{ mr: 2 }}
        disabled={disabled}
        type="submit"
        variant="contained"
        data-test="submit-student-details"
      >
        Submit
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            position: "absolute",
          }}
          open={postStatus === "pending"}
        >
          <CircularProgress color="inherit" size={20} />
        </Backdrop>
      </Button>
      <Button variant="outlined" onClick={handleClose}>
        Cancel
      </Button>
    </Grid>
  );
};

export default FormActions;
