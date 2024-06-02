type State = {
  rowCostAmounts: number[];
  colCostAmounts: number[];
  oldValues: number[][];
};

type Action =
  | {
      type: "UPDATE_CELL";
      rowIndex: number;
      columnIndex: number;
      newValue: number;
    }
  | { type: "ADD_ROW"; numCol: number };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "UPDATE_CELL": {
      const { rowIndex, columnIndex, newValue } = action;
      const oldValue = state.oldValues[rowIndex][columnIndex];
      const diff = newValue - oldValue;

      // 更新行の合計
      const newRowCostAmounts = [...state.rowCostAmounts];
      newRowCostAmounts[rowIndex] += diff;

      // 更新列の合計
      const newColCostAmounts = [...state.colCostAmounts];
      newColCostAmounts[columnIndex] += diff;

      // 更新古い値
      const newOldValues = state.oldValues.map((row, idx) =>
        idx === rowIndex
          ? row.map((v, i) => (i === columnIndex ? newValue : v))
          : row
      );

      return {
        ...state,
        rowCostAmounts: newRowCostAmounts,
        colCostAmounts: newColCostAmounts,
        oldValues: newOldValues,
      };
    }
    case "ADD_ROW": {
      const newRow = Array(action.numCol).fill(0);
      return {
        ...state,
        oldValues: [...state.oldValues, newRow],
        rowCostAmounts: [...state.rowCostAmounts, 0],
      };
    }
    default:
      return state;
  }
};
