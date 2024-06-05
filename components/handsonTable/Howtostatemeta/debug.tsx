import React from 'react';

// debug用のデータ表示
export const Debug = ({ inputValue, tableData, hotTableRef }) => {
    return (
        <div style={{ backgroundColor: '#f0f0f0', padding: '10px', border: '1px solid #ccc' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <strong>Input Value:</strong> {inputValue}
                </div>
                <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <strong>Table Data State:</strong> {JSON.stringify(tableData)}
                </div>
                <div style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <strong>Table Data:</strong> {JSON.stringify(hotTableRef.current?.hotInstance?.getData() || [])}
                </div>
            </div>
        </div>
    );
};
