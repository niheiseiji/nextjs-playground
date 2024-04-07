import React, { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { InvoiceTableView } from "./InvoiceTableView";

/**
 * 巨大なテーブルフォームを作るときの注意点
 * 合計値計算などonChangeをトリガにできると便利だが、ステート更新で画面が重くなる
 * 計算処理はボタンをトリガに実行することでこれを回避できる。
 *
 * useEffectやuseWatchのようなフックは大きなフォームでは画面が重くなるので使えない。
 * ボタンクリックのタイミングでその時点の入力データを取得することでこれを回避できる。
 *
 * react-hook-formを使っても100行レベルでの追加、削除の処理が重くなることは回避できなそう。
 * これは許容するしかないかも。
 */


// 行の生成数
const numRows = 100;

type FormValues = {
  itemRows: {
    itemName: string;
    unitPrice1: number;
    unitPrice2: number;
    unitPrice3: number;
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
      itemRows: Array.from({ length: numRows }, () => ({
        itemName: "",
        unitPrice1: 0,
        unitPrice2: 0,
        unitPrice3: 0,
      })),
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    name: "itemRows",
    control,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [rowAmounts, setRowAmounts] = useState(Array(numRows).fill(0));

  const calcAll = () => {
    const itemRows = getValues("itemRows");
    let totalAmount = 0;
    let rowAmounts: number[] = [];
    // 各行のsum
    itemRows.forEach((row) => {
      const amount =
        Number(row.unitPrice1) +
        Number(row.unitPrice2) +
        Number(row.unitPrice3);
      totalAmount += Number(amount);
      rowAmounts.push(Number(amount));
    });

    // 全行の合計値を計算する
    setTotalAmount(totalAmount);
    setRowAmounts(rowAmounts);
  };

  const onSubmit = (data: FormValues) => console.log(data);

  return (
    <InvoiceTableView
      controlledFields={fields}
      register={register}
      append={() =>
        append({ itemName: "", unitPrice1: 0, unitPrice2: 0, unitPrice3: 0 })
      }
      remove={remove}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      totalAmount={totalAmount}
      isValid={isValid}
      calcAll={calcAll}
      rowAmounts={rowAmounts}
    />
  );
};
