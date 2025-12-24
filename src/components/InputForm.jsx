import React from 'react';

const InputField = ({ label, value, onChange, min, max, step, suffix, disabled = false }) => (
    <div className={`mb-4 ${disabled ? 'opacity-50' : ''}`}>
        <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value))}
                    className="w-20 p-1 text-right text-sm border rounded focus:ring-blue-500 focus:border-blue-500"
                    step={step}
                    disabled={disabled}
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
            disabled={disabled}
        />
    </div>
);

export default function InputForm({ inputs, setInputs, mode, setMode, marketPrice, setMarketPrice }) {
    const handleChange = (key, value) => {
        setInputs(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">Parameters</h2>

                {/* Mode Toggle */}
                <div className="bg-gray-100 p-1 rounded-lg flex text-xs font-semibold">
                    <button
                        className={`px-3 py-1 rounded-md transition-colors ${mode === 'pricing' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                        onClick={() => setMode('pricing')}
                    >
                        Pricing
                    </button>
                    <button
                        className={`px-3 py-1 rounded-md transition-colors ${mode === 'iv' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                        onClick={() => setMode('iv')}
                    >
                        Find IV
                    </button>
                </div>
            </div>

            {mode === 'iv' && (
                <div className="mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <label className="block text-sm font-medium text-yellow-800 mb-1">Target Option Price</label>
                    <input
                        type="number"
                        value={marketPrice}
                        onChange={(e) => setMarketPrice(parseFloat(e.target.value))}
                        className="w-full p-2 border border-yellow-300 rounded focus:ring-yellow-500 focus:border-yellow-500"
                        step="0.01"
                    />
                </div>
            )}

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

            {/* Volatility Input - Disabled or Hidden in IV Mode */}
            {mode === 'pricing' ? (
                <InputField
                    label="Volatility (σ)"
                    value={inputs.sigma}
                    onChange={(v) => handleChange('sigma', v)}
                    min={0.01} max={1.5} step={0.01}
                    suffix=""
                />
            ) : (
                <div className="mb-4 opacity-50">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-gray-700">Volatility (σ)</label>
                        <span className="text-xs text-blue-600 font-bold">Calculating...</span>
                    </div>
                    <div className="w-full h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
                        Auto-calculated from Price
                    </div>
                </div>
            )}
        </div>
    );
}
