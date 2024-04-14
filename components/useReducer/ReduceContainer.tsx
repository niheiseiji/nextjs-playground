import React, { useEffect, useMemo, useReducer, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { InvoiceTableView } from "./../tableForm/InvoiceTableView";
import { reducer } from "./reducer";
// 行の生成数
const numRow = 10;
// 工数の列数
const numCol = 10;

type FormValues = {
  itemRows: {
    textItem: string;
    selectItem: string;
    costs: number[];
  }[];
};

export const ReducerContainer: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, {
    rowCostAmounts: Array(numRow).fill(0),
    colCostAmounts: Array(numCol).fill(0),
    oldValues: Array.from({ length: numRow }, () => Array(numCol).fill(0)),
  });

  const {
    register,
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

  const { fields, append, remove } = useFieldArray({
    name: "itemRows",
    control,
  });

  const updateCellValue = (
    rowIndex: number,
    columnIndex: number,
    newValue: number
  ) => {
    dispatch({ type: "UPDATE_CELL", rowIndex, columnIndex, newValue });
  };

  const addRow = () => {
    append({ textItem: "", selectItem: "", costs: Array(numCol).fill(0) });
    dispatch({ type: "ADD_ROW", numCol });
  };

  const onSubmit = (data: FormValues) => {
    // データをJSON文字列に変換
    const jsonData = JSON.stringify(data);
    // 文字列のバイト数を計算（JavaScriptの文字は通常UTF-16でエンコードされるため、1文字を2バイトとする）
    const dataSizeMB = new TextEncoder().encode(jsonData).length / 1024 / 1024;
    // データとそのサイズをコンソールに表示
    console.log(data);
    console.log(`Submitted data size: ${dataSizeMB} MB`);
  };

  return (
    <InvoiceTableView
      controlledFields={fields}
      register={register}
      append={addRow}
      remove={remove}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      isValid={isValid}
      updateCellValue={updateCellValue}
      rowCostAmounts={state.rowCostAmounts}
      colCostAmounts={state.colCostAmounts}
      numCol={numCol}
    />
  );
};
