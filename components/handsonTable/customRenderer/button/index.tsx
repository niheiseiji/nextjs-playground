import React, { useRef, useEffect } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import Handsontable from 'handsontable';
import { Button } from '@mui/material';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

// Register Handsontable's modules
registerAllModules();

// Define the Option type
type Option = {
  _id: number;
  label: string;
};

// Example options
const colorOptions: Option[] = [
  { _id: 1, label: 'yellow' },
  { _id: 2, label: 'red' },
  { _id: 3, label: 'orange' },
  { _id: 4, label: 'green' },
  { _id: 5, label: 'blue' },
];

// // カスタムレンダラー（ボタンセル）
// const buttonRenderer = (hotInstance, td, row, col, prop, value, cellProperties) => {
//   Handsontable.dom.empty(td);

//   const container = document.createElement('div');
//   container.style.width = '100%';
//   container.style.height = '100%';

//   ReactDOM.render(
//     <Button variant="contained" onClick={() => console.log('hallo')}>
//       Click me
//     </Button>,
//     container
//   );

//   td.appendChild(container);

//   return td;
// };
// カスタムレンダラー（ボタンセル）
const buttonRenderer = (hotInstance, td, row, col, prop, value, cellProperties) => {
  Handsontable.dom.empty(td);

  const container = document.createElement('div');
  container.style.width = '100%';
  container.style.height = '100%';

  const root = createRoot(container);
  root.render(
    <Button size='small' sx={{ width: 1 }} variant="contained" onClick={() => console.log('hallo')}>
      Click me
    </Button>
  );

  td.appendChild(container);

  return td;
};

// コンポーネント
const ButtonRenderer = () => {
  const hotTableComponent = useRef(null);

  const logData = () => {
    if (hotTableComponent.current) {
      const hotInstance = hotTableComponent.current.hotInstance;
      const data = hotInstance.getData();

      // マッピング処理
      const mappedData = data.map(row => {
        return row.map(cell => {
          const option = colorOptions.find(option => option.label === cell);
          if (option) {
            return option._id;
          }
          return cell;
        });
      });

      // 存在しない入力値がある場合は送信しない
      const isValid = data.every(row => {
        return row.every(cell => {
          if (typeof cell === 'string') {
            return colorOptions.some(option => option.label === cell);
          }
          return true;
        });
      });

      if (isValid) {
        console.log('送信するデータ:', mappedData);
      } else {
        console.log('無効なデータが含まれています。送信を中止します。');
      }
    }
  };

  return (
    <>
      <HotTable
        ref={hotTableComponent}
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation"
        manualRowMove={true}
        rowHeaders={true}
        data={[
          ['BMW', 2017, 'yellow', 'yellow'], // 初期データをラベルで指定
          ['Nissan', 2018, 'red', 'red'],
          ['Chrysler', 2019, 'orange', 'orange']

        ]}
        colWidths={[50, 100, 200, 100, 200]}
        colHeaders={['Car', 'Year', 'Chassis color', 'Bumper color', 'Action']}
        columns={[
          {
            type: 'autocomplete',
            source: ['BMW', 'Chrysler', 'Nissan', 'Suzuki', 'Toyota', 'Volvo'],
            strict: false
          },
          { type: 'numeric' },
          {
            type: 'autocomplete',
            source: colorOptions.map(option => option.label),
            strict: false,
            visibleRows: 4
          },
          {
            type: 'autocomplete',
            source: colorOptions.map(option => option.label),
            strict: false,
            visibleRows: 4
          },
          {
            renderer: buttonRenderer, // ボタンレンダラーを使用
          }
        ]}
      />
      {/* <Button variant="contained" onClick={logData}>データ取得</Button> */}
    </>
  );
};

export default ButtonRenderer;
