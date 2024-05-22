import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

type InvoiceTableProps = {
  controlledFields: any[];
  register: any;
  append: () => void;
  remove: (index: number) => void;
  handleSubmit: any;
  onSubmit: (data: any) => void;
  rowCostAmounts: number[];
  colCostAmounts: number[];
  isValid: boolean;
  // calcAll: () => void;
  updateCellValue: (a:number, b:number, c:number) => void;
  // handleCellValueChange:()=>void;
  numCol: number;
};

export const InvoiceTableView: React.FC<InvoiceTableProps> = ({
  controlledFields,
  register,
  append,
  remove,
  handleSubmit,
  onSubmit,
  rowCostAmounts,
  colCostAmounts,
  isValid,
  // calcAll,
  updateCellValue,
  numCol,
}) => (
  <form onSubmit={handleSubmit(onSubmit)}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>削除</TableCell>
          <TableCell>テキスト</TableCell>
          <TableCell>セレクト</TableCell>
          {Array(numCol)
            .fill(0)
            .map((_val, index) => (
              <TableCell key={`cost_${index}`}>{`コスト${index}`}</TableCell>
            ))}
          <TableCell>合計</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {controlledFields.map((field, index) => (
          <TableRow key={`row_${field.id}`}>
            <TableCell>
              <IconButton onClick={() => remove(index)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
            <TableCell>
              <TextField
                {...register(`itemRows.${index}.textItem`)}
                size="small"
              />
            </TableCell>
            <TableCell>
              <TextField
                {...register(`itemRows.${index}.selectItem`)}
                size="small"
              />
            </TableCell>
            {Array(numCol)
              .fill(0)
              .map((_val, idx) => (
                <TableCell key={`rowCostAmount_${index}_${idx}`}>
                  <TextField
                    {...register(`itemRows.${index}.costs.${idx}`)}
                    type="number"
                    size="small"
                    // onBlur={calcAll}
                    onBlur={(e) => {
                      const newValue = Number(e.target.value);
                      updateCellValue(index, idx, newValue);
                    }}
                  />
                </TableCell>
              ))}
            <TableCell>{rowCostAmounts[index]}</TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={3}> </TableCell>
          {colCostAmounts.map((field, index) => (
            <TableCell key={`rowCostAmount_${index}`}>{field}</TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell colSpan={6}>
            <Button startIcon={<AddIcon />} onClick={append}>
              行を追加
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    {/* <Button onClick={calcAll}>合計を計算</Button> */}

    <Button type="submit" disabled={!isValid}>
      送信
    </Button>
  </form>
);
