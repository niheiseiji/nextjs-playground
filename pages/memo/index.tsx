import React, { useState, useMemo, useEffect } from 'react';

// useMemoを使用して計算するコンポーネント
const SquareWithMemo = () => {
    const [number, setNumber] = useState(0);
    const squaredValue = useMemo(() => {
        console.log('Calculating square with useMemo:', number);
        return number * number;
    }, [number]);

    return (
        <div>
            <h2>useMemo Example</h2>
            <input
                type="number"
                value={number}
                onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
            />
            <p>The square of {number} is {squaredValue}</p>
        </div>
    );
};

// useEffectを使用して計算するコンポーネント
const SquareWithEffect = () => {
    const [number, setNumber] = useState(0);
    const [squaredValue, setSquaredValue] = useState(0);

    useEffect(() => {
        console.log('Calculating square with useEffect:', number);
        setSquaredValue(number * number);
    }, [number]);  // numberが変更されたときだけ効果を実行

    return (
        <div>
            <h2>useEffect Example</h2>
            <input
                type="number"
                value={number}
                onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
            />
            <p>The square of {number} is {squaredValue}</p>
        </div>
    );
};

const App = () => {
    return (
        <div>
            <SquareWithMemo />
            <SquareWithEffect />
        </div>
    );
};

export default App;
