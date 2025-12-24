/**
 * Standard Normal Probability Density Function (PDF)
 * @param {number} x
 * @returns {number}
 */
export const stdNormalPDF = (x) => {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
};

/**
 * Standard Normal Cumulative Distribution Function (CDF)
 * Uses Abramowitz and Stegun approximation (1964)
 * @param {number} x
 * @returns {number}
 */
export const stdNormalCDF = (x) => {
    if (x < 0) return 1 - stdNormalCDF(-x);

    const b1 = 0.319381530;
    const b2 = -0.356563782;
    const b3 = 1.781477937;
    const b4 = -1.821255978;
    const b5 = 1.330274429;
    const p = 0.2316419;
    const c = 0.39894228;

    const t = 1 / (1 + p * x);
    const z = ((((b5 * t + b4) * t + b3) * t + b2) * t + b1) * t;

    return 1 - c * Math.exp(-x * x / 2) * z;
};
