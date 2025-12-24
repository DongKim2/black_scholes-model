import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { calculateOptionPrice } from '../utils/blackScholes';

export default function PnLChart({ S, K, T, r, sigma, callPrice, putPrice }) {
    const data = useMemo(() => {
        const range = 0.4; // +/- 40%
        const minS = Math.floor(S * (1 - range));
        const maxS = Math.ceil(S * (1 + range));
        const step = (maxS - minS) / 50;

        const points = [];
        for (let currentS = minS; currentS <= maxS; currentS += step) {
            // Expiration Payoffs (Intrinsic Value)
            const callPayoff = Math.max(0, currentS - K) - callPrice;
            const putPayoff = Math.max(0, K - currentS) - putPrice;

            // Current Theoretical P&L (if we sold/bought now vs entry price)
            // Assuming 'entry price' is the calculated callPrice/putPrice at S
            // Actually, P&L graph usually assumes we bought the option at 'callPrice' (calculated at S)
            // and we want to see P&L if spot moves to 'currentS' TODAY (T remains same) or at Expiration (T=0).

            // Let's show:
            // 1. Expiration P&L (T=0)

            points.push({
                stockPrice: Math.round(currentS),
                CallPnL: parseFloat(callPayoff.toFixed(2)),
                PutPnL: parseFloat(putPayoff.toFixed(2)),
            });
        }
        return points;
    }, [S, K, T, r, sigma, callPrice, putPrice]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">P&L at Expiration</h2>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="stockPrice"
                            label={{ value: 'Stock Price', position: 'insideBottomRight', offset: 0 }}
                        />
                        <YAxis label={{ value: 'Profit / Loss', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <ReferenceLine y={0} stroke="#000" />
                        <ReferenceLine x={S} stroke="gray" strokeDasharray="3 3" label="Current S" />
                        <ReferenceLine x={K} stroke="purple" strokeDasharray="3 3" label="Strike K" />
                        <Line type="monotone" dataKey="CallPnL" stroke="#2563eb" strokeWidth={2} dot={false} name="Call P&L" />
                        <Line type="monotone" dataKey="PutPnL" stroke="#dc2626" strokeWidth={2} dot={false} name="Put P&L" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
                * Shows Profit/Loss at expiration assuming option was purchased at current calculated price.
            </p>
        </div>
    );
}
