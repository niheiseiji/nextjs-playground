import React, { useImperativeHandle, useState, forwardRef } from 'react';

interface TextInputComponentProps {}

const TextInputComponent = forwardRef<any, TextInputComponentProps>((props, ref) => {
    const [inputValue, setInputValue] = useState('');
    const [showError, setShowError] = useState(false);

    const handleBlur = () => {
        if (inputValue.trim() === '') {
            setShowError(true);
        } else {
            setShowError(false);
        }
    };

    useImperativeHandle(ref, () => ({
        getInputValue: () => inputValue
    }));

    return (
        <div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onBlur={handleBlur}
            />
            {showError && <div style={{ color: 'red' }}>値を入力してください。</div>}
        </div>
    );
});

export default TextInputComponent;
