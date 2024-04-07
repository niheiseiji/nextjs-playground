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
  rowAmounts: number[];
  rowCostAmounts: number[];
  totalAmount: number;
  totalCostAmount: number;
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
  rowAmounts,
  rowCostAmounts,
  totalAmount,
  totalCostAmount,
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
          {rowCostAmounts.map((_val, index) => (
            <TableCell key={`cost_${index}`}>{`コスト${index}`}</TableCell>
          ))}
          <TableCell>合計</TableCell>
          <TableCell>削除</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {controlledFields.map((field, index) => (
          <TableRow key={`row_${field.id}`}>
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
            {rowCostAmounts.map((_val, idx) => (
              <TableCell key={`rowCostAmount_${index}_${idx}`}>
                <TextField
                  {...register(`itemRows.${index}.costs.${idx}`)}
                  type="number"
                  size="small"
                />
              </TableCell>
            ))}
            <TableCell>{rowCostAmounts[index]}</TableCell>
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

    <Typography>価格合計: {totalAmount}円</Typography>
    <Typography>コスト合計: {totalCostAmount}円</Typography>
    <Button type="submit" disabled={!isValid}>
      送信
    </Button>
  </form>
);
