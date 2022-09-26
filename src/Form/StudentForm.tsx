import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { closeModal, refresh } from "../features/students/student-slice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { postStudentDetails } from "../api/base";
import { useAsync } from "../hooks/use-async";
import SingleInputForm from "./SingleInputForm";

const schema = yup.object({
  firstName: yup.string().required().min(3),
  lastName: yup.string().required(),
  dateOfBirth: yup.string().required(),
  nationality: yup.string().required(),
  // familyMembers: yup.array(
  //   yup.object({
  //     relationship: yup.string().required(),
  //     firstName: yup.string().required().min(3),
  //     lastName: yup.string().required(),
  //     dateOfBirth: yup.date().required(),
  //     nationality: yup.string().required(),
  //   })
  // ),
});

export type StudentFormValue = yup.InferType<typeof schema>;

export default function ModalForm() {
  const dispatch = useAppDispatch();
  const { status: postStatus, execute: postForm } =
    useAsync(postStudentDetails);

  const isNew = useAppSelector((state) => state.student.isNew);
  const selectedRole = useAppSelector((state) => state.student.selectedRole);
  const student = useAppSelector((state) => state.student.viewedStudent);
  const nationalities = useAppSelector((state) => state.student.nationalities);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StudentFormValue>({
    defaultValues: {
      firstName: student?.firstName,
      lastName: student?.lastName,
      dateOfBirth: student
        ? new Date(student.dateOfBirth).toISOString().split(".")[0]
        : undefined,
      nationality: student?.nationality?.ID.toString(),
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (!student) {
      reset({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        nationality: "",
      });
    }
  }, [student, reset]);

  useEffect(() => {
    if (postStatus === "success") {
      dispatch(refresh());
      dispatch(closeModal());
    }
  }, [dispatch, postStatus]);

  const ViewMode = selectedRole === "Admin" && !isNew;

  const handleClose = () => dispatch(closeModal());
  const submitChanges = ({
    firstName,
    lastName,
    dateOfBirth,
    nationality,
  }: StudentFormValue) => {
    if (ViewMode) return;
    postForm({
      firstName,
      lastName,
      dateOfBirth,
      ID: student?.ID,
      nationality: {
        ID: parseInt(nationality),
      },
      familyMembers: [],
    });
  };

  return (
    <Box
      component="form"
      noValidate
      sx={{ mt: 3 }}
      onSubmit={handleSubmit(submitChanges)}
    >
      <Grid container spacing={2}>
        {/* {status === "error" && (
                <Grid item xs>
                  <Alert severity="error" data-test="form-error">
                    {error}
                  </Alert>
                </Grid>
              )} */}
        <Grid item xs={6}>
          <SingleInputForm
            register={register}
            disabled={ViewMode}
            error={!!errors.firstName}
            label="First Name"
            id="firstName"
            test="first-name"
            errMessage="First name is required"
          />
          {/* <TextField
            autoComplete="first-name"
            required
            fullWidth
            id="firstName"
            label="First Name"
            autoFocus
            disabled={ViewMode}
            error={!!errors.firstName}
            inputProps={{ "data-test": "first-name" }}
            {...register("firstName")}
          />
          {!!errors.firstName && (
            <FormLabel error data-test="first-name-error">
              First name is required
            </FormLabel>
          )} */}
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            fullWidth
            id="lastName"
            label="Last Name"
            autoComplete="lastName"
            disabled={ViewMode}
            error={!!errors.lastName}
            inputProps={{ "data-test": "last-name" }}
            {...register("lastName")}
          />
          {!!errors.lastName && (
            <FormLabel error data-test="last-name-error">
              Last name is required
            </FormLabel>
          )}
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            id="date-of-birth"
            label="Date of birth"
            type="datetime-local"
            sx={{ mt: 2 }}
            disabled={ViewMode}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.dateOfBirth}
            inputProps={{ "data-test": "date-of-birth" }}
            {...register("dateOfBirth")}
          />
          {!!errors.dateOfBirth && (
            <FormLabel error data-test="date-of-birth-error">
              Date of Birth is required
            </FormLabel>
          )}
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth disabled={ViewMode}>
            <InputLabel>Nationality</InputLabel>
            <Select
              label="Nationality"
              id="nationality"
              {...register("nationality")}
              defaultValue={student?.nationality?.ID.toString() ?? ""}
            >
              {nationalities.map((item) => (
                <MenuItem key={item.ID} value={item.ID}>
                  {item.Title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "end" }}>
          <Button
            sx={{ mr: 2 }}
            disabled={ViewMode}
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
      </Grid>
    </Box>
  );
}
