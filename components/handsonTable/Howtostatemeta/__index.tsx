import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import numbro from 'numbro';
import jaJP from 'numbro/languages/ja-JP';
import { registerAllModules } from 'handsontable/registry';

// register Handsontable's modules
registerAllModules();

// register the languages you need
numbro.registerLanguage(jaJP);

const HandsontableComponent = () => {
    const hotTableRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    const [showError, setShowError] = useState(false);

    const tableData = [
        ['AAA', 8, 0, 8],
        ['BBB', 0, 7, 7],
        ['AAA', 0, 0, 0],
        ['Total', 8, 7, 15]
    ];

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
            } else {
                hotInstance.removeCellMeta(rowIndex, 0, 'className');
            }
        });
        hotInstance.render(); // メタデータを反映するために再描画
    };

    useEffect(() => {
        const hotInstance = hotTableRef.current.hotInstance;
        if (hotInstance) {
            const updatedData = calculateSums(tableData);
            hotInstance.updateSettings({ data: updatedData })
            applyMetadata(updatedData, hotInstance); // 初期化時にメタデータを設定
        }
    }, []); // 初期化時のみ実行

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
            hotInstance.updateSettings({ data: updatedData })
            applyMetadata(updatedData, hotInstance); // メタデータを再設定
        }
    };

    const handleBlur = () => {
        if (inputValue.trim() === '') {
            setShowError(true);
        } else {
            setShowError(false);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleBlur}
            />
            {showError && <div style={{ color: 'red' }}>値を入力してください。</div>}
            <HotTable
                ref={hotTableRef}
                imeFastEdit={true}
                data={calculateSums(tableData)}
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
