import React, { useRef } from 'react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import { HotTable } from '@handsontable/react';

const App: React.FC = () => {
  const hotTableComponent = useRef(null);

  const addRowAndSetInitialValues = () => {
    const hot = hotTableComponent.current.hotInstance;
    if (hot) {
      const newRowIndex = hot.countRows(); // 新しい行のインデックス
      hot.alter('insert_row_above', newRowIndex);
      hot.setDataAtCell(newRowIndex, 0, 'Initial Value 1'); // カラム0の初期値
      hot.setDataAtCell(newRowIndex, 1, 'Initial Value 2'); // カラム1の初期値
    }
  };

  const contextMenu = {
    items: {
      'add_row_with_initial_values': {
        name: 'Add row with initial values',
        callback: () => {
          addRowAndSetInitialValues();
        },
      },
      'remove_row': {
        name: 'Remove row',
        callback: (key, selection) => {
          const hot = hotTableComponent.current.hotInstance;
          if (hot) {
            hot.alter('remove_row', selection[0].start.row);
          }
        },
      },
      // 既存のメニューアイテムを追加する
      '---------': Handsontable.plugins.ContextMenu.defaultItems.separator,
      'undo': Handsontable.plugins.ContextMenu.defaultItems.undo,
      'redo': Handsontable.plugins.ContextMenu.defaultItems.redo,
    },
  };

  return (
    <div>
      <HotTable
        ref={hotTableComponent}
        data={Handsontable.helper.createEmptySpreadsheetData(5, 5)}
        colHeaders={true}
        rowHeaders={true}
        contextMenu={contextMenu}
        licenseKey="non-commercial-and-evaluation" // ライセンスキーを設定
      />
      <button onClick={addRowAndSetInitialValues}>
        Add Row with Initial Values
      </button>
    </div>
  );
};

export default App;
