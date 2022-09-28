import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { closeModal, refresh } from "../features/students/student-slice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { postStudentDetails } from "../api/base";
import { useAsync } from "../hooks/use-async";
import TextInputForm from "./TextInputForm";
import SelectInputForm from "./SelectInputForm";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import Collapse from "@mui/material/Collapse";
import CardContent from "@mui/material/CardContent";
import FormActions from "./FormActions";
import ExpandAction from "./ExpandAction";
import NationalityInputForm from "./NationalityInputForm";
import { FamilyMembers } from "../api/types";

const schema = yup.object({
  firstName: yup.string().required().min(3),
  lastName: yup.string().required(),
  dateOfBirth: yup.string().required(),
  nationality: yup.string().required(),
  family: yup.array(
    yup.object({
      ID: yup.number().notRequired(),
      relationship: yup.string().required(),
      firstName: yup.string().required().min(3),
      lastName: yup.string().required(),
      dateOfBirth: yup.string().required(),
      nationality: yup.string().required(),
    })
  ),
});

export type StudentFormValue = yup.InferType<typeof schema>;

export default function StudentForm() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const {
    status: postStatus,
    execute: postForm,
    value: postResult,
  } = useAsync(postStudentDetails);

  const isNew = useAppSelector((state) => state.student.isNew);
  const selectedRole = useAppSelector((state) => state.student.selectedRole);
  const student = useAppSelector((state) => state.student.viewedStudent);
  const relationships = useAppSelector((state) => state.student.relationships);
  const ViewMode = selectedRole === "Admin" && !isNew;

  const {
    control,
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
      family: student?.familyMembers.map((item) => {
        return {
          ID: item.ID,
          nationality: item.nationality?.ID.toString(),
          relationship: item.relationship,
          firstName: item.firstName,
          lastName: item.lastName,
          dateOfBirth: item.dateOfBirth
            ? new Date(item.dateOfBirth).toISOString().split(".")[0]
            : undefined,
        };
      }),
    },
    resolver: yupResolver(schema),
  });

  const {
    fields: family,
    insert,
    remove,
  } = useFieldArray({
    control,
    name: "family",
  });

  useEffect(() => {
    if (!student) {
      reset({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        nationality: "",
        family: [],
      });
    }
  }, [student, reset]);

  useEffect(() => {
    if (postStatus === "success") {
      console.log(postResult);
      dispatch(refresh());
      dispatch(closeModal());
    }
  }, [dispatch, postResult, postStatus]);

  const submitChanges = ({
    firstName,
    lastName,
    dateOfBirth,
    nationality,
    family,
  }: StudentFormValue) => {
    if (ViewMode) return;
    postForm({
      student: {
        firstName,
        lastName,
        dateOfBirth,
        ID: student?.ID,
        nationality: {
          ID: parseInt(nationality),
        },
        familyMembers: family
          ? (family.map((item) => ({
              ID: item.ID,
              relationship: item.relationship,
              firstName: item.firstName,
              lastName: item.lastName,
              dateOfBirth: item.dateOfBirth,
              nationality: { ID: parseInt(item.nationality) },
            })) as FamilyMembers[])
          : [],
      },
      existing: student,
    });
  };
  const handleExpandClick = (index: number) => {
    if (expanded !== index) setExpanded(index);
    else setExpanded(null);
  };

  const handleAddFamily = () => {
    const newInd = family.length;
    insert(newInd, {
      ID: undefined,
      relationship: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      nationality: "",
    });
    setExpanded(newInd);
  };

  return (
    <Box
      component="form"
      noValidate
      sx={{ mt: 3 }}
      onSubmit={handleSubmit(submitChanges)}
    >
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <TextInputForm
            register={register}
            disabled={ViewMode}
            error={!!errors.firstName}
            label="First Name"
            id="firstName"
            errMessage="First name is required"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextInputForm
            register={register}
            disabled={ViewMode}
            error={!!errors.lastName}
            label="Last Name"
            id="lastName"
            errMessage="Last name is required"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <TextField
            fullWidth
            required
            id="dateOfBirth"
            label="Date of birth"
            type="datetime-local"
            disabled={ViewMode}
            InputLabelProps={{
              shrink: true,
            }}
            error={!!errors.dateOfBirth}
            inputProps={{ "data-test": "dateOfBirth" }}
            {...register("dateOfBirth")}
          />
          {!!errors.dateOfBirth && (
            <FormLabel error data-test="dateOfBirth-error">
              Date of Birth is required
            </FormLabel>
          )}
        </Grid>
        <Grid item md={6} xs={12}>
          <NationalityInputForm
            register={register}
            disabled={ViewMode}
            error={!!errors.nationality}
            id="nationality"
            defaultVal={student?.nationality?.ID.toString() ?? ""}
          />
        </Grid>
        <Divider />
        <Grid item md={12} xs={12}>
          <Box
            rowGap="0.5rem"
            flexDirection="column"
            sx={{
              padding: 2,
              border: "1px solid #aaa",
              mt: 2,
              display: "flex",
            }}
          >
            <Typography variant="h6">Family Members</Typography>
            <Divider sx={{ mt: 1 }} />
            {family.map((item, ind) => (
              <Card
                data-test={`family-member-${ind + 1}`}
                key={item.id}
                data-identifier={item.ID}
              >
                <CardHeader
                  onClick={() => handleExpandClick(ind)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                  }}
                  avatar={
                    <Avatar sx={{ bgcolor: "lightgrey" }} aria-label="recipe">
                      {`${
                        item.firstName && item.lastName
                          ? item.firstName[0].toUpperCase() +
                            item.lastName[0].toUpperCase()
                          : ind + 1
                      }`}
                    </Avatar>
                  }
                  action={<ExpandAction expand={expanded === ind} />}
                  title={`${
                    item.firstName
                      ? item.firstName + (" " + item.lastName ?? "")
                      : "Family Member # " + (ind + 1)
                  }`}
                  subheader={item.relationship}
                />
                <Collapse in={expanded === ind} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item md={6} xs={12}>
                        <TextInputForm
                          register={register}
                          disabled={ViewMode}
                          error={!!errors.family?.[ind]?.firstName}
                          label="First Name"
                          id={`family.${ind}.firstName`}
                          errMessage="First name is required"
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextInputForm
                          register={register}
                          disabled={ViewMode}
                          error={!!errors.family?.[ind]?.lastName}
                          label="Last Name"
                          id={`family.${ind}.lastName`}
                          errMessage="Last name is required"
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          fullWidth
                          required
                          id="date-of-birth"
                          label="Date of birth"
                          type="datetime-local"
                          disabled={ViewMode}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          error={!!errors.family?.[ind]?.dateOfBirth}
                          inputProps={{
                            "data-test": `family.${ind}.dateOfBirth`,
                          }}
                          {...register(`family.${ind}.dateOfBirth`)}
                        />
                        {!!errors.family?.[ind]?.dateOfBirth && (
                          <FormLabel
                            error
                            data-test={`family.${ind}.dateOfBirth-error`}
                          >
                            Date of Birth is required
                          </FormLabel>
                        )}
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <NationalityInputForm
                          register={register}
                          disabled={ViewMode}
                          error={!!errors.family?.[ind]?.nationality}
                          id={`family.${ind}.nationality`}
                          defaultVal={family?.[ind]?.nationality ?? ""}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <SelectInputForm
                          register={register}
                          disabled={ViewMode}
                          error={!!errors.family?.[ind]?.relationship}
                          label="Relationship"
                          id={`family.${ind}.relationship`}
                          errMessage="Please select a relationship"
                          defaultVal={family?.[ind]?.relationship ?? ""}
                          items={relationships.map((item) => {
                            return {
                              ID: item,
                              Title: item,
                            };
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} textAlign="end" hidden={ViewMode}>
                        <Button
                          data-test={`family.${ind}.delete`}
                          color="error"
                          variant="outlined"
                          startIcon={<DeleteIcon />}
                          onClick={(ev) => {
                            ev.preventDefault();
                            if (
                              isNew ||
                              window.confirm(
                                "Confirm deleting the family member?"
                              )
                            ) {
                              remove(ind);
                              setExpanded(null);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Collapse>
              </Card>
            ))}
            <Grid
              sx={{
                flex: 1,
                mt: 2,
              }}
              hidden={ViewMode}
            >
              <Button
                data-test="add-family-member"
                variant="contained"
                color="success"
                startIcon={<AddCircleOutlineIcon />}
                onClick={(ev) => {
                  ev.preventDefault();
                  handleAddFamily();
                }}
              >
                Add Family Member
              </Button>
            </Grid>
          </Box>
        </Grid>
        <FormActions disabled={ViewMode} postStatus={postStatus} />
      </Grid>
    </Box>
  );
}
