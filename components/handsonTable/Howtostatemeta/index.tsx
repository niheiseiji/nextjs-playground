import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { initialData } from './data';
import { calculateSums } from './calculator';
import { applyMetadata } from './metadataManager';
import { Debug } from './debug';

const HandsontableComponent = () => {
    const hotTableRef = useRef(null);
    const inputRef = useRef(null);
    const [tableData, setTableData] = useState(initialData);

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

    const handleGetData = () => {
        const inputValue = inputRef.current.value;
        const hotInstance = hotTableRef.current.hotInstance;
        const tableData = hotInstance.getData();
        console.log('Input Value:', inputValue);
        console.log('Table Data:', tableData);
    };

    return (
        <div>
            <input
                type="text"
                ref={inputRef}
                placeholder="Enter value"
            />
            <button onClick={handleGetData}>Get Data</button>
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

            {/* debug */}
            <Debug tableData={tableData} hotTableRef={hotTableRef} />
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
