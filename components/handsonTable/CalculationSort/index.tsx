import React, { useEffect, useRef } from "react";
import Handsontable from "handsontable";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";

interface HandsontableComponentProps {
  numRows: number;
}

const generateRandomData = (numRows: number): number[][] => {
  const data = [];
  for (let i = 0; i < numRows; i++) {
    const row = [
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
      Math.floor(Math.random() * 100),
    ];
    row.push(row[0] + row[1] + row[2]);
    data.push(row);
  }

  // 最終行を追加
  const sumRow = data.reduce(
    (acc, row) => {
      return row.map((num, index) => acc[index] + num);
    },
    [0, 0, 0, 0]
  );

  data.push(sumRow);
  return data;
};

const HandsontableComponent: React.FC<HandsontableComponentProps> = ({
  numRows,
}) => {
  const hotTableRef = useRef<HotTable>(null);
  const [data, setData] = React.useState<number[][]>(
    generateRandomData(numRows)
  );

  useEffect(() => {
    if (hotTableRef.current) {
      hotTableRef.current.hotInstance.updateSettings({
        afterChange: (changes) => {
          if (changes) {
            changes.forEach(([row, prop, oldValue, newValue]) => {
              const colIndex = parseInt(prop as string, 10);
              if (
                row < numRows &&
                (colIndex === 0 || colIndex === 1 || colIndex === 2)
              ) {
                const updatedData = data.map((rowData, rowIndex) => {
                  if (rowIndex === row) {
                    rowData[colIndex] = parseInt(newValue as string, 10);
                    rowData[3] = rowData[0] + rowData[1] + rowData[2];
                  }
                  return rowData;
                });

                const sumRow = updatedData.slice(0, numRows).reduce(
                  (acc, row) => {
                    return row.map((num, index) => acc[index] + num);
                  },
                  [0, 0, 0, 0]
                );

                updatedData[numRows] = sumRow;
                setData(updatedData);
              }
            });
          }
        },
      });
    }
  }, [data, numRows]);

  useEffect(() => {
    setData(generateRandomData(numRows));
  }, [numRows]);

  const excludeSort = () => {
    const hotInstance = hotTableRef.current.hotInstance
    const lastRowIndex = hotInstance.countRows() - 1

    // 各ソートの後、行 1 を取り出し、そのインデックスを 0 に変更します。
    hotInstance.rowIndexMapper.moveIndexes(hotInstance.toVisualRow(0),0)
    // 各ソートの後、行16を取り、そのインデックスを15に変更する。
    hotInstance.rowIndexMapper.moveIndexes(hotInstance.toVisualRow(lastRowIndex),lastRowIndex)
  };

  const excludeFilter = () => {
    let hotInstance = hotTableRef.current.hotInstance;
    let filtersRowsMap = hotInstance.getPlugin('filters').filtersRowsMap;

    // 0行目をfilterしない
    filtersRowsMap.setValueAtIndex(0, false);
    // 最終行をfilterしない
    filtersRowsMap.setValueAtIndex(filtersRowsMap.indexedValues.length - 1, false);
  };

  return (
    <HotTable
      ref={hotTableRef}
      data={data}
      colHeaders={["Column 1", "Column 2", "Column 3", "Sum"]}
      rowHeaders={true}
      width="600"
      height="300"
      licenseKey="non-commercial-and-evaluation"
      fixedRowsBottom={1}
      columnSorting={true}
      afterColumnSort={excludeSort}
      filters={true}
      dropdownMenu={true}
      afterFilter={excludeFilter}
      columns={[
        { data: 0, type: "numeric" },
        { data: 1, type: "numeric" },
        { data: 2, type: "numeric" },
        { data: 3, type: "numeric", readOnly: true },
      ]}
    />
  );
};

export default HandsontableComponent;
