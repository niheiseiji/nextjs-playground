import React, { useState, FC } from "react";

/**
 * 親子コンポーネントでメモ化を実装したサンプル
 * 100*20くらいのデータ量でメモ化していない場合と比べて、onChangeの性能について優位な差がでる。Blurは変わらない。
 *
 */

// 行数と列数の定義
const NUM_ROWS = 20;
const NUM_COLS = 200;

/**
 *  type
 */
interface ColumnSumProps {
  sum: number;
  index: number;
}

interface ColumnSumsProps {
  matrix: number[][];
}

/**
 *  子コンポーネント
 */
const ColumnSum: FC<ColumnSumProps> = React.memo(
  ({ sum, index }) => {
    console.log(`[ColumnSum]Rendering Column ${index + 1}`);
    return (
      <div>
        Column {index + 1}: {sum}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.sum === nextProps.sum;
  }
);
ColumnSum.displayName = "ColumnSum";

// メモ化してない場合
// const ColumnSum: FC<ColumnSumProps> = ({ sum, index }) => {
//   console.log(`[ColumnSum] Rendering Column ${index + 1}`);
//   return (
//     <div>
//       Column {index + 1}: {sum}
//     </div>
//   );
// };
// ColumnSum.displayName = "ColumnSum";

/**
 *  親コンポーネント
 */
const ColumnSumsDisplay: FC<ColumnSumsProps> = React.memo(({ matrix }) => {
  console.log("[ColumnSumsDisplay]Calculating Column Sums");
  // TODO:性能改善
  const columnSums = matrix[0].map((_, colIndex) =>
    matrix.reduce((sum, row) => sum + row[colIndex], 0)
  );
  return (
    <div>
      <h3>Column Sums:</h3>
      {columnSums.map((sum, index) => (
        <ColumnSum key={index} sum={sum} index={index} />
      ))}
    </div>
  );
});
ColumnSumsDisplay.displayName = "ColumnSumsDisplay";

// メモ化してない場合
// const ColumnSumsDisplay: FC<ColumnSumsProps> = ({ matrix }) => {
//   console.log("[ColumnSumsDisplay]Calculating Column Sums");
//   // TODO:性能改善
//   const columnSums = matrix[0].map((_, colIndex) =>
//     matrix.reduce((sum, row) => sum + row[colIndex], 0)
//   );
//   return (
//     <div>
//       <h3>Column Sums:</h3>
//       {columnSums.map((sum, index) => (
//         <ColumnSum key={index} sum={sum} index={index} />
//       ))}
//     </div>
//   );
// };
// ColumnSumsDisplay.displayName = "ColumnSumsDisplay";

// interface RowSumsProps {
//   matrix: number[][];
// }

// const RowSumsDisplay: FC<RowSumsProps> = React.memo(({ matrix }) => {
//   console.log("Calculating Row Sums");
//   // TODO:性能改善
//   const rowSums = matrix.map((row) =>
//     row.reduce((sum, value) => sum + value, 0)
//   );
//   return (
//     <div>
//       <h3>Row Sums:</h3>
//       {rowSums.map((sum, index) => (
//         <div key={index}>
//           Row {index + 1}: {sum}
//         </div>
//       ))}
//     </div>
//   );
// });
// RowSumsDisplay.displayName = "RowSumsDisplay";

const MyPage: FC = () => {
  const initialMatrix = Array(NUM_ROWS)
    .fill(null)
    .map(() => Array(NUM_COLS).fill(0));
  const [matrix, setMatrix] = useState<number[][]>(initialMatrix);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    const newMatrix = matrix.map((row, rIdx) =>
      rIdx === rowIndex ? [...row] : row
    );
    newMatrix[rowIndex][colIndex] = parseFloat(event.target.value) || 0;
    setMatrix(newMatrix);
  };

  return (
    <div>
      {matrix.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((value, colIndex) => (
            <input
              key={colIndex}
              type="number"
              value={value}
              onChange={(event) => handleChange(event, rowIndex, colIndex)}
              style={{ width: "50px", marginRight: "10px" }}
            />
          ))}
        </div>
      ))}
      <ColumnSumsDisplay matrix={matrix} />
      {/* <RowSumsDisplay matrix={matrix} /> */}
    </div>
  );
};

export default MyPage;
