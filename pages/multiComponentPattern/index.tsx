// pages/tableForm/index.tsx
import React from "react";
import { NextPage } from "next";
import { MultiComponentContainer } from "../../components/multiComponentPattern/MultiComponentContainer"; // コンポーネントのパスは適宜調整してください

const TableFormPage: NextPage = () => {
  return (
    <div>
      <h1>テーブルフォーム react-hook-form useReducerを使った実装例</h1>
      <MultiComponentContainer />
    </div>
  );
};

export default TableFormPage;
