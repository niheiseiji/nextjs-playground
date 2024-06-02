import { HyperFormula } from "hyperformula";
import React from "react";
import "@handsontable/pikaday/css/pikaday.css";
import "./styles.css";
import { HotTable, HotColumn } from "@handsontable/react";
import { data } from "./constants";

import {
  addClassesToRows,
  alignHeaders
} from "./hooksCallbacks";

import "handsontable/dist/handsontable.min.css";
import { registerLanguageDictionary } from "handsontable/i18n/registry";
import { jaJP } from "handsontable/i18n/languages";
import { NextPage } from "next";
import CalculateComponent from '../../components/handsonTable/calculate';

registerLanguageDictionary(jaJP);

const HandsOnTableDemoPage: NextPage = () => {
  //  create an external HyperFormula instance
  const hyperformulaInstance = HyperFormula.buildEmpty({
    // to use an external HyperFormula instance,
    // initialize it with the `'internal-use-in-handsontable'` license key
    licenseKey: 'internal-use-in-handsontable',
  });

  return (
    <>
      <div>
        <h1>HandsonTableのデモ日本語版</h1>
        <HotTable
          formulas={{
            engine: hyperformulaInstance,
            // sheetName: 'Sheet1',
          }}
          data={data}
          height={450}
          colWidths={[170, 222, 130, 120, 120, 130, 156]}
          colHeaders={[
            "Company name",
            "Name",
            "Sell date",
            "In stock",
            "Qty",
            "Order ID",
            "Country"
          ]}
          dropdownMenu={true}
          hiddenColumns={{
            indicators: true
          }}
          contextMenu={true}
          multiColumnSorting={true}
          filters={true}
          rowHeaders={true}
          afterGetColHeader={alignHeaders}
          beforeRenderer={addClassesToRows}
          manualRowMove={true}
          autoWrapRow={true}
          navigableHeaders={true}
          // licenseKey="non-commercial-and-evaluation"
          language="ja-JP"
        >
          <HotColumn data={1} />
          <HotColumn data={3} />
          <HotColumn data={4} type="date" allowInvalid={false} />
          <HotColumn data={6} type="checkbox" className="htCenter" />
          <HotColumn data={7} type="numeric" />
          <HotColumn data={5} type="numeric" />
          <HotColumn data={2} />
        </HotTable>
      </div>
      <div>
          <CalculateComponent/>
      </div>
    </>
  );
};

export default HandsOnTableDemoPage;
