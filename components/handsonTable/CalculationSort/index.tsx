import React, { useEffect, useRef, useState } from "react";
import Handsontable from "handsontable";
import { HotTable } from "@handsontable/react";
import "handsontable/dist/handsontable.full.min.css";
import { excludeFilter, excludeSort } from "./settings";
import "./styles.css";

interface HandsontableComponentProps {
  numRows: number;
}

const generateRandomData = (numRows: number): any[][] => {
  const data = [];
  for (let i = 0; i < numRows; i++) {
    const row = [
      Math.floor(Math.random() * 100), // 数値
      "テキスト" + i, // テキスト
      "選択肢1", // ドロップダウン
      Math.floor(Math.random() * 100), // 数値
      Math.floor(Math.random() * 100), // 数値
      Math.floor(Math.random() * 100), // 数値
    ];
    row.push(row[3] + row[4] + row[5]); // 合計
    row.push("テキスト" + (i + 100)); // テキスト
    row.push("選択肢2"); // ドロップダウン
    data.push(row);
  }

  // 最終行を追加
  const sumRow = data.reduce((acc, row) => {
    return row.map((num, index) => {
      if (typeof num === "number") {
        return acc[index] + num;
      }
      return acc[index];
    });
  }, Array(data[0].length).fill(0));

  // テキストとドロップダウンのセルを空にする
  sumRow[1] = "";
  sumRow[2] = "";
  sumRow[7] = "";
  sumRow[8] = "";

  data.push(sumRow);
  return data;
};

