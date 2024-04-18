import React, { useState, useRef, useEffect } from 'react';
import { ReactGrid } from '@silevis/reactgrid'
import { CellChange, Row, Cell } from '@silevis/reactgrid';
import { ExtendedColumn, initialColumns, usePrevious, getHeaderCell, transformLogsToModel, getCellValue, getBottomRow } from './utils';
import { initialWorkhours, WorkLog } from '../data/workhoursData/initialValues';
import { DropdownCellTemplate } from '../cellTemplates/dropdownCellTemplate';
import { ButtonCellTemplate } from '../cellTemplates/buttonCellTemplate';
import { Height } from '@mui/icons-material';

interface GridProps {
    rowHeight: number;
    color: string;
}

export const WorkhoursGrid: React.FC<GridProps> = ({ rowHeight, color }) => {
    const [workLogs, setWorkLogs] = useState<WorkLog[]>(() => initialWorkhours)
    const [columns, setColumns] = useState<ExtendedColumn[]>(() => initialColumns)
    const [totalCosts, setTotalCosts] = useState({ totalCost1: 0, totalCost2: 0 });

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

    const headerRow: Row = {
        rowId: 'header',
        height: rowHeight,
        cells: [
            getHeaderCell('ID', color),
            getHeaderCell('名前', color),
            getHeaderCell('契約形態', color),
            getHeaderCell('工数1', color),
            getHeaderCell('工数2', color),
            getHeaderCell('備考', color)
        ]
    }

    const rows = transformLogsToModel(workLogs, rowHeight)

    const onCellsChanged = (changes: CellChange[]) => {
        changes.forEach(change => {
            const column = columns.find(col => col.columnId === change.columnId)
            const logIdx = workLogs.findIndex(log => log.id === change.rowId);
            if (logIdx === -1 || !column) return
            setWorkLogs(oldLogs => {
                if (!column.key) return oldLogs
                oldLogs[logIdx] = { ...oldLogs[logIdx], [column.key]: getCellValue(change) }
                return [...oldLogs]
            })
        })
    }

    const addBlankLog = () => setWorkLogs(logs => [...logs, { id: logs.length, employeeType: '', employeeName: '', cost1: 0, cost2: 0, description: '' }])

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
            // stickyBottomRows={1}
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
    </div>
}
