import React from 'react';

const ValueRow = ({ label, callVal, putVal, format = (v) => v.toFixed(4) }) => (
    <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100 last:border-0 text-sm">
        <div className="font-medium text-gray-600">{label}</div>
        <div className={`text-right ${callVal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {format(callVal)}
        </div>
        <div className={`text-right ${putVal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {format(putVal)}
        </div>
    </div>
);

export default function ResultCard({ callPrice, putPrice, callGreeks, putGreeks, mode, impliedVol }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Results</h2>

            {mode === 'iv' ? (
                <div className="bg-yellow-50 p-6 rounded-lg text-center mb-6 border border-yellow-200">
                    <div className="text-sm text-yellow-800 font-semibold mb-2">Implied Volatility (IV)</div>
                    <div className="text-3xl font-bold text-gray-900">
                        {(impliedVol * 100).toFixed(2)}%
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Volatility required to match market price
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-sm text-blue-600 font-semibold mb-1">Call Price</div>
                        <div className="text-2xl font-bold text-gray-800">${callPrice.toFixed(2)}</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg text-center">
                        <div className="text-sm text-red-600 font-semibold mb-1">Put Price</div>
                        <div className="text-2xl font-bold text-gray-800">${putPrice.toFixed(2)}</div>
                    </div>
                </div>
            )}

            <div className="mt-4">
                <div className="grid grid-cols-3 gap-2 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div>Greek</div>
                    <div className="text-right">Call</div>
                    <div className="text-right">Put</div>
                </div>

                <ValueRow label="Delta (Δ)" callVal={callGreeks.delta} putVal={putGreeks.delta} />
                <ValueRow label="Gamma (Γ)" callVal={callGreeks.gamma} putVal={putGreeks.gamma} />
                <ValueRow label="Vega (ν)" callVal={callGreeks.vega} putVal={putGreeks.vega} />
                <ValueRow label="Theta (Θ)" callVal={callGreeks.theta} putVal={putGreeks.theta} />
                <ValueRow label="Rho (ρ)" callVal={callGreeks.rho} putVal={putGreeks.rho} />
            </div>
        </div>
    );
}
