import { calculateOptionPrice, calculateGreeks } from './blackScholes.js';

/**
 * Calculate Implied Volatility using Newton-Raphson Method
 * 
 * @param {number} marketPrice - Observation option price from market
 * @param {number} S - Current Stock Price
 * @param {number} K - Strike Price
 * @param {number} T - Time to Maturity (in years)
 * @param {number} r - Risk-free Interest Rate (decimal)
 * @param {'call'|'put'} type - Option Type
 * @returns {number|null} Implied Volatility (decimal) or null if failed to converge
 */
export const calculateImpliedVolatility = (marketPrice, S, K, T, r, type = 'call') => {
    // Basic boundary checks
    const intrinsicValue = type === 'call' ? Math.max(0, S - K) : Math.max(0, K - S);
    if (marketPrice <= intrinsicValue) {
        // Price must be greater than intrinsic value for time value to exist
        // If equal, vol is effectively 0 (or undefined/very low)
        return 0;
    }

    const MAX_ITERATIONS = 100;
    const TOLERANCE = 1e-5;

    // Initial guess
    // A simple approximation: sigma ~ 0.5 is a reasonable starting point for many cases
    // Or we could use Brenner-Subrahmanyam approximation for ATM options, but 0.5 is robust enough with Newton-Raphson
    let sigma = 0.5;

    for (let i = 0; i < MAX_ITERATIONS; i++) {
        // 1. Calculate Price with current sigma
        const price = calculateOptionPrice(S, K, T, r, sigma, type);

        // 2. Calculate Vega (derivative of price w.r.t sigma)
        // Note: calculateGreeks returns vega divided by 100 usually for display.
        // We need raw vega here. 
        // Let's call calculateGreeks and multiply by 100, or better, re-calculate raw vega to be safe/efficient?
        // Re-using calculateGreeks is fine for MVP.
        const greeks = calculateGreeks(S, K, T, r, sigma, type);
        const vega = greeks.vega * 100; // Restore raw vega (change in price per 1 unit change in sigma, e.g. 0.20 -> 1.20)
        // Wait, calculateGreeks implementation: vega = S * pdfD1 * sqrtT / 100;
        // The standard definition: dV/dSigma = S * pdf(d1) * sqrt(T)
        // My calculateGreeks divides by 100 to show "sensitivity per 1% vol change".
        // Newton-Raphson requires f'(x). Here f(sigma) = BSM(sigma) - MarketPrice.
        // f'(sigma) = partial BSM / partial sigma = Vega (raw).
        // So yes, we need standard Vega = S * pdf * sqrt(T).
        // If calcGreeks returns (S*pdf*sqrt(T))/100, then we multiply by 100 to get raw Vega.

        const diff = price - marketPrice;

        if (Math.abs(diff) < TOLERANCE) {
            return sigma;
        }

        if (Math.abs(vega) < 1e-8) {
            // Vega too small, might be deep ITM/OTM, Newton method unstable
            // Could fallback to bisection, but for MVP return null or current best guess
            break;
        }

        sigma = sigma - diff / vega;

        // Sanity check for sigma
        if (sigma <= 0) sigma = 1e-5; // Prevent negative volatility
        if (sigma > 5) sigma = 5; // Cap at 500% to avoid explosion
    }

    return sigma; // Return best guess if max iterations reached
};
