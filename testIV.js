import { calculateOptionPrice } from './src/utils/blackScholes.js';
import { calculateImpliedVolatility } from './src/utils/impliedVolatility.js';

const runIVTests = () => {
    console.log("Running Implied Volatility Tests...\n");

    const S = 100;
    const K = 100;
    const T = 1;
    const r = 0.05;
    const targetSigma = 0.3; // We want to recover this value

    console.log(`Target Sigma: ${targetSigma}`);

    // 1. Calculate theoretical price with targetSigma
    const callPrice = calculateOptionPrice(S, K, T, r, targetSigma, 'call');
    console.log(`Theoretical Call Price: ${callPrice.toFixed(4)}`);

    // 2. Reverse calculate sigma using the price
    const calculatedIV = calculateImpliedVolatility(callPrice, S, K, T, r, 'call');
    console.log(`Calculated IV: ${calculatedIV.toFixed(4)}`);

    // 3. Verify
    const error = Math.abs(calculatedIV - targetSigma);
    console.log(`Error: ${error.toFixed(6)}`);

    if (error < 0.001) {
        console.log("✅ IV Calculation Verified (Newton-Raphson works)");
    } else {
        console.error("❌ IV Calculation Failed");
    }

    // Test Case 2: Different parameters
    const S2 = 120;
    const callPrice2 = calculateOptionPrice(S2, K, T, r, 0.2, 'call');
    const iv2 = calculateImpliedVolatility(callPrice2, S2, K, T, r, 'call');
    console.log(`\nTest Case 2 (ITM): Target=0.2, Calc=${iv2.toFixed(4)}`);
    if (Math.abs(iv2 - 0.2) < 0.001) console.log("✅ Verified"); else console.error("❌ Failed");

};

runIVTests();
