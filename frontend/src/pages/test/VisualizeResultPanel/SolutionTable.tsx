import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Typography,
  Link,
  Box,
} from "@mui/material";
import { Edit, Check, Close, Undo } from "@mui/icons-material";

interface TimetableCellProps {
  id: string,
  subject: string,
  instructor: string,
  room: string,
  weekday: string,
  period: string,
  time: string,
  entrants: number,
  capableStudents: string[],
  type: "not_available" | "origin" | "new" | "modified" | "new_modified";
}

interface EditableTableProps {
  columns: string[];
  name?: string;
  data: TimetableCellProps[];
  setData: (newData: any) => void;
  setViewData: () => void;
}

export function SolutionTable(props: EditableTableProps) {
  const [editIndex, setEditIndex] = useState(-1);
  const [editData, setEditData] = useState<{ [key: string]: any }>({});
  const [originalData, setOriginalData] = useState([]);

  console.log(`worked2: ${JSON.stringify(props.data)}`)

  useEffect(() => {
    console.log(`worked: ${JSON.stringify(props.data)}`)
    setOriginalData([...props.data]);
  }, [props.data]);

  const handleEdit = (index: number) => {
    // setOriginalData(props.data);
    setEditIndex(index);
    setEditData(props.data[index]);
  };

  const handleCancel = () => {
    setEditIndex(-1);
    setEditData({});
    // setOriginalData([]);
  };

  const handleSave = (index: number) => {
    const newData = [...props.data];
    newData[index] = editData as any;
    // Save the new data to your data source
    // props.setData(newData);
    setEditIndex(-1);
  };

  const handleSaveAll = () => {
    // props.setData(editData);
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (editData[name] !== value) {
      setEditData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleUndo = (index: number) => {
    console.log('originalData:', JSON.stringify(originalData));
    const newData = [...originalData];
    console.log('newData before:', JSON.stringify(newData));
    newData[index] = { ...originalData[index] };
    console.log('newData after:', JSON.stringify(newData));
    props.setData(newData);
  };

  const headers = [
    "Id", "Subject", "Instructor", "Room", "Weekday", "Period", "Time", "Size", "Students"
  ]
  const [isStudentExpanded, setIsStudentExpaned] = useState(false);

  return (
    <Table>
      <TableHead>
        {/* <TableRow>
          <TableCell colSpan={props.columns.length + 1}>
            <h3>{props.name}</h3>
          </TableCell>
        </TableRow> */}
        <TableRow>
          {headers.map((column) => (
            <TableCell key={column}>
              <Typography fontWeight="bold"> {column}</Typography>
            </TableCell>
          ))}
          {/* <TableCell onClick={handleSaveAll}> save all </TableCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {props.data.map((row, index) =>
          editIndex === index ? (
            <TableRow key={index}>
              <TableCell key={"id"}>
                <TextField
                  name={"id"}
                  value={editData["id"]?.toString() || ""}
                  onChange={handleInputChange}
                />
              </TableCell>

              <TableCell key={"subject"}>
                <TextField
                  name={"subject"}
                  value={editData["subject"]?.toString() || ""}
                  onChange={handleInputChange}
                />
              </TableCell>

              <TableCell key={"instructor"}>
                <TextField
                  name={"instructor"}
                  value={editData["instructor"]?.toString() || ""}
                  onChange={handleInputChange}
                />
              </TableCell>

              <TableCell key={"room"}>
                <TextField
                  name={"room"}
                  value={editData["room"]?.toString() || ""}
                  onChange={handleInputChange}
                />
              </TableCell>

              <TableCell key={"period"}>
                <TextField
                  name={"period"}
                  value={editData["period"]?.toString() || ""}
                  onChange={handleInputChange}
                />
              </TableCell>

              <TableCell key={"time"}>
                <TextField
                  name={"time"}
                  value={editData["time"]?.toString() || ""}
                  onChange={handleInputChange}
                />
              </TableCell>

              <TableCell key={"entrants"}>
                <TextField
                  name={"entrants"}
                  value={editData["entrants"]?.toString() || ""}
                  onChange={handleInputChange}
                />
              </TableCell>

              <TableCell key={"capableStudents"}>
                <TextField
                  name={"capableStudents"}
                  value={editData["capableStudents"]?.toString() || ""}
                  onChange={handleInputChange}
                />
              </TableCell>
              {/* {props.columns.map((column) => (
                <TableCell key={column}>
                  <TextField
                    name={column}
                    value={editData[column]?.toString() || ""}
                    onChange={handleInputChange}
                  />
                </TableCell>
              ))} */}
              <TableCell>
                <IconButton onClick={() => handleSave(index)}>
                  <Check />
                </IconButton>
                <IconButton onClick={handleCancel}>
                  <Close />
                </IconButton>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow key={index} style={{
              // backgroundColor: hue["modified"]
              backgroundColor: hue[row["type"] as keyof typeof hue]
            }}>
              <TableCell key={"id"}>
                {row["id"]?.toString()}
              </TableCell>

              <TableCell key={"subject"}>
                {row["subject"]?.toString()}
              </TableCell>

              <TableCell key={"instructor"}>
                <Link href="#">
                  {row["instructor"]?.toString()}
                </Link>
              </TableCell>

              <TableCell key={"room"}>
                <Link href="#">
                  {row["room"]?.toString()}
                </Link>
              </TableCell>

              <TableCell key={"weekday"}>
                <EditableBox>{weekday[row["weekday"]?.toString() as keyof typeof weekday]}</EditableBox>
              </TableCell>

              <TableCell key={"period"}>
                {row["period"]?.toString()}
              </TableCell>

              <TableCell key={"time"}>
                {row["time"]?.toString()}
              </TableCell>

              <TableCell key={"entrants"}>
                {row["entrants"]?.toString()}
              </TableCell>

              <TableCell key={"capableStudents"} onClick={() => setIsStudentExpaned(expanded => !expanded)}>
                {/* {row["capableStudents"]?.toString()} */}

                {/* <EditableBox onClick={() => setIsStudentExpaned((cur) => !cur)}> */}
                {!isStudentExpanded && `${row["capableStudents"]?.length} students`}
                {/* </EditableBox> */}
                {isStudentExpanded && <Typography>
                  {row["capableStudents"]?.join(', ')}
                </Typography>}
              </TableCell>
              {/* {props.columns.map((column) => (
                <TableCell key={column}>{row[column]?.toString()}</TableCell>
              ))} */}
              <TableCell>
                {
                  originalData[index] ? (
                    <IconButton onClick={() => handleUndo(index)}>
                      <Undo />
                    </IconButton>
                  ) : ""
                }

                <IconButton onClick={() => handleEdit(index)}>
                  <Edit />
                </IconButton>
              </TableCell>
            </TableRow>
          )
        )}
      </TableBody>
    </Table>
  );
}


const weekday = {
  "2": "Monsday",
  "3": "Tuesday",
  "4": "Wednesday",
  "5": "Thursday",
  "6": "Friday",
}

export const hue = {
  not_available: "",
  origin: "#f2f2f2", // light-gray
  new: "#c3e6cb", //green
  modified: "#ffb347", // orange pastel
  new_modified: "#ffd1dc" // pink pastel
}

const EditableBox = ({ children, onClick, enableEdit = true }: any) => {
  return (
    <Box
      borderRadius={2}
      p={2}
      // bgcolor="#f5f5f5"
      height={40}
      // width={300}
      sx={{
        // border: "1px solid",
        // borderColor: "primary.main",
        padding: "8px !important",
        '&:hover': enableEdit && {
          border: "1px solid",
          borderColor: "primary.main",
          cursor: "pointer",
          opacity: [0.9, 0.8, 0.7],
        },
      }}
      onClick={onClick}>
      {children}
    </Box>)
}