import { FormLabel, TextField } from "@mui/material";
import { UseFormRegister } from "react-hook-form";

interface ChildInputProps {
  register: UseFormRegister<any>;
  disabled: boolean;
  error: boolean;
  label: string;
  id: string;
  errMessage: string;
}

export default function TextInputForm({
  register,
  disabled,
  error,
  label,
  id,
  errMessage,
}: ChildInputProps) {
  return (
    <>
      <TextField
        required
        fullWidth
        id={id}
        label={label}
        disabled={disabled}
        error={error}
        inputProps={{ "data-test": id }}
        {...register(id)}
      />
      {error && (
        <FormLabel error data-test={`${id}-error`}>
          {errMessage}
        </FormLabel>
      )}
    </>
  );
}
