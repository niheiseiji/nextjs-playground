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
  totalAmount: number;
  rowAmounts: number[];
  isValid: boolean;
  calcAll: () => void;
};

export const InvoiceTableView: React.FC<InvoiceTableProps> = ({
  controlledFields,
  register,
  append,
  remove,
  handleSubmit,
  onSubmit,
  totalAmount,
  rowAmounts,
  isValid,
  calcAll,
}) => (
  <form onSubmit={handleSubmit(onSubmit)}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>アイテム名</TableCell>
          <TableCell>工数1</TableCell>
          <TableCell>工数2</TableCell>
          <TableCell>工数3</TableCell>
          <TableCell>合計</TableCell>
          <TableCell>削除</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {controlledFields.map((field, index) => (
          <TableRow key={field.id}>
            <TableCell>
              <TextField
                {...register(`itemRows.${index}.itemName`)}
                size="small"
              />
            </TableCell>
            <TableCell>
              <TextField
                {...register(`itemRows.${index}.unitPrice1`)}
                type="number"
                size="small"
              />
            </TableCell>
            <TableCell>
              <TextField
                {...register(`itemRows.${index}.unitPrice2`)}
                type="number"
                size="small"
              />
            </TableCell>
            <TableCell>
              <TextField
                {...register(`itemRows.${index}.unitPrice3`)}
                type="number"
                size="small"
              />
            </TableCell>
            <TableCell>{rowAmounts[index]}</TableCell>
            <TableCell>
              <IconButton onClick={() => remove(index)}>
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
        <TableRow>
          <TableCell colSpan={6}>
            <Button startIcon={<AddIcon />} onClick={append}>
              行を追加
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <Button onClick={calcAll}>合計を計算</Button>

    <Typography>小計: {totalAmount}円</Typography>
    <Button type="submit" disabled={!isValid}>
      送信
    </Button>
  </form>
);
