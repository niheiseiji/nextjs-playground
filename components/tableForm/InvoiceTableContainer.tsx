import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { InvoiceTableView } from "./InvoiceTableView";

/**
 * 巨大なテーブルフォームを作るときの注意点
 * 合計値計算などonChangeをトリガにできると便利だが、ステート更新で画面が重くなる
 * 計算処理はボタンをトリガに実行することでこれを回避できる。
 * →TODO:再レンダリング範囲を極小にすることでどこまで効果があるか要検証
 *
 * useEffectやuseWatchのようなフックは大きなフォームでは画面が重くなるので使えない。
 * ボタンクリックのタイミングでその時点の入力データを取得することでこれを回避できる。
 *
 * react-hook-formを使っても100行レベルでの追加、削除の処理が重くなることは回避できなそう。
 * これは許容するしかないかも。
 */

// 行の生成数
const numRow = 100;
// 工数の列数
const numCol = 2;

type FormValues = {
  itemRows: {
    textItem: string;
    selectItem: string;
    costs: number[];
  }[];
};

export const InvoiceTableContainer: React.FC = () => {
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
        costs: Array(numCol).fill(0), // 列数で動的に生成
      })),
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    name: "itemRows",
    control,
  });

  const [rowCostAmounts, setRowCostAmounts] = useState(Array(numRow).fill(0)); //行合計
  const [colCostAmounts, setColCostAmounts] = useState(Array(numCol).fill(0)); //列合計

  // const calcAll = () => {
  //   // 実行時点のフォームの値を取得する
  //   const itemRows = getValues("itemRows");

  //   // 各行のコストのsum
  //   const newRowTotalCosts = Array(itemRows.length).fill(0);
  //   itemRows.forEach((row, index) => {
  //     row.costs.forEach((cost) => {
  //       newRowTotalCosts[index] += Number(cost);
  //     });
  //   });
  //   // 行合計のセット
  //   setRowCostAmounts(newRowTotalCosts);

  //   // 各列のコストのsum
  //   const numColumns = itemRows[0]?.costs.length || 0; // 列数を確保
  //   const newColTotalCosts = Array(numColumns).fill(0);
  //   itemRows.forEach((row) => {
  //     row.costs.forEach((cost, colIndex) => {
  //       newColTotalCosts[colIndex] += Number(cost); // 正しいインデックスで合計を更新
  //     });
  //   });
  //   // 列合計のセット
  //   setColCostAmounts(newColTotalCosts);
  // };

  // 状態としての oldValue を管理
  const [oldValues, setOldValues] = useState(() =>
    getValues("itemRows").map((row) => [...row.costs])
  );

  const updateCellValue = (
    rowIndex: number,
    columnIndex: number,
    newValue: number
  ) => {
    console.log("updateCellValue");
    console.log("rowIndex:" + rowIndex);
    console.log("columnIndex:" + columnIndex);
    console.log("newValue:" + newValue);
    const oldValue = oldValues[rowIndex][columnIndex];
    console.log("oldValue:" + oldValue);
    const diff = newValue - oldValue;

    // 古い値の更新
    const newOldValues = oldValues.map((row, idx) => {
      if (idx === rowIndex) {
        const newRow = [...row];
        newRow[columnIndex] = newValue;
        return newRow;
      }
      return row;
    });
    setOldValues(newOldValues);

    // 行合計と列合計の更新
    setRowCostAmounts((prev) => {
      const newTotals = [...prev];
      newTotals[rowIndex] += diff;
      return newTotals;
    });

    setColCostAmounts((prev) => {
      const newTotals = [...prev];
      newTotals[columnIndex] += diff;
      return newTotals;
    });
  };

  // 行追加
  const addRow = () => {
    // 新しい行をフォームに追加
    append({
      textItem: "",
      selectItem: "",
      costs: Array(numCol).fill(0),
    });

    // rowCostAmounts に新しい行のコストの初期値を追加
    setRowCostAmounts((prevCosts) => [...prevCosts, 0]);
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
      // calcAll={calcAll}
      updateCellValue={updateCellValue}
      rowCostAmounts={rowCostAmounts}
      colCostAmounts={colCostAmounts}
      numCol={numCol}
    />
  );
};
