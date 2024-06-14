import React, { useRef } from 'react';
import TextInputComponent from './TextInputComponent';
import HandsontableComponent from './HandsontableComponent';

const ParentComponent: React.FC = () => {
    const hotTableRef = useRef<any>(null);
    const textInputRef = useRef<any>(null);
    const displayDataRef = useRef<{ inputValue: string; tableData: any[] }>({ inputValue: '', tableData: [] });

    const handleCheck = () => {
        if (hotTableRef.current && textInputRef.current) {
            const hotInstance = hotTableRef.current.hotInstance;
            const currentTableData = hotInstance.getData();
            const inputValue = textInputRef.current.getInputValue();
            displayDataRef.current = {
                inputValue,
                tableData: currentTableData
            };
            // Trigger a manual re-render
            const displayDataElement = document.getElementById('display-data');
            if (displayDataElement) {
                displayDataElement.textContent = JSON.stringify(displayDataRef.current, null, 2);
            }
        }
    };

    return (
        <div>
            <TextInputComponent ref={textInputRef} />
            <HandsontableComponent hotTableRef={hotTableRef} />
            <button onClick={handleCheck}>入力チェック</button>
            <div>
                <h3>入力チェック結果</h3>
                <pre id="display-data"></pre>
            </div>
        </div>
    );
};

export default ParentComponent;
