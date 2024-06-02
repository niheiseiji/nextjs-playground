import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";
import ReactDOM from "react-dom";
import KeyValueAutocomplete from "@/components/handsonTable/customRenderer/keyValueAutocomplete";
import HandsontableComponent from "@/components/handsonTable/style";
import CalculateSample from "@/components/handsonTable/calculateSample";
import ButtonRenderer from "@/components/handsonTable/customRenderer/button";
import ReCulcComponent from "@/components/handsonTable/customRenderer/ReCulcComponent";
import CalculattionSort from "@/components/handsonTable/CalculationSort";

// register Handsontable's modules
registerAllModules();

const App = () => {
  return (
    <>
      <CalculattionSort numRows={300}/>
      <KeyValueAutocomplete />
      <HandsontableComponent />
      <CalculateSample />
      <ButtonRenderer />
      <ReCulcComponent />
    </>
  );
};

export default App;
