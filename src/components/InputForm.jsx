import React from 'react';

const InputField = ({ label, value, onChange, min, max, step, suffix }) => (
    <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="w-20 p-1 text-right text-sm border rounded focus:ring-blue-500 focus:border-blue-500"
                    step={step}
                />
                {suffix && <span className="ml-1 text-xs text-gray-500">{suffix}</span>}
            </div>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
    </div>
);

export default function InputForm({ inputs, setInputs }) {
    const handleChange = (key, value) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Parameters</h2>

            <InputField
                label="Stock Price (S)"
                value={inputs.S}
                onChange={(v) => handleChange('S', v)}
                min={1} max={500} step={1}
                suffix="$"
            />
            <InputField
                label="Strike Price (K)"
                value={inputs.K}
                onChange={(v) => handleChange('K', v)}
                min={1} max={500} step={1}
                suffix="$"
            />
            <InputField
                label="Time to Maturity (T)"
                value={inputs.T}
                onChange={(v) => handleChange('T', v)}
                min={0.01} max={5} step={0.01}
                suffix="Years"
            />
            <InputField
                label="Risk-free Rate (r)"
                value={inputs.r}
                onChange={(v) => handleChange('r', v)}
                min={0} max={0.2} step={0.001}
                suffix=""
            />
            <InputField
                label="Volatility (σ)"
                value={inputs.sigma}
                onChange={(v) => handleChange('sigma', v)}
                min={0.01} max={1.5} step={0.01}
                suffix=""
            />
        </div>
    );
}
