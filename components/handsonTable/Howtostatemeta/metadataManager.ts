// メタデータをセットする
export const applyMetadata = (data, hotInstance) => {
    data.forEach((rowData, rowIndex) => {
        if (rowData[0] === 'AAA') {
            hotInstance.setCellMeta(rowIndex, 0, 'className', 'blue-background');
        }
    });
    hotInstance.render(); // メタデータを反映するために再描画
};
