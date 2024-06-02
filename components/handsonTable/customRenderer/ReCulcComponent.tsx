import React, { useRef, useEffect } from 'react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import { PluginHook } from 'handsontable/plugins';

// register Handsontable's modules
registerAllModules();

const ReCulcComponent = () => {
  const hotTableComponent = useRef(null);

  const addRowAndSetInitialValues = (rowIndex: number, position: 'above' | 'below') => {
    const hot = hotTableComponent.current.hotInstance;
    if (hot) {
      const newRowIndex = position === 'below' ? rowIndex + 1 : rowIndex;
      hot.alter(`insert_row_${position}`, newRowIndex);
      hot.setDataAtCell(newRowIndex, 0, 'Initial Value 1'); // カラム0の初期値
      hot.setDataAtCell(newRowIndex, 1, 'Initial Value 2'); // カラム1の初期値
      hot.getPlugin('columnSummary').calculateAll();
    }
  };

  const addRowAtEndAndSetInitialValues = () => {
    const hot = hotTableComponent.current.hotInstance;
    if (hot) {
      const newRowIndex = hot.countRows(); // 新しい行のインデックス
      hot.alter('insert_row_above', newRowIndex);
      hot.setDataAtCell(newRowIndex, 0, 'Initial Value 1'); // カラム0の初期値
      hot.setDataAtCell(newRowIndex, 1, 'Initial Value 2'); // カラム1の初期値
      hot.getPlugin('columnSummary').calculateAll();
    }
  };

  useEffect(() => {
    const hot = hotTableComponent.current.hotInstance;
    if (hot) {
      hot.addHook('afterCreateRow', () => {
        hot.getPlugin('columnSummary').calculateAll();
      });
    }
  }, []);

  return (
    <div>
      <HotTable
        ref={hotTableComponent}
        data={[
          ['A1', 'B1', 'C1', 'D1', 'E1'],
          ['A2', 'B2', 'C2', 'D2', 'E2'],
          ['A3', 'B3', 'C3', 'D3', 'E3'],
          ['A4', 'B4', 'C4', 'D4', 'E4'],
          ['A5', 'B5', 'C5', 'D5', 'E5'],
        ]}
        colHeaders={true}
        height="auto"
        contextMenu={{
          items: {
            'add_row_above_with_initial_values': {
              name: 'Add row above with initial values',
              callback: (key, selection) => {
                const selectedRow = selection[0].start.row;
                addRowAndSetInitialValues(selectedRow, 'above');
              },
            },
            'add_row_below_with_initial_values': {
              name: 'Add row below with initial values',
              callback: (key, selection) => {
                const selectedRow = selection[0].start.row;
                addRowAndSetInitialValues(selectedRow, 'below');
              },
            },
            'separator': Handsontable.plugins.ContextMenu.SEPARATOR,
            'clear_custom': {
              name: 'Clear all cells (custom)',
              callback: function() {
                this.clear();
              }
            },
            'row_above': {
              name: 'Insert row above this one (custom name)'
            },
            'row_below': {}
          }
        }}
        columnSummary={[
          {
            sourceColumn: 0,
            type: 'sum',
            destinationRow: 5, // 合計を表示する行のインデックス
            destinationColumn: 0,
            forceNumeric: true
          },
        ]}
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation"
      />
      <button onClick={addRowAtEndAndSetInitialValues}>
        Add Row with Initial Values at End
      </button>
    </div>
  );
}

export default ReCulcComponent;
