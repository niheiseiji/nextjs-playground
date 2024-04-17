import * as React from 'react';
import { useState } from 'react';
import { ReactGrid, Column, Row, CellChange, TextCell, Cell, DropdownCell } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { NextPage } from "next";

interface Assign {
  id: number; //number(auto)
  employeeName: string;
  employeeType: string; //selectのIDが設定される
}

/**
 * dropdown
 */
interface DropdownOption {
  id: string;
  text: string;
}

const employeeTypes: DropdownOption[] = [
  { id: '1', text: 'Full-Time' },
  { id: '2', text: 'Part-Time' },
  { id: '3', text: 'Contractor' },
  { id: '4', text: 'Intern' }
];

const getAssign = (): Assign[] => [
  { id: 1, employeeName: "Thomas", employeeType: "Goldman" },
  { id: 2, employeeName: "Susie", employeeType: "Quattro" },
  { id: 3, employeeName: "", employeeType: "" }
];

const getColumns = (): Column[] => [
  { columnId: "id", width: 20 },
  { columnId: "employeeName", width: 150 },
  { columnId: "employeeType", width: 200 }
];

const headerRow: Row = {
  rowId: "header",
  cells: [
    { type: "header", text: "id" },
    { type: "header", text: "employeeName" },
    { type: "header", text: "employeeType" }
  ]
};

const getRows = (assign: Assign[]): Row[] => [
  headerRow,
  ...assign.map<Row>((assign) => ({
    rowId: assign.id.toString(),
    cells: [
      { type: "text", text: assign.id.toString(), columnId: "id" },
      { type: "text", text: assign.employeeName, columnId: "employeeName" },
      {
        type: 'dropdown',
        // text: employeeTypes.find(e => e.id === assign.employeeType)?.text || 'Select Type',
        text: "t",
        values: [employeeTypes],
        columnId: "employeeType",
        options: employeeTypes.map(opt => ({ id: opt.id, value: opt.id, label: opt.text }))
      } as unknown as DropdownCell
    ]
  }))
];


// セルに変更があった場合の更新(配列の特定要素のみ更新する)(複数セルの同時変更にも対応している)
const applyChangesToAssign = (
  changes: CellChange<Cell>[],
  prevAssign: Assign[]
): Assign[] => {
  console.log("applyChangesToAssign")
  console.log(changes)
  
  changes.forEach((change) => {
    const assignIndex: number = prevAssign.findIndex(p => p.id === Number(change.rowId));
    if (assignIndex !== -1) {
      const fieldName: keyof Assign = change.columnId as keyof Assign;
      const newCell = change.newCell as TextCell | DropdownCell;
      if (fieldName === "employeeName" || fieldName === "employeeType") {
        if (newCell.type === 'dropdown') {
          prevAssign[assignIndex][fieldName] = newCell.values[0].value; // DropdownCellの場合はvalueを使用
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

  const rows = getRows(assign);[]
  const columns = getColumns();

  // セル更新時のステート更新
  const handleChanges = (changes: CellChange<Cell>[]) => {
    setAssign(prevAssign => applyChangesToAssign(changes, prevAssign));
  };

  return (
    <ReactGrid
      rows={rows}
      columns={columns}
      enableColumnSelection={true}
      enableRangeSelection={true}
      onCellsChanged={handleChanges}
    />
  );
}

export default TableFormPage;
