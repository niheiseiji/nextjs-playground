import React from 'react';
import { NextPage } from 'next';
import "@silevis/reactgrid/styles.css";
import { UndoRedoSample } from '@/components/reactGrid/undoredo/UndoRedoSample';


const ReactGridPage: NextPage = () => {
  return (
    <>
      <h1>スプレッドシートUI 戻る進む(Ctrl+z,y) サンプル (reactGrid - 無償ライブラリ)</h1>
      <UndoRedoSample/>
      <h3>実装機能一覧</h3>
      <ul>
        <li>
          戻る進むショートカット(ctrl+z,ctrl+y)
        </li>
      </ul>
    </>
  );
};

export default ReactGridPage;