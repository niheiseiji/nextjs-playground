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
import IMEcontrol from "@/components/handsonTable/IMEcontrol";
import Howtostatemeta from "@/components/handsonTable/Howtostatemeta/index";

// register Handsontable's modules
registerAllModules();

const App = () => {
  return (
    <>
      {/* <IMEcontrol/> */}
      {/* <CalculattionSort numRows={20}/> */}
      <Howtostatemeta/>
      {/* <KeyValueAutocomplete />
      <HandsontableComponent />
      <CalculateSample />
      <ButtonRenderer />
      <ReCulcComponent /> */}
    </>
  );
};

export default App;
