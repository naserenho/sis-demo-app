import {
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { UseFormRegister } from "react-hook-form";

interface ChildInputProps {
  register: UseFormRegister<any>;
  disabled: boolean;
  error: boolean;
  label: string;
  id: string;
  test: string;
  errMessage: string;
  items: Array<{ ID: string; Title: string | undefined }>;
  defaultVal: string;
}

export default function SelectInputForm({
  register,
  disabled,
  error,
  label,
  id,
  test,
  errMessage,
  items,
  defaultVal,
}: ChildInputProps) {
  return (
    <>
      <FormControl fullWidth disabled={disabled} error={error}>
        <InputLabel>{label}</InputLabel>
        <Select
          label={label}
          id={id}
          {...register(id)}
          defaultValue={defaultVal}
        >
          {items.map((item) => (
            <MenuItem key={item.ID} value={item.ID}>
              {item.Title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {error && (
        <FormLabel error data-test={`${test}-error`}>
          {errMessage}
        </FormLabel>
      )}
    </>
  );
}
