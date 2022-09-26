import classes from "./Header.module.css";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setRole, RolesEnum } from "../features/students/student-slice";

const Header = () => {
  const role = useAppSelector((state) => state.student.selectedRole);
  const dispatch = useAppDispatch();

  const handleChange = (event: SelectChangeEvent) => {
    //dispatch(event.target.value as string);
    dispatch(setRole(event.target.value as RolesEnum));
  };

  return (
    <header className={classes.header}>
      <div className={classes.logo}>Student Information System</div>
      <nav>
        <Box className={classes.selectRole}>
          <FormControl fullWidth>
            <Select id="system-role" value={role} onChange={handleChange}>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Registrar">Registrar</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </nav>
    </header>
  );
};

export default Header;