const HandsontableComponent: React.FC<HandsontableComponentProps> = ({
  numRows,
}) => {
  const hotTableRef = useRef<HotTable>(null);
  const [data, setData] = useState<any[][]>(generateRandomData(numRows));
  const [numRowsState, setNumRowsState] = useState(numRows);

  const afterSelectionEnd = (r, c, r2, c2) => {
    // 単一セルが選択されたとき
    if (r !== r2 || c !== c2) return;

    const hotInstance = hotTableRef?.current.hotInstance;

    // セルエディタが'textEditor', 'dropdownEditor', 'autocompleteEditor' の場合のみ強制的に入力モードにする
    const cellMeta = hotInstance.getCellMeta(r, c);
    const cellEditor = hotInstance.getCellEditor(r, c);
    if (cellEditor == null) return;
    if (cellMeta.readOnly) return;
    if (
      cellMeta.editor !== Handsontable.editors.TextEditor &&
      cellMeta.editor !== Handsontable.editors.DropdownEditor &&
      cellMeta.editor !== Handsontable.editors.AutocompleteEditor
    )
      return;

    // 強制入力モード パターン１：セルフォーカスして1文字目を強制的に入れ込むことで回避
    const activeEditor = hotInstance.getActiveEditor();
    const cellValue = hotInstance.getDataAtCell(r, c);
    activeEditor.beginEditing();
    hotInstance.setDataAtCell(r, c, cellValue, "system");
  };

  useEffect(() => {
    if (hotTableRef.current) {
      hotTableRef.current.hotInstance.updateSettings({
        afterChange: (changes) => {
          if (changes) {
            changes.forEach(([row, prop, oldValue, newValue]) => {
              const colIndex = parseInt(prop as string, 10);
              if (
                row < numRowsState &&
                (colIndex === 3 || colIndex === 4 || colIndex === 5)
              ) {
                const updatedData = data.map((rowData, rowIndex) => {
                  if (rowIndex === row) {
                    rowData[colIndex] =
                      newValue === "" || newValue === null
                        ? 0
                        : parseInt(newValue as string, 10);
                    rowData[6] = rowData[3] + rowData[4] + rowData[5];
                  }
                  return rowData;
                });

                const sumRow = updatedData
                  .slice(0, numRowsState)
                  .reduce((acc, row) => {
                    return row.map((num, index) => {
                      if (typeof num === "number") {
                        return acc[index] + num;
                      }
                      return acc[index];
                    });
                  }, Array(data[0].length).fill(0));

                sumRow[1] = "";
                sumRow[2] = "";
                sumRow[7] = "";
                sumRow[8] = "";

                updatedData[numRowsState] = sumRow;
                setData(updatedData);
              }
            });
          }
        },
        afterRemoveRow: () => {
          // 行が削除された後にフォーカスをリセットする(小計行にフォーカスがあるままredoするとエラー起きる)
          hotTableRef.current.hotInstance.deselectCell();
          updateSumRow();
        },
      });
    }
  }, [data, numRowsState]); // データまたは行数が変更されたときにこのエフェクトを実行する

  const updateSumRow = () => {
    const updatedData = data.slice(0, numRowsState);

    const sumRow = updatedData.reduce((acc, row) => {
      return row.map((num, index) => {
        if (typeof num === "number") {
          return acc[index] + num;
        }
        return acc[index];
      });
    }, Array(data[0].length).fill(0));

    sumRow[1] = "";
    sumRow[2] = "";
    sumRow[7] = "";
    sumRow[8] = "";

    setData([...updatedData, sumRow]);
  };
  const addRow = () => {
    const hotInstance = hotTableRef.current.hotInstance;
    const newRowIndex = numRowsState;

    // 新しい行を追加
    hotInstance.alter("insert_row_above", newRowIndex);

    // 新しい行のデータを設定
    const newRowData = [
      Math.floor(Math.random() * 100), // 数値
      "新しいテキスト", // テキスト
      "選択肢1", // ドロップダウン
      Math.floor(Math.random() * 100), // 数値
      Math.floor(Math.random() * 100), // 数値
      Math.floor(Math.random() * 100), // 数値
      0, // 合計は初期値0
      "新しいテキスト", // テキスト
      "選択肢2", // ドロップダウン
    ];

    // 各セルに値を設定
    newRowData.forEach((value, colIndex) => {
      hotInstance.setSourceDataAtCell(newRowIndex, colIndex, value);
    });

    setNumRowsState((prevNumRows) => prevNumRows + 1);
    updateSumRow();
  };

  const removeRow = (rowIndex: number) => {
    const hotInstance = hotTableRef.current.hotInstance;
    hotInstance.alter("remove_row", rowIndex);
    setNumRowsState((prevNumRows) => prevNumRows - 1);
    updateSumRow();
  };

  const buttonRenderer = (
    instance,
    td,
    row,
    col,
    prop,
    value,
    cellProperties
  ) => {
    Handsontable.dom.empty(td);
    const currentNumRows = data.length - 1; // 最終行のインデックスを取得
    if (row < currentNumRows) {
      // 最終行でない場合にのみボタンを追加
      const button = document.createElement("button");
      button.innerHTML = "削除";
      button.className = "small-button"; // CSSクラスを追加
      button.onclick = () => removeRow(row);
      td.appendChild(button);
    }
    return td;
  };

  return (
    <div>
      <button onClick={addRow}>行を追加</button>
      <HotTable
        ref={hotTableRef}
        data={data}
        colHeaders={[
          "Remove",
          "Column 1 (Text)",
          "Column 2 (Dropdown)",
          "Column 3",
          "Column 4",
          "Column 5",
          "Sum",
          "Column 7 (Text)",
          "Column 8 (Dropdown)",
        ]}
        rowHeaders={(index) => (index === numRowsState ? "小計" : index + 1)}
        width="99vw"
        height="80vh"
        licenseKey="non-commercial-and-evaluation"
        fixedRowsBottom={1}
        columnSorting={true}
        afterColumnSort={() => excludeSort(hotTableRef)}
        filters={true}
        contextMenu={true}
        dropdownMenu={true}
        afterFilter={() => excludeFilter(hotTableRef)}
        afterSelectionEnd={afterSelectionEnd}
        columns={[
          {
            data: "",
            renderer: buttonRenderer,
            readOnly: true,
          },
          { data: 1, type: "text" },
          {
            data: 2,
            type: "dropdown",
            source: ["選択肢1", "選択肢2", "選択肢3"],
          },
          { data: 3, type: "numeric" },
          { data: 4, type: "numeric" },
          { data: 5, type: "numeric" },
          { data: 6, type: "numeric", readOnly: true },
          { data: 7, type: "text" },
          {
            data: 8,
            type: "dropdown",
            source: ["選択肢1", "選択肢2", "選択肢3"],
          },
        ]}
      />
    </div>
  );
};

export default HandsontableComponent;
