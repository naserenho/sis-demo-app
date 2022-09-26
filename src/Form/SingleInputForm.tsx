import { FormLabel, TextField } from "@mui/material";
import { UseFormRegister } from "react-hook-form";

interface ChildInputProps {
  register: UseFormRegister<any>;
  disabled: boolean;
  error: boolean;
  label: string;
  id: string;
  test: string;
  errMessage: string;
}

export default function SingleInputForm({
  register,
  disabled,
  error,
  label,
  id,
  test,
  errMessage,
}: ChildInputProps) {
  return (
    <>
      <TextField
        autoComplete={test}
        required
        fullWidth
        id={id}
        label={label}
        autoFocus
        disabled={disabled}
        error={error}
        inputProps={{ "data-test": test }}
        {...register(id)}
      />
      {error && (
        <FormLabel error data-test={`${test}-error`}>
          {errMessage}
        </FormLabel>
      )}
    </>
  );
}
