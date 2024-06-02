import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import ReactDOM from 'react-dom';
import KeyValueAutocomplete from '@/components/handsonTable/customRenderer/keyValueAutocomplete';
import HandsontableComponent from '@/components/handsonTable/style';
import CalculateSample from '@/components/handsonTable/calculateSample';
import ButtonRenderer from '@/components/handsonTable/customRenderer/button';
import  ReCulcComponent  from '@/components/handsonTable/customRenderer/ReCulcComponent';

// register Handsontable's modules
registerAllModules();

const App = () => {
  return (
  <>
    <KeyValueAutocomplete/>
    <HandsontableComponent/>
    <CalculateSample/>
    <ButtonRenderer/>
    <ReCulcComponent/>
  </>
  );
};

export default App;
