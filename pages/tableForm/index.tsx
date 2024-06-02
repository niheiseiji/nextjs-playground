// pages/tableForm/index.tsx
import React from 'react';
import { NextPage } from 'next';
import { InvoiceTableContainer } from '../../components/tableForm/InvoiceTableContainer'; // コンポーネントのパスは適宜調整してください

const TableFormPage: NextPage = () => {
  return (
    <div>
      <h1>テーブルフォーム react-hook-formを使った実装例</h1>
      <InvoiceTableContainer />
    </div>
  );
};

export default TableFormPage;