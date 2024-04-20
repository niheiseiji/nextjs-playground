import { Column, DefaultCellTypes, TextCell, HeaderCell, CellChange, Row, NumberCell, DateCell, CellStyle } from '@silevis/reactgrid'
import { useRef, useEffect } from "react";
import { DropdownCell, getDropdownCell } from "../cellTemplates/dropdownCellTemplate";
import { WorkLog, employeeTypes, developMonth } from '../data/workhoursData/initialValues';
import { getButtonCell } from "../cellTemplates/buttonCellTemplate";

export interface ExtendedColumn extends Column {
    key?: string;
    arrayIdx?: number; //工数データのオブジェクト内の配列の要素にアクセスしたい
    groupName?: string
}

export type CustomTypes = DefaultCellTypes | DropdownCell

// このIDを間違えると正しく選択できなくなる
export const generateInitialColumns = (developMonth: string[]) => {
    const columns = [
        { columnId: 0, resizable: true, width: 50},
        { columnId: 1, resizable: true, width: 150, key: 'employeeName' },
        { columnId: 2, resizable: true, width: 75, key: 'employeeType' },
        { columnId: 3, resizable: true, width: 100, key: 'cost1' },
        { columnId: 4, resizable: true, width: 100, key: 'cost2' },
        { columnId: 5, width: 150, resizable: true, key: 'description' },
    ]

    // 可変列
    developMonth.forEach((value, idx) => {
        columns.push({
            columnId: columns.length,
            resizable: true,
            width: 100,
            key: `month_${idx}`,
            arrayIdx: idx, //エラーの意味が分からない。
            groupName: "costs"
        })
    })
    return columns
}

export const generateInitialHeader = (developMonth: string[], color?: string) => {

    const header = [
        getHeaderCell('ID', color),
        getHeaderCell('名前', color),
        getHeaderCell('契約形態', color),
        getHeaderCell('工数1', color),
        getHeaderCell('工数2', color),
        getHeaderCell('備考', color),
    ]

    // 可変列
    developMonth.forEach((month, idx) => {
        header.push(getHeaderCell(`${month}`, color))
    })

    return header
}

export const createInitialCosts = (developMonth: string[]) => {
    // 配列の長さに基づいて、0で初期化された配列を生成
    return developMonth.map(() => 0);
};

// ??これなに
export const usePrevious = (value: any) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}

const transparentBorder: CellStyle = { color: 'rgba(0,0,0,0.25)' }
const transparentBorderStyle: CellStyle = { border: { top: transparentBorder, right: transparentBorder, bottom: transparentBorder } }

export const getTextCell = (text?: string, nonEditable?: boolean): TextCell => ({ type: 'text', text: text || '', nonEditable: nonEditable })
export const getHeaderCell = (text?: string, background?: string): HeaderCell => ({ type: 'header', text: text || '', style: { background, ...transparentBorderStyle } })

export const getCellValue = (change: CellChange<CustomTypes>) => {
    const { newCell } = change;
    switch (newCell.type) {
        case 'number':
            return newCell.value
        case 'dropdown':
        case 'text':
            return newCell.text //?存在するはず
        case 'date':
            return newCell.date
        default:
            return ''
    }
}

const generateCells = (log: WorkLog) => {
    const cells = [
        { type: 'number', value: log.id, className: 'idx-cell' } as NumberCell,
        getTextCell(log.employeeName),
        getDropdownCell(log.employeeType || '', employeeTypes, false, {}, 'dropdown-cell'),
        { type: 'number', value: log.cost1 } as NumberCell,
        { type: 'number', value: log.cost2 } as NumberCell,
        getTextCell(log.description),
    ]
    // 可変列
    log.costs.forEach((val) => {
        cells.push({ type: 'number', value: val } as NumberCell,)
    })

    return cells
}

export const transformLogsToModel = (logs: WorkLog[], height: number): Row<CustomTypes>[] => {
    return logs.map((log, idx) => ({
        rowId: log.id,
        height,
        cells: generateCells(log),
    }))
}

export const getBottomRow = (height: number, id: number, totalCost1: number, totalCost2: number) => ({
    rowId: id,
    height,
    cells: [
        { type: 'number', value: 99, nonEditable: true } as NumberCell,
        getTextCell('', true),
        getTextCell('', true),
        { type: 'number', value: totalCost1, nanToZero: true, hideZero: true, nonEditable: true } as NumberCell,
        { type: 'number', value: totalCost2, nanToZero: true, hideZero: true, nonEditable: true } as NumberCell,
        getTextCell('', true),
    ]
})