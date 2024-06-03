import React, { useEffect, useRef } from "react";
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
  const sumRow = data.reduce(
    (acc, row) => {
      return row.map((num, index) => {
        if (typeof num === "number") {
          return acc[index] + num;
        }
        return acc[index];
      });
    },
    Array(data[0].length).fill(0)
  );

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
  const [data, setData] = React.useState<any[][]>(generateRandomData(numRows));


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
    ) return;

    // 強制入力モード パターン１：セルフォーカスして1文字目を強制的に入れ込むことで回避
    const activeEditor = hotInstance.getActiveEditor();
    const cellValue = hotInstance.getDataAtCell(r, c);
    activeEditor.beginEditing();
    hotInstance.setDataAtCell(r, c, cellValue, 'system');
  }

  useEffect(() => {
    if (hotTableRef.current) {
      // Handsontableの設定を更新する
      hotTableRef.current.hotInstance.updateSettings({
        afterChange: (changes) => {
          if (changes) {
            changes.forEach(([row, prop, oldValue, newValue]) => {
              const colIndex = parseInt(prop as string, 10);
              if (row < numRows && (colIndex === 3 || colIndex === 4 || colIndex === 5)) {
                const updatedData = data.map((rowData, rowIndex) => {
                  if (rowIndex === row) {
                    console.log("newValue")
                    console.log(newValue)
                    rowData[colIndex] = newValue === "" || newValue === null ? 0 : parseInt(newValue as string, 10);
                    rowData[6] = rowData[3] + rowData[4] + rowData[5];
                  }
                  return rowData;
                });

                const sumRow = updatedData.slice(0, numRows).reduce(
                  (acc, row) => {
                    return row.map((num, index) => {
                      if (typeof num === "number") {
                        return acc[index] + num;
                      }
                      return acc[index];
                    });
                  },
                  Array(data[0].length).fill(0)
                );

                sumRow[1] = "";
                sumRow[2] = "";
                sumRow[7] = "";
                sumRow[8] = "";

                updatedData[numRows] = sumRow;
                setData(updatedData);
              }
            });
          }
        }
      });
    }
  }, [data, numRows]); // データまたは行数が変更されたときにこのエフェクトを実行する

  useEffect(() => {
    // 行数が変更されたときに新しいデータを生成する
    setData(generateRandomData(numRows));
  }, [numRows]); // 行数が変更されたときにこのエフェクトを実行する

  const removeRow = (rowIndex: number) => {
    let hotInstance = hotTableRef.current.hotInstance;
    hotInstance.alter("remove_row", rowIndex);
  };

  const buttonRenderer = (instance, td, row, col, prop, value, cellProperties) => {
    Handsontable.dom.empty(td);
    const currentNumRows = data.length - 1; // 最終行のインデックスを取得
    if (row < currentNumRows) { // 最終行でない場合にのみボタンを追加
      const button = document.createElement("button");
      button.innerHTML = "削除";
      button.className = "small-button"; // CSSクラスを追加
      button.onclick = () => removeRow(row);
      td.appendChild(button);
    }
    return td;
  };


  return (
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
      rowHeaders={(index) => (index === numRows ? "小計" : index + 1)} // 最終行のみ「小計」に設定
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
        { data: 1, type: "text" }, // テキスト
        {
          data: 2,
          type: "dropdown",
          source: ["選択肢1", "選択肢2", "選択肢3"],
        }, // ドロップダウン
        { data: 3, type: "numeric" }, // 数値
        { data: 4, type: "numeric" }, // 数値
        { data: 5, type: "numeric" }, // 数値
        { data: 6, type: "numeric", readOnly: true }, // 合計
        { data: 7, type: "text" }, // テキスト
        {
          data: 8,
          type: "dropdown",
          source: ["選択肢1", "選択肢2", "選択肢3"],
        }, // ドロップダウン
      ]}
    />
  );
};

export default HandsontableComponent;
