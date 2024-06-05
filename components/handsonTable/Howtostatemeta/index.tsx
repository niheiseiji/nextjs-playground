import React, { useEffect, useRef, useState } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import { initialData } from './data';
import { calculateSums } from './calculator';
import { applyMetadata } from './metadataManager';
import { Debug } from './debug';

const HandsontableComponent = () => {
    const hotTableRef = useRef(null);
    const [inputValue, setInputValue] = useState('');
    // 以降すべてのデータはステートとして扱う。initialDataは使わない。
    const [tableData, setTableData] = useState(initialData);

    // 初期表示のときにだけ実行して、計算とメタデータのレンダリングを更新する
    useEffect(() => {
        const hotInstance = hotTableRef.current.hotInstance;
        if (hotInstance) {
            const updatedData = calculateSums(tableData);
            hotInstance.loadData(updatedData);
            applyMetadata(updatedData, hotInstance); // 初期化時にメタデータを設定
        }
    }, [tableData]);

    // テーブルデータ変更後のフック
    const handleAfterChange = (changes, source) => {
        console.log('handleAfterChange')
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

    // 別のステートが更新されたときに、コンポーネントが再レンダリングされてテーブル側のメタデータが消えてしまう事象への対策
    useEffect(() => {
        const hotInstance = hotTableRef.current.hotInstance;
        if (hotInstance) {
            applyMetadata(tableData, hotInstance); // inputValueの変更時にメタデータを再設定
        }
    }, [inputValue]); // inputValueの変更を監視し、メタデータを再設定

    // debug
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

            {/* debug */}
            <button onClick={handleUpdateTable}>Update Table Data</button>
            <Debug inputValue={inputValue} tableData={tableData} hotTableRef={hotTableRef} />
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
