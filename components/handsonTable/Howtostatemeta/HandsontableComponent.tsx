import React, { useEffect } from 'react';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import numbro from 'numbro';
import jaJP from 'numbro/languages/ja-JP';
import { registerAllModules } from 'handsontable/registry';

numbro.registerLanguage(jaJP);
registerAllModules();

interface HandsontableComponentProps {
    hotTableRef: React.RefObject<any>;
}

const HandsontableComponent: React.FC<HandsontableComponentProps> = ({ hotTableRef }) => {
    const tableData = [
        ['AAA', 8, 0, 8],
        ['BBB', 0, 7, 7],
        ['AAA', 0, 0, 0],
        ['Total', 8, 7, 15]
    ];

    const calculateSums = (data: any[]) => {
        const newData = data.map(row => [...row]);
        newData.forEach((row, rowIndex) => {
            if (rowIndex < newData.length - 1) {
                row[3] = row[1] + row[2];
            }
        });

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

    const applyMetadata = (data: any[], hotInstance: any) => {
        data.forEach((rowData, rowIndex) => {
            if (rowData[0] === 'AAA') {
                hotInstance.setCellMeta(rowIndex, 0, 'className', 'blue-background');
            } else {
                hotInstance.removeCellMeta(rowIndex, 0, 'className');
            }
        });
        hotInstance.render();
    };

    useEffect(() => {
        const hotInstance = hotTableRef.current?.hotInstance;
        if (hotInstance) {
            const updatedData = calculateSums(tableData);
            hotInstance.updateSettings({ data: updatedData });
            applyMetadata(updatedData, hotInstance);
        }
    }, [hotTableRef]);

    const handleAfterChange = (changes: any, source: string) => {
        if (changes) {
            const hotInstance = hotTableRef.current.hotInstance;
            const newData = [...hotInstance.getData()];
            changes.forEach(([row, col, oldVal, newVal]: [number, number, any, any]) => {
                newData[row][col] = newVal;
                if (col === 1 || col === 2) {
                    newData[row][3] = newData[row][1] + newData[row][2];
                }
            });

            const updatedData = calculateSums(newData);
            hotInstance.updateSettings({ data: updatedData });
            applyMetadata(updatedData, hotInstance);
        }
    };

    return (
        <div>
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
