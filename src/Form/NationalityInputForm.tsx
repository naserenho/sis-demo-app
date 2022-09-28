import { UseFormRegister } from "react-hook-form";
import { useAppSelector } from "../store/hooks";
import SelectInputForm from "./SelectInputForm";

type Props = {
  register: UseFormRegister<any>;
  disabled: boolean;
  error: boolean;
  defaultVal: string;
  id: string;
};

export default function NationalityInputForm({
  disabled,
  error,
  defaultVal,
  register,
  id,
}: Props) {
  const nationalities = useAppSelector((state) => state.student.nationalities);
  return (
    <SelectInputForm
      register={register}
      disabled={disabled}
      error={error}
      label="Nationality"
      id={id}
      errMessage="Please select a nationality"
      defaultVal={defaultVal}
      items={nationalities.map((item) => {
        return { ID: item.ID.toString(), Title: item.Title };
      })}
    />
  );
}
