import React, { useState, useRef, useEffect } from "react";
import { Id, ReactGrid, TextCell } from "@silevis/reactgrid";
import { CellChange, Cell } from "@silevis/reactgrid";
import {
  ExtendedColumn,
  usePrevious,
  getHeaderCell,
  transformLogsToModel,
  getCellValue,
  getBottomRow,
  generateInitialColumns,
  generateInitialHeader,
  createInitialCosts,
  deleteLog,
  getNextId,
} from "./utils";
import {
  developMonthInitialData,
  initialWorkhours,
  WorkLog,
} from "../data/workhoursData/initialValues";
import { DropdownCellTemplate } from "../cellTemplates/dropdownCellTemplate";
import { ButtonCellTemplate } from "../cellTemplates/buttonCellTemplate";
// import { Height } from "@mui/icons-material";
import Box from "@mui/material/Box";
interface GridProps {
  rowHeight: number;
  color: string;
}

export const WorkhoursGrid: React.FC<GridProps> = ({ rowHeight, color }) => {
  // データ本体
  const [workLogs, setWorkLogs] = useState<WorkLog[]>(() => initialWorkhours);
  // 表示月
  const [developMonth, setDevelopMonth] = useState<string[]>(
    () => developMonthInitialData
  );
  // 列定義
  const [columns, setColumns] = useState<ExtendedColumn[]>(
    generateInitialColumns(developMonth)
  );
  // ヘッダー行
  const [headerRow, setHeaderRow] = useState({
    rowId: "header",
    height: rowHeight,
    cells: generateInitialHeader(developMonth, color),
  });
  // 合計
  const [totalCosts, setTotalCosts] = useState({
    totalCost1: 0,
    totalCost2: 0,
  });
  /**
   * 履歴管理
   */
  // 現在のデータ履歴位置(-1がcurrentで更新のたびに+1していく。cellChangesのインデックスとして使う。)
  const [cellChangesIndex, setCellChangesIndex] = React.useState(() => -1);
  // 変更セルsを配列で保持する。1変更タイミングにつき1要素を持つ。1変更タイミングで複数セル変更にも対応。変更【前後】の値を持つ
  const [cellChanges, setCellChanges] = React.useState<
    CellChange<TextCell>[][]
  >(() => []);

  const previousLogLength = usePrevious(workLogs.length);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previousLogLength !== workLogs.length && ref.current) {
      ref.current.scrollTo(0, ref.current.scrollHeight);
    }
  }, [workLogs, previousLogLength]);

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

  const handleDelete = (logId: number) => {
    setWorkLogs((currentLogs) => deleteLog(currentLogs, logId));
  };

  // ステートto表示モデル
  const rows = transformLogsToModel(workLogs, rowHeight, handleDelete);

  // 今回更新分を反映した全量データを返す
  const applyNewValue = (
    changes: CellChange<TextCell>[],
    prevPeople: WorkLog[],
    usePrevValue: boolean = false
  ): WorkLog[] => {
    changes.forEach((change) => {
      const workLogIndex = change.rowId;
      const fieldName = change.columnId;
      const cell = usePrevValue ? change.previousCell : change.newCell;
      prevPeople[Index][fieldName] = cell.text;
    });
    return [...prevPeople];
  };

  const applyChangesToPeople = (
    changes: CellChange<TextCell>[],
    prevWorkLog: WorkLog[]
  ): WorkLog[] => {
    setCellChanges([...cellChanges.slice(0, cellChangesIndex + 1), changes]); //現在値以降の要素を削除と今回の変更をセット
    setCellChangesIndex(cellChangesIndex + 1);
    const updated: WorkLog[] = applyNewValue(changes, prevWorkLog); // 更新データ
    return updated;
  };

  // データ更新
  const handleChanges = (changes: CellChange[]) => {
    console.log("handleChanges");
    console.log(changes);
    changes.forEach((change) => {
      const column = columns.find((col) => col.columnId === change.columnId);
      const logIdx = workLogs.findIndex((log) => log.id === change.rowId);
      if (logIdx === -1 || !column) return;
      setWorkLogs((updateLogs) => {
        if (!column.key) return updateLogs;
        if (column.groupName === "costs") {
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
          updateLogs[logIdx] = {
            ...updateLogs[logIdx],
            [column.key]: getCellValue(change),
          };
        }
        return [...updateLogs];
      });
    });
  };

  // 行追加
  const addBlankLog = () =>
    setWorkLogs((logs) => [
      ...logs,
      {
        id: getNextId(workLogs),
        employeeType: "",
        employeeName: "",
        cost1: 0,
        cost2: 0,
        description: "",
        costs: createInitialCosts(developMonth),
      },
    ]);

  // 列追加
  const addColumn = () => {
    // 新しい月を開発月リストに追加(要改善)
    const newMonth = `2024${String(developMonth.length + 1).padStart(2, "0")}`;
    // 月
    developMonth.push(newMonth);

    // 新しい列情報を生成
    const newColumn = {
      columnId: columns.length + 1,
      resizable: true,
      width: 100,
      key: `month_${columns.length + 1}`,
      name: newMonth, // ヘッダーに表示する名前
      arrayIdx: developMonth.length - 1, //エラーの意味が分からない。
      groupName: "costs",
    };

    setColumns([...columns, newColumn]);

    setHeaderRow({
      rowId: "header",
      height: rowHeight,
      cells: generateInitialHeader(developMonth, color),
    });

    // 各ログエントリに新しい月のコストを追加
    setWorkLogs((currentLogs) =>
      currentLogs.map((log) => ({
        ...log,
        costs: [...log.costs, 0], // 新しい月のコストを初期値0で追加
      }))
    );
  };

  // 列追加
  const deleteColumn = () => {
    if (developMonth.length === 0) return;

    const updatedDevelopMonth = developMonth.slice(0, -1);
    const updatedColumns = columns.slice(0, -1);
    const updatedWorkLogs = workLogs.map((log) => ({
      ...log,
      costs: log.costs.slice(0, -1),
    }));

    setDevelopMonth(updatedDevelopMonth);
    setColumns(updatedColumns);
    setWorkLogs(updatedWorkLogs);
    setHeaderRow({
      rowId: "header",
      height: rowHeight,
      cells: generateInitialHeader(updatedDevelopMonth, color),
    });
  };

  // a helper function used to reorder arbitrary arrays
  const reorderArray = <T extends {}>(arr: T[], idxs: number[], to: number) => {
    const movedElements = arr.filter((_, idx) => idxs.includes(idx));
    const targetIdx =
      Math.min(...idxs) < to
        ? (to += 1)
        : (to -= idxs.filter((idx) => idx < to).length);
    const leftSide = arr.filter(
      (_, idx) => idx < targetIdx && !idxs.includes(idx)
    );
    const rightSide = arr.filter(
      (_, idx) => idx >= targetIdx && !idxs.includes(idx)
    );
    return [...leftSide, ...movedElements, ...rightSide];
  };

  const handleRowsReorder = (targetRowId: Id, rowIds: Id[]) => {
    setWorkLogs((prevPeople) => {
      const to = workLogs.findIndex((workLog) => workLog.id === targetRowId);
      const rowsIds = rowIds.map((id) =>
        workLogs.findIndex((workLog) => workLog.id === id)
      );
      return reorderArray(prevPeople, rowsIds, to);
    });
  };

  const handleCanReorderRows = (targetRowId: Id, rowIds: Id[]): boolean => {
    return targetRowId !== "header";
  };

  return (
    <div ref={ref}>
      <div style={{ height: "250px", width: "800px", overflow: "auto" }}>
        <ReactGrid
          customCellTemplates={{
            dropdown: DropdownCellTemplate,
            button: ButtonCellTemplate,
          }}
          onCellsChanged={handleChanges}
          rows={[
            headerRow,
            ...rows.map((row, idx) =>
              idx % 2 === 0
                ? {
                    ...row,
                    cells: row.cells.map<Cell>((cell) => ({
                      ...cell,
                      style: { background: "rgba(0,0,0,0.02)" },
                    })),
                  }
                : row
            ),
            getBottomRow(
              rowHeight,
              workLogs.length,
              totalCosts.totalCost1,
              totalCosts.totalCost2,
              developMonth
            ),
          ]}
          stickyBottomRows={1}
          stickyTopRows={1}
          stickyLeftColumns={1}
          columns={columns}
          enableRangeSelection
          enableColumnSelection
          enableRowSelection
          enableFillHandle
          onColumnResized={(id, width) => {
            setColumns((columns) =>
              columns.map((col) =>
                col.columnId === id ? { ...col, width } : col
              )
            );
          }}
          onRowsReordered={handleRowsReorder}
          canReorderRows={handleCanReorderRows}
        />
      </div>
      {/* debug - 現在のステートを表示 */}
      {/* <Box display={"flex"} flexDirection={"row"}>
        <Box flex={1} p={3} style={{ backgroundColor: "#f0f0f0" }}>
          <strong>workLogs:</strong>
          <pre>{JSON.stringify(workLogs, null, 2)}</pre>
        </Box>
        <Box flex={1} p={3} style={{ backgroundColor: "#f0e0e0" }}>
          <strong>developMonth:</strong>
          <pre>{JSON.stringify(developMonth, null, 2)}</pre>
        </Box>
        <Box flex={1} p={3} style={{ backgroundColor: "#f0f0f0" }}>
          <strong>Cell Changes Index:</strong>
          <pre>{JSON.stringify(cellChangesIndex, null, 2)}</pre>
        </Box>
        <Box flex={1} p={3} style={{ backgroundColor: "#f0e0e0" }}>
          <strong>Cell Changes:</strong>
          <pre>{JSON.stringify(cellChanges, null, 2)}</pre>
        </Box>
      </Box> */}
      <button onClick={addBlankLog}>行追加</button>
      <button onClick={addColumn}>列追加</button>
      <button onClick={deleteColumn}>列削除</button>
    </div>
  );
};
