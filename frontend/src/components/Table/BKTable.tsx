import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
} from "@mui/material";
import { Edit, Check, Close, Undo } from "@mui/icons-material";

interface EditableTableProps {
  columns: string[];
  name?: string;
  data: any[];
  setData: (newData: any) => void;
}

export function BKTable(props: EditableTableProps) {
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
    newData[index] = editData;
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

  return (
    <Table>
      <TableHead>
        {props.name && <TableRow>
          <TableCell colSpan={props.columns.length + 1}>
            <h3>{props.name}</h3>
          </TableCell>
        </TableRow>}
        <TableRow>
          {props.columns.map((column) => (
            <TableCell key={column}>{column}</TableCell>
          ))}
          <TableCell onClick={handleSaveAll}> save all </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.data.map((row, index) =>
          editIndex === index ? (
            <TableRow key={index}>
              {props.columns.map((column) => (
                <TableCell key={column}>
                  <TextField
                    name={column}
                    value={editData[column]?.toString() || ""}
                    onChange={handleInputChange}
                  />
                </TableCell>
              ))}
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
            <TableRow key={index}>
              {props.columns.map((column) => (
                <TableCell key={column}>{row[column]?.toString()}</TableCell>
              ))}
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
