import React, { Component } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.css';
import Handsontable from 'handsontable';

interface IProps {}

interface IState {
  data: (number | string)[][];
  rows: number;
  cols: number;
}

registerAllModules();

class HandsOnTablePage extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const rows = 10; // 行数を指定
    const cols = 12; // 列数を指定
    const dropdownMenuItems = ["A", "B", "C"];
    const initialData: (number | string)[][] = Array.from({ length: rows }, () =>
      [dropdownMenuItems[0], ...Array(cols - 1).fill(0)]
    );
    const finalData = this.addTotals(initialData);

    this.state = {
      data: finalData,
      rows,
      cols
    };
  }

  calculateRowTotals = (data: (number | string)[][]): (string | number)[] => {
    return data.map(row => row.slice(1).reduce((a, b) => Number(a) + Number(b), 0));
  };

  calculateColumnTotals = (data: (number | string)[][]): number[] => {
    const columnTotals: number[] = Array(data[0].length + 1).fill(0);
    data.forEach(row => {
      row.slice(1).forEach((cell: number | string, index: number) => {
        columnTotals[index + 1] += Number(cell);
      });
    });
    columnTotals[columnTotals.length - 1] = columnTotals.slice(1, -1).reduce((a, b) => a + b, 0);
    return columnTotals;
  };

  addTotals = (data: (number | string)[][]): (number | string)[][] => {
    const rowTotals = this.calculateRowTotals(data);
    const dataWithRowTotals = data.map((row, index) => [...row, rowTotals[index]]);
    const columnTotals = this.calculateColumnTotals(dataWithRowTotals);
    console.log(columnTotals,rowTotals)
    return [...dataWithRowTotals, columnTotals];
  };

  afterChange = (changes: Handsontable.CellChange[] | null, source: string): void => {
    if (source !== 'loadData' && changes) {
      const updatedData = this.state.data.slice(0, -1).map(row => row.slice(0, -1));
      const finalData = this.addTotals(updatedData);
      this.setState({ data: finalData });
    }
  };

  render() {
    return (
      <div>
        <HotTable
          data={this.state.data}
          colHeaders={true}
          rowHeaders={true}
          copyPaste={true} //コピペ機能
          columns={[
            {},
            { type: 'numeric' },
            {
              type: 'dropdown', //ドロップダウン機能
              source: ['yellow', 'red', 'orange', 'green', 'blue', 'gray', 'black', 'white']
            },
            { type: 'numeric' },
          ]}
          licenseKey="non-commercial-and-evaluation"
          afterChange={this.afterChange}
        />
      </div>
    );
  }
}

export default HandsOnTablePage;
