import React, { useEffect, useState } from 'react';

const RangeSlider = ({ type, onPriceChange }) => {
    const [minValue, setMinValue] = useState(type === 'Rent' ? 1000 : 5);
    const [maxValue, setMaxValue] = useState(type == 'Rent' ? 100000 : 10000);
    const [step, setStep] = useState(type == 'Rent' ? 1000 : 5)
    const [minPrice, setMinPrice] = useState(minValue)
    const [maxPrice, setMaxPrice] = useState(maxValue)
    const handleMinChange = (e) => {
        setMinPrice(e.target.value);
        onPriceChange(e.target.value, maxPrice);
        if (minPrice > 100 && type === 'Sale') {
            setStep(20);
        }
        if (minPrice > 100000 && type === 'Rent') {
            setStep(50000);
        }
        if (minPrice > 1000000 && type === 'Rent') {
            setStep(200000);
        }
    };

    const handleMaxChange = (e) => {
        setMaxPrice(e.target.value);
        onPriceChange(minPrice, e.target.value);
    };
    useEffect(() => {
        if (type === 'Rent') {
            setMinValue(1000);
            setMaxValue(1000000);
            setStep(1000);
        } else {
            setMinValue(5);
            setMaxValue(10000);
            setStep(5)
        }
    }, [type]);

    const formatValue = (value) => {
        if (type === 'Rent') {
            if (value >= 100000)
                return `${(value / 100000).toFixed(2)} L`;
            else
                return value.toLocaleString();

        }
        else {
            if (value >= 100)
                return `${(value / 100).toFixed(2)} Cr`;
            else
                return `${value} L`;
        }
    }
    return (
        <div>
            <input
                type="range"
                min={minValue}
                max={type==='Sale'?maxValue / 3:maxValue/2}
                value={minPrice}
                step={step}
                onChange={handleMinChange}
            /><input
                type="range"
                min={minValue * 3}
                max={maxValue}
                value={maxPrice}
                step={step}
                onChange={handleMaxChange}
            />
            <p>
                Min: {formatValue(minPrice)} - Max: {formatValue(maxPrice)}
            </p>
        </div>
    );
};

export default RangeSlider;