// pages/tableForm/index.tsx
import React from "react";
import { NextPage } from "next";
import { ReducerContainer } from "../../components/useReducer/ReduceContainer"; // コンポーネントのパスは適宜調整してください

const TableFormPage: NextPage = () => {
  return (
    <div>
      <h1>テーブルフォーム react-hook-form useReducerを使った実装例</h1>
      <ReducerContainer />
    </div>
  );
};

export default TableFormPage;
