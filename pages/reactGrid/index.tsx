import * as React from "react";
import { useState } from "react";
import {
  ReactGrid,
  Column,
  Row,
  CellChange,
  TextCell,
  Cell,
  DropdownCell,
} from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { NextPage } from "next";
import { DropdownNumberCellTemplate } from "@/components/dropdownCell";

interface Assign {
  id: number; //number(auto)
  employeeName: string;
  employeeType: OptionType; //selectのIDが設定される
}
/**
 * dropdown
 */
type OptionType = {
  value: string;
  label: string;
};
const employeeTypes: OptionType[] = [
  { value: "1", label: "value1" },
  { value: "2", label: "value2" },
  { value: "3", label: "value3" },
  { value: "4", label: "value4" },
];

const getAssign = (): Assign[] => [
  {
    id: 1,
    employeeName: "Thomas",
    employeeType: { value: "1", label: "value1" },
  },
  // { id: 2, employeeName: "Susie", employeeType: "2" },
  // { id: 3, employeeName: "", employeeType: "" }
];

const getColumns = (): Column[] => [
  { columnId: "id", width: 20 },
  { columnId: "employeeName", width: 150 },
  { columnId: "employeeType", width: 200 },
];

const headerRow: Row = {
  rowId: "header",
  cells: [
    { type: "header", text: "id" },
    { type: "header", text: "employeeName" },
    { type: "header", text: "employeeType" },
  ],
};

// セルに変更があった場合の更新(配列の特定要素のみ更新する)(複数セルの同時変更にも対応している)
const applyChangesToAssign = (
  changes: CellChange<Cell>[],
  prevAssign: Assign[]
): Assign[] => {
  console.log("applyChangesToAssign");
  console.log(changes);

  changes.forEach((change) => {
    console.log("prevAssign");
    console.log(prevAssign);
    const assignIndex: number = prevAssign.findIndex(
      (p) => p.id === Number(change.rowId)
    );
    if (assignIndex !== -1) {
      const fieldName: keyof Assign = change.columnId as keyof Assign;
      const newCell = change.newCell as TextCell | DropdownCell;
      console.log("fieldName");
      console.log(fieldName);
      console.log("newCell");
      console.log(newCell);
      if (fieldName === "employeeName" || fieldName === "employeeType") {
        if (newCell.type === "dropdown") {
          console.log("dropdown");
          // prevAssign[assignIndex][fieldName] = newCell.selectedValue; // DropdownCellの場合はvalueを使用
        } else {
          prevAssign[assignIndex][fieldName] = newCell.text;
        }
      }
    }
  });
  return [...prevAssign];
};

const TableFormPage: NextPage = () => {
  const [assign, setAssign] = useState<Assign[]>(getAssign());

  const getRows = (assign: Assign[]): Row[] => [
    headerRow,
    ...assign.map<Row>((assign) => ({
      rowId: assign.id.toString(),
      cells: [
        { type: "text", text: assign.id.toString(), columnId: "id" },
        { type: "text", text: assign.employeeName, columnId: "employeeName" },
        // {
        //   type: "dropdown",
        //   selectedValue: assign.employeeType.value,
        //   values: employeeTypes,
        //   isOpen: true,
        //   inputValue: " ",
        // } as DropdownCell,
        { type: "dropdownNumber", value: 20, isOpened: false },
      ],
    })),
  ];

  // セル更新時のステート更新
  const handleChanges = (changes: CellChange<Cell>[]) => {
    setAssign((prevAssign) => applyChangesToAssign(changes, prevAssign));
  };

  return (
    <ReactGrid
      rows={getRows(assign)}
      customCellTemplates={{ dropdownNumber: new DropdownNumberCellTemplate() }}
      columns={getColumns()}
      enableColumnSelection={true}
      enableRangeSelection={true}
      onCellsChanged={handleChanges}
    />
  );
};

export default TableFormPage;
