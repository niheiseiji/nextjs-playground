import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';

const HandsontableComponent = () => {
    const hotTableRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [tableData, setTableData] = useState([
        ['AAA', 8, 0, 0],
        ['BBB', 0, 7, 0],
        ['AAA', 0, 0, 0],
        ['Total', 8, 7, 15]
    ]);

    const calculateSums = (data) => {
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

    const applyMetadata = (data, hotInstance) => {
        data.forEach((rowData, rowIndex) => {
            if (rowData[0] === 'AAA') {
                hotInstance.setCellMeta(rowIndex, 0, 'className', 'blue-background');
            }
        });
        hotInstance.render(); // メタデータを反映するために再描画
    };

    useEffect(() => {
        const hotInstance = hotTableRef.current.hotInstance;
        if (hotInstance) {
            const updatedData = calculateSums(tableData);
            hotInstance.loadData(updatedData);
            applyMetadata(updatedData, hotInstance); // 初期化時にメタデータを設定
        }
    }, [tableData]);

    const handleAfterChange = (changes, source) => {
        if (changes) {
            const hotInstance = hotTableRef.current.hotInstance;
            const newData = [...hotInstance.getData()];
            changes.forEach(([row, col, oldVal, newVal]) => {
                newData[row][col] = newVal;
                if (col === 1 || col === 2) {
                    newData[row][3] = newData[row][1] + newData[row][2];
                }
            });

            // 小計行の更新
            const updatedData = calculateSums(newData);
            setTableData(updatedData);
            applyMetadata(updatedData, hotInstance); // メタデータを再設定
        }
    };

    useEffect(() => {
        const hotInstance = hotTableRef.current.hotInstance;
        if (hotInstance) {
            applyMetadata(tableData, hotInstance); // inputValueの変更時にメタデータを再設定
        }
    }, [inputValue]); // inputValueの変更を監視し、メタデータを再設定

    const handleUpdateTable = () => {
        const hotInstance = hotTableRef.current.hotInstance;
        if (hotInstance) {
            const updatedData = calculateSums(tableData);
            setTableData(updatedData);
            applyMetadata(updatedData, hotInstance);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
            />
            <HotTable
                ref={hotTableRef}
                imeFastEdit={true}
                data={tableData}
                colHeaders={['Option', 'Value 1', 'Value 2', 'Sum']}
                rowHeaders={true}
                contextMenu={true}
                width="600"
                height="300"
                licenseKey="non-commercial-and-evaluation"
                afterChange={handleAfterChange}
                columns={[
                    {
                        type: 'dropdown',
                        source: ['AAA', 'BBB']
                    },
                    { type: 'numeric' },
                    { type: 'numeric' },
                    { type: 'numeric', readOnly: true }
                ]}
            />
            <div style={{ backgroundColor: '#f0f0f0', padding: '10px', border: '1px solid #ccc' }}>
                <button onClick={handleUpdateTable}>Update Table Data</button>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                        <strong>Input Value:</strong> {inputValue}
                    </div>
                    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                        <strong>Table Data State:</strong> {JSON.stringify(tableData)}
                    </div>
                    <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                        <strong>Table Data:</strong> {JSON.stringify(hotTableRef.current?.hotInstance?.getData() || [])}
                    </div>
                </div>
            </div>
            <style>
                {`
          .blue-background {
            background-color: blue !important;
            color: white !important;
          }
        `}
            </style>
        </div>
    );
};

export default HandsontableComponent;
