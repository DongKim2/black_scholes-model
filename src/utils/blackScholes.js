import { stdNormalCDF, stdNormalPDF } from './normalDist.js';

/**
 * Calculate d1 and d2 parameters
 */
const calculateD1D2 = (S, K, T, r, sigma) => {
    const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    return { d1, d2 };
};

/**
 * Calculate Option Price
 * @param {number} S - Current Stock Price
 * @param {number} K - Strike Price
 * @param {number} T - Time to Maturity (in years)
 * @param {number} r - Risk-free Interest Rate (decimal)
 * @param {number} sigma - Volatility (decimal)
 * @param {'call'|'put'} type - Option Type
 * @returns {number} Price
 */
export const calculateOptionPrice = (S, K, T, r, sigma, type = 'call') => {
    if (T <= 0) {
        return type === 'call' ? Math.max(0, S - K) : Math.max(0, K - S);
    }

    const { d1, d2 } = calculateD1D2(S, K, T, r, sigma);

    if (type === 'call') {
        return S * stdNormalCDF(d1) - K * Math.exp(-r * T) * stdNormalCDF(d2);
    } else {
        return K * Math.exp(-r * T) * stdNormalCDF(-d2) - S * stdNormalCDF(-d1);
    }
};

/**
 * Calculate Greeks
 * @returns {object} { delta, gamma, vega, theta, rho }
 */
export const calculateGreeks = (S, K, T, r, sigma, type = 'call') => {
    if (T <= 0) return { delta: 0, gamma: 0, vega: 0, theta: 0, rho: 0 }; // Simplified

    const { d1, d2 } = calculateD1D2(S, K, T, r, sigma);
    const sqrtT = Math.sqrt(T);
    const expRT = Math.exp(-r * T);
    const pdfD1 = stdNormalPDF(d1);
    const cdfD1 = stdNormalCDF(d1);
    const cdfD2 = stdNormalCDF(d2);

    const cdfNegD2 = stdNormalCDF(-d2);

    let delta, theta, rho;

    // Gamma and Vega are the same for Call and Put
    const gamma = pdfD1 / (S * sigma * sqrtT);
    const vega = S * pdfD1 * sqrtT / 100; // Divided by 100 to show sensitivity per 1% vol change

    if (type === 'call') {
        delta = cdfD1;
        theta = (-S * pdfD1 * sigma / (2 * sqrtT) - r * K * expRT * cdfD2) / 365; // Per day
        rho = (K * T * expRT * cdfD2) / 100; // Per 1% rate change
    } else {
        delta = cdfD1 - 1;
        theta = (-S * pdfD1 * sigma / (2 * sqrtT) + r * K * expRT * cdfNegD2) / 365; // Per day
        rho = (-K * T * expRT * cdfNegD2) / 100; // Per 1% rate change
    }

    return { delta, gamma, vega, theta, rho };
};
