import React, { useRef } from 'react';
import Handsontable from 'handsontable';
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.css';

const MyHandsontable = () => {
    const hotTableComponent = useRef(null);

    const afterSelectionEnd = (r, c, r2, c2) => {
        // 単一セルが選択されたとき
        if (r !== r2 || c !== c2) return;

        const hotInstance = hotTableComponent.current.hotInstance;

        // セルエディタが'textEditor', 'dropdownEditor', 'autocompleteEditor' の場合のみ強制的に入力モードにする
        const cellMeta = hotInstance.getCellMeta(r, c);
        const cellEditor = hotInstance.getCellEditor(r, c);
        if (cellEditor == null) return;
        if (cellMeta.readOnly) return;
        if (
            cellMeta.editor !== Handsontable.editors.TextEditor &&
            cellMeta.editor !== Handsontable.editors.DropdownEditor &&
            cellMeta.editor !== Handsontable.editors.AutocompleteEditor
        ) return;

        // 強制入力モード パターン１：セルフォーカスして1文字目を強制的に入れ込むことで回避
        const activeEditor = hotInstance.getActiveEditor();
        const cellValue = hotInstance.getDataAtCell(r, c);
        activeEditor.beginEditing();
        hotInstance.setDataAtCell(r, c, cellValue, 'system');

        // 強制入力モード パターン２：プルダウンはデフォで開く挙動にすることで回避
        // const activeEditor = hotInstance.getActiveEditor();
        // const cellValue = hotInstance.getDataAtCell(r, c);

        // 特定のエディタの場合にフォーカスを適切に管理する
        // if (cellMeta.editor === Handsontable.editors.TextEditor) {
        //     activeEditor.beginEditing();
        //     hotInstance.setDataAtCell(r, c, cellValue, 'system');
        // } else {
        //     setTimeout(() => {
        //         activeEditor.beginEditing();
        //     }, 0);
        // }
    };

    return (
        <HotTable
            ref={hotTableComponent}
            data={Handsontable.helper.createSpreadsheetData(5, 10)}
            colHeaders={true}
            rowHeaders={true}
            afterSelectionEnd={afterSelectionEnd}
            columns={[
                { data: 0 },
                { data: 1 },
                { data: 2 },
                {
                    data: 3,
                    type: 'dropdown',
                    source: ['選択肢1', '選択肢2', '選択肢3'],
                },
                { data: 4 },
                { data: 5 },
                { data: 6 },
                { data: 7 },
                { data: 8 },
                { data: 9 },
            ]}
            licenseKey="non-commercial-and-evaluation"
        />
    );
};

export default MyHandsontable;
