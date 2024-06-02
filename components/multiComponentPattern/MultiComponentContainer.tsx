import React, { useReducer, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { InvoiceTableView } from "./../tableForm/InvoiceTableView";

const numRow = 100; // 行の生成数
const numCol = 2; // 工数の列数

type FormValues = {
  itemRows: {
    textItem: string;
    selectItem: string;
    costs: number[];
  }[];
};

const initialState = {
  rowTotals: Array(numRow).fill(0),
  colTotals: Array(numCol).fill(0),
};

const reducer = (
  state: { rowTotals: any; colTotals: any },
  action: { type?: any; rowIndex?: any; columnIndex?: any; diff?: any }
) => {
  switch (action.type) {
    case "UPDATE_TOTALS":
      const { rowIndex, columnIndex, diff } = action;
      const newRowTotals = [...state.rowTotals];
      const newColTotals = [...state.colTotals];
      newRowTotals[rowIndex] += diff;
      newColTotals[columnIndex] += diff;
      return {
        ...state,
        rowTotals: newRowTotals,
        colTotals: newColTotals,
      };
    default:
      return state;
  }
};

export const MultiComponentContainer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    control,
    handleSubmit,
    getValues,
    formState: { isValid },
  } = useForm<FormValues>({
    defaultValues: {
      itemRows: Array.from({ length: numRow }, () => ({
        textItem: "",
        selectItem: "",
        costs: Array(numCol).fill(0),
      })),
    },
    mode: "onBlur",
  });

  const { fields } = useFieldArray({ name: "itemRows", control });

  const handleBlur = useCallback(
    (rowIndex: number, columnIndex: number, oldValue: number) => {
      const path: any = `itemRows.${rowIndex}.costs.${columnIndex}`;
      const newValue = parseFloat(getValues(path)); // 型アサーションを使用
      const diff = newValue - oldValue;
      dispatch({ type: "UPDATE_TOTALS", rowIndex, columnIndex, diff });
    },
    [getValues, dispatch]
  );

  return (
    <InvoiceTableView
      controlledFields={fields}
      updateCellValue={handleBlur}
      rowCostAmounts={state.rowTotals}
      colCostAmounts={state.colTotals}
      isValid={isValid}
      handleSubmit={handleSubmit} register={undefined} append={function (): void {
        throw new Error("Function not implemented.");
      } } remove={function (index: number): void {
        throw new Error("Function not implemented.");
      } } onSubmit={function (data: any): void {
        throw new Error("Function not implemented.");
      } } numCol={0}    />
  );
};

export default MultiComponentContainer;
