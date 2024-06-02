import React, { useRef, useEffect } from 'react';
import { HotTable, HotColumn } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';
import { HyperFormula } from 'hyperformula';


const CalculateSample: React.FC = () => {
    const hotTableComponent = useRef(null);

    const initialData = [
        { before: "test", val1: 1, val2: 2, val3: 3, total: '=SUM(B1:D1)', after: "test" },
        { before: "test", val1: 1, val2: 2, val3: 3, total: '=SUM(B2:D2)', after: "test" },
        { before: "test", val1: 1, val2: 2, val3: 3, total: '=SUM(B3:D3)', after: "test" },
        { val1: '=SUM(B1:B3)', val2: '=SUM(C1:C3)', val3: '=SUM(D1:D3)', total: '=SUM(B4:D4)' }
    ];

    //  create an external HyperFormula instance
    const hyperformulaInstance = HyperFormula.buildEmpty({
        // to use an external HyperFormula instance,
        // initialize it with the `'internal-use-in-handsontable'` license key
        licenseKey: 'internal-use-in-handsontable',
    });

    return (
        <HotTable
            ref={hotTableComponent}
            data={initialData}
            colHeaders={['before','Val1', 'Val2', 'Val3', 'Total','after']}
            rowHeaders={true}
            formulas={{
                engine: hyperformulaInstance,
            }}
            // afterChange={handleAfterChange}
            licenseKey="non-commercial-and-evaluation"
        >
            <HotColumn data="before" type="text" />
            <HotColumn data="val1" type="numeric" />
            <HotColumn data="val2" type="numeric" />
            <HotColumn data="val3" type="numeric" />
            <HotColumn data="total" type="numeric" />
            <HotColumn data="after" type="text" />

        </HotTable>
    );
};

export default CalculateSample;
