import React, { useState, useRef, useEffect } from 'react';
import { ReactGrid } from '@silevis/reactgrid'
import { CellChange, Row, Cell } from '@silevis/reactgrid';
import { ExtendedColumn, usePrevious, getHeaderCell, transformLogsToModel, getCellValue, getBottomRow, generateInitialColumns, generateInitialHeader, createInitialCosts } from './utils';
import { developMonth, initialWorkhours, WorkLog } from '../data/workhoursData/initialValues';
import { DropdownCellTemplate } from '../cellTemplates/dropdownCellTemplate';
import { ButtonCellTemplate } from '../cellTemplates/buttonCellTemplate';
import { Height } from '@mui/icons-material';

interface GridProps {
    rowHeight: number;
    color: string;
}

export const WorkhoursGrid: React.FC<GridProps> = ({ rowHeight, color }) => {
    // データ本体
    const [workLogs, setWorkLogs] = useState<WorkLog[]>(() => initialWorkhours)
    // 列定義
    const [columns, setColumns] = useState<ExtendedColumn[]>(generateInitialColumns(developMonth))
    // ヘッダー行
    const [headerRow, setHeaderRow] = useState({
        rowId: 'header',
        height: rowHeight,
        cells: generateInitialHeader(developMonth, color)
    });
    const [totalCosts, setTotalCosts] = useState({ totalCost1: 0, totalCost2: 0 })


    const previousLogLength = usePrevious(workLogs.length)

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (previousLogLength !== workLogs.length && ref.current) {
            ref.current.scrollTo(0, ref.current.scrollHeight)
        }
    }, [workLogs, previousLogLength])

    // コスト合計の計算
    useEffect(() => {
        const totalCost1 = workLogs.reduce((acc, curr) => {
            return acc + (isNaN(curr.cost1) ? 0 : curr.cost1);
        }, 0);
        const totalCost2 = workLogs.reduce((acc, curr) => {
            return acc + (isNaN(curr.cost2) ? 0 : curr.cost2);
        }, 0);
        setTotalCosts({ totalCost1, totalCost2 });
    }, [workLogs]);

    const rows = transformLogsToModel(workLogs, rowHeight)

    const onCellsChanged = (changes: CellChange[]) => {

        console.log("changes:")
        console.log(changes)
        changes.forEach(change => {
            const column = columns.find(col => col.columnId === change.columnId)
            const logIdx = workLogs.findIndex(log => log.id === change.rowId);
            console.log("column:")
            console.log(column)
            console.log("logIdx:" + logIdx)
            if (logIdx === -1 || !column) return
            setWorkLogs(updateLogs => {
                console.log("oldLogs")
                console.log(updateLogs)
                console.log("logIdx")
                console.log(logIdx)
                console.log("column.key")
                console.log(column.key)
                console.log("getCellValue(change)")
                console.log(getCellValue(change))
                if (!column.key) return updateLogs
                if (column.groupName === 'costs') {
                    // 配列要素の名前が入っている場合
                    if (column.arrayIdx !== undefined) {
                        // ディープコピーを作成してネストされたオブジェクトを安全に更新
                        const updatedLogs = [...updateLogs];
                        const updatedLog = { ...updatedLogs[logIdx] };
                        const updatedCosts = [...updatedLog.costs]; // 'costs' 配列をコピー
                        updatedCosts[column.arrayIdx] = getCellValue(change); // 特定のインデックスを更新
                        updatedLog.costs = updatedCosts; // 更新された 'costs' 配列をログに設定
                        updatedLogs[logIdx] = updatedLog; // 更新されたログをログ配列に設定
                        updateLogs = updatedLogs; // 全体の更新ログを更新
                    }
                } else {
                    updateLogs[logIdx] = { ...updateLogs[logIdx], [column.key]: getCellValue(change) }
                }
                return [...updateLogs]
            })
        })
    }

    const addBlankLog = () => setWorkLogs(logs => [...logs,
    {
        id: logs.length,
        employeeType: '',
        employeeName: '',
        cost1: 0,
        cost2: 0,
        description: '',
        costs: createInitialCosts(developMonth)
    }

    ])

    const addColumn = () => {
        // 新しい月を開発月リストに追加(要改善)
        const newMonth = `2024${String(developMonth.length + 1).padStart(2, '0')}`;
        // 月
        developMonth.push(newMonth);

        // 新しい列情報を生成
        const newColumnId = `cost_${columns.length}`;
        const newColumn = {
            columnId: columns.length + 1,
            resizable: true,
            width: 100,
            key: `month_${columns.length + 1}`,
            name: newMonth, // ヘッダーに表示する名前
            arrayIdx: developMonth.length - 1, //エラーの意味が分からない。
            groupName: "costs"
        };

        setColumns([...columns, newColumn]);

        setHeaderRow({
            rowId: 'header',
            height: rowHeight,
            cells: generateInitialHeader(developMonth, color)
        });

        // 各ログエントリに新しい月のコストを追加
        setWorkLogs(currentLogs => currentLogs.map(log => ({
            ...log,
            costs: [...log.costs, 0] // 新しい月のコストを初期値0で追加
        })));
    };


    return <div ref={ref}>
        <ReactGrid
            customCellTemplates={{
                'dropdown': DropdownCellTemplate,
                'button': ButtonCellTemplate,
            }}
            onCellsChanged={onCellsChanged}
            rows={[
                headerRow,
                ...rows.map((row, idx) => idx % 2 === 0 ?
                    { ...row, cells: row.cells.map<Cell>(cell => ({ ...cell, style: { background: 'rgba(0,0,0,0.02)' } })) }
                    : row
                ),
                getBottomRow(rowHeight, workLogs.length, totalCosts.totalCost1, totalCosts.totalCost2)
            ]}
            stickyBottomRows={1}
            stickyTopRows={1}
            columns={columns}
            enableRangeSelection
            enableColumnSelection
            enableRowSelection
            onColumnResized={(id, width) => {
                setColumns(columns => columns.map(col => col.columnId === id ? { ...col, width } : col))
            }}
        />
        <button onClick={addBlankLog}>行追加</button>
        <button onClick={addColumn}>列追加</button>
    </div>
}

