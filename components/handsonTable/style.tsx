import React from 'react';
import Handsontable from 'handsontable';
import { HotTable, HotColumn } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

const StyleTableComponent = () => {
  const handleAfterGetColHeader = (col, TH) => {
    if (col === 1) { // Apply style to the second column header (index 1)
      TH.style.backgroundColor = 'lightblue';
      TH.style.color = 'darkblue';
      TH.style.fontWeight = 'bold';
    }
  };

  return (
    <HotTable
      data={Handsontable.helper.createSpreadsheetData(5, 5)}
      colHeaders={true}
      afterGetColHeader={handleAfterGetColHeader}
    >
      <HotColumn />
      <HotColumn />
      <HotColumn />
      <HotColumn />
      <HotColumn />
    </HotTable>
  );
};

export default StyleTableComponent;
