import React, { useRef } from 'react';
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';
import Handsontable from 'handsontable';
import { Button } from '@mui/material';

// Register Handsontable's modules
registerAllModules();

// Define the Option type
type Option = {
  _id: number;
  label: string;
};

// Example options
const colorOptions: Option[] = [
  { _id: 1, label: 'yellow' },
  { _id: 2, label: 'red' },
  { _id: 3, label: 'orange' },
  { _id: 4, label: 'green' },
  { _id: 5, label: 'blue' },
  { _id: 6, label: '-' },
];

const restrictedColorOptions = colorOptions.filter(option=>['yellow', 'red'].includes(option.label))

// Custom editor class for key-value dropdown
class KeyValueListEditor extends Handsontable.editors.HandsontableEditor {
  prepare(row, col, prop, td, value, cellProperties) {
    super.prepare(row, col, prop, td, value, cellProperties);

    Object.assign(this.htOptions, {
      licenseKey: 'non-commercial-and-evaluation',
      data: colorOptions,
      columns: [
        {
          data: '_id',
        },
        {
          data: 'label',
        },
      ],
      hiddenColumns: {
        columns: [0], // Hide the ID column
      },
      colWidths: cellProperties.width - 1,
    });

    if (cellProperties.keyValueListCells) {
      this.htOptions.cells = cellProperties.keyValueListCells;
    }
    if (this.htEditor) {
      this.htEditor.destroy();
    }

    this.htEditor = new Handsontable(this.htContainer, this.htOptions);
  }
  
  setValue(value) {
    if (this.htEditor) {
      const index = this.htEditor.getData().findIndex(option => option._id === value);
      if (index !== -1) {
        this.htEditor.selectCell(index, 1);
      }
    }
  }
  
  getValue() {
    const selected = this.htEditor?.getSelectedLast();
    if (selected) {
      const value = this.htEditor?.getSourceDataAtRow(selected[0]);
      return value ? value._id : null;
    }
    return null;
  }

  open() {
    super.open();
    if (this.htEditor) {
      this.htEditor.render();
      this.htEditor.rootElement.addEventListener('keydown', this.onBeforeKeyDown.bind(this));
    }
  }

  close() {
    super.close();
    if (this.htEditor) {
      this.htEditor.rootElement.removeEventListener('keydown', this.onBeforeKeyDown.bind(this));
    }
  }

  onBeforeKeyDown(event) {
    const instance = this.htEditor;
    let stopEvent = false;
    if (event.keyCode === 38) { // Arrow Up
      const selectedRow = instance.getSelectedLast()[0];
      if (selectedRow > 0) {
        instance.selectCell(selectedRow - 1, 1);
      }
      stopEvent = true;
    }
    if (event.keyCode === 40) { // Arrow Down
      const selectedRow = instance.getSelectedLast()[0];
      if (selectedRow < instance.countRows() - 1) {
        instance.selectCell(selectedRow + 1, 1);
      }
      stopEvent = true;
    }
    if (stopEvent) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}

// Custom renderer for key-value dropdown
const keyValueListRenderer = function (hot, TD, row, col, prop, value, cellProperties) {
  const item = colorOptions.find(option => option._id === value);
  const text = item ? item.label : '';

  Handsontable.dom.empty(TD);
  TD.textContent = text;
  return TD;
};

const keyValueListValidator = function(value, callback) {
  let valueToValidate = value;

  if (valueToValidate === null || valueToValidate === void 0) {
    valueToValidate = '';
  }

  if (this.allowEmpty && valueToValidate === '') {
    callback(true);
  } else {
    callback(colorOptions.find(({ _id }) => _id === value) ? true : false);
  }
};

// Register the custom cell type
Handsontable.cellTypes.registerCellType('key-value-list', {
  editor: KeyValueListEditor,
  validator: keyValueListValidator,
  renderer: keyValueListRenderer,
});

const KeyValueAutocomplete = () => {
  const hotTableComponent = useRef(null);

  const logData = () => {
    if (hotTableComponent.current) {
      const hotInstance = hotTableComponent.current.hotInstance;
      console.log(hotInstance.getData());
    }
  };

  const afterChange = (changes, source) => {
    console.log(source)
    if (source === 'edit' || source === 'Autofill.fill' || source === 'CopyPaste.paste') {
      const hotInstance = hotTableComponent.current.hotInstance;
      changes.forEach(([row, prop, oldValue, newValue]) => {
        if (prop === 0 && newValue === 'BMW') {
          hotInstance.setDataAtCell(row, 2, '-'); // Set 'Chassis color' to '-'
          hotInstance.setCellMeta(row, 1, 'className', 'grayed-out'); // Gray out the 'Year' cell
        }
        if(prop === 0 && newValue === 'Chrysler'){
          hotInstance.setCellMeta(row, 2, 'source', restrictedColorOptions.map(option => option.label));
        }
      });
    }
  };

  return (
    <>
      <HotTable
        ref={hotTableComponent}
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation"
        data={[
          ['BMW', 2017, 1, 1], // 'yellow' のIDは 1
          ['Nissan', 2018, 2, 2], // 'red' のIDは 2
          ['Chrysler', 2019, 3, 3], // 'orange' のIDは 3
          ['Volvo', 2020, 4, 4] // 'green' のIDは 4
        ]}
        colHeaders={['Car', 'Year', 'Chassis color', 'Bumper color']}
        columns={[
          {
            type: 'dropdown',
            source: ['BMW', 'Chrysler', 'Nissan', 'Suzuki', 'Toyota', 'Volvo'],
            strict: false
          },
          { type: 'numeric' },
          {
            type: 'dropdown',
            source: colorOptions.map(option => option.label),
            strict: false,
            visibleRows: 4
          },
          {
            type: 'key-value-list',
            source: colorOptions
          }
        ]}
        afterChange={afterChange}
      />
      <Button variant="contained" onClick={logData}>データ取得</Button>
    </>
  );
};

export default KeyValueAutocomplete;
