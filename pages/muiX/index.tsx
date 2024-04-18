import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { useDemoData } from '@mui/x-data-grid-generator';

export default function DataGridProDemo() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 100000,
    editable: true,
  });

  return (
    <Box sx={{ height: 520, width: '100%' }}>
      <h1>スプレッドシートUIサンプル(MUI X - 商用ライブラリ)</h1>
      <p>※サンプルにつきMissing keyの文字が表示されています</p>
      <DataGridPro
        {...data}
        loading={data.rows.length === 0}
        rowHeight={38}
        checkboxSelection
        disableRowSelectionOnClick
      />
      <h3>スプレットシート機能</h3>
      <ul>
        <li>[未実装]プルダウンセル</li>
        <li>[未実装]行追加</li>
        <li>[未実装]コピー&ペーストショートカット(ctrl+c, ctrl+v)</li>
        <li>[未実装]セル移動ショートカット(方向キー↑←↓→, tabキー)</li>
        <li>[未実装]集計セル(工数の和)</li>
        <li>[未実装]列追加</li>
        <li>[未実装]行削除</li>
        <li>[未実装]列削除</li>
        <li>[未実装]オートフィル</li>
        <li>[未実装]ショートカット(ctrl+z,ctrl+y)</li>
      </ul>
    </Box>
  );
}