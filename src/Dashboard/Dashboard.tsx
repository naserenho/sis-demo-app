import { useAppSelector } from "../store/hooks";
import { StudentsTableContainer } from "./StudentsTableContainer";
import TableHeader from "./TableHeader";

export default function Dashboard() {
  const refresh = useAppSelector((val) => val.student.refresh);
  return (
    <>
      <TableHeader />
      <StudentsTableContainer refresh={refresh} />
    </>
  );
}
