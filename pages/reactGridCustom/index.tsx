import React from 'react';
import { NextPage } from 'next';
import { WorkhoursGrid } from '../../components/reactGrid/sampleSrc/WorkhoursGrid';
import "@silevis/reactgrid/styles.css";

const ReactGridPage: NextPage = () => {
  return (
    <>
      <h1>スプレッドシートUIサンプル(reactGrid - 無償ライブラリ)</h1>
      <WorkhoursGrid rowHeight={25} color={''} />
      <h3>実装機能一覧</h3>
      <ul>
        <li>コピー&ペーストショートカット(ctrl+c, ctrl+v)</li>
        <li>セル移動ショートカット(方向キー↑←↓→, tabキー)</li>
        <li>プルダウンセル</li>
        <li>集計セル(工数の和)</li>
        <li>行追加/削除</li>
        <li>列追加/削除</li>
        <li>行列固定</li>
        <li>オートフィル</li>
        <li>[未実装]ショートカット(ctrl+z,ctrl+y)</li>
        <li>[未実装]フィルタ</li>
        <li>[未実装]非同期検索</li>
      </ul>
    </>
  );
};

export default ReactGridPage;