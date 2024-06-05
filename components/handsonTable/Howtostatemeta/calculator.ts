// 行合計と小計行の計算処理を定義する
export const calculateSums = (data) => {
    const newData = data.map(row => [...row]);
    newData.forEach((row, rowIndex) => {
        if (rowIndex < newData.length - 1) {
            row[3] = row[1] + row[2];
        }
    });

    // 小計行の計算
    const totals = newData.slice(0, -1).reduce(
        (acc, row) => {
            acc[1] += row[1];
            acc[2] += row[2];
            acc[3] += row[3];
            return acc;
        },
        [0, 0, 0, 0]
    );

    newData[newData.length - 1] = ['Total', totals[1], totals[2], totals[3]];
    return newData;
};
