import { calculateOptionPrice, calculateGreeks } from './src/utils/blackScholes.js';

const runTests = () => {
    console.log("Running Black-Scholes Logic Tests...\n");

    const S = 100;
    const K = 100;
    const T = 1;
    const r = 0.05;
    const sigma = 0.2;

    console.log(`Parameters: S=${S}, K=${K}, T=${T}, r=${r}, sigma=${sigma}`);

    // Test Prices
    const callPrice = calculateOptionPrice(S, K, T, r, sigma, 'call');
    const putPrice = calculateOptionPrice(S, K, T, r, sigma, 'put');

    console.log(`Call Price: ${callPrice.toFixed(4)}`);
    console.log(`Put Price: ${putPrice.toFixed(4)}`);

    // Verify Put-Call Parity: C - P = S - K * exp(-rT)
    const lhs = callPrice - putPrice;
    const rhs = S - K * Math.exp(-r * T);
    const diff = Math.abs(lhs - rhs);

    console.log(`Put-Call Parity Diff: ${diff.toFixed(6)}`);
    if (diff < 0.0001) {
        console.log("✅ Put-Call Parity Verified");
    } else {
        console.error("❌ Put-Call Parity Failed");
    }

    // Test Greeks
    const callGreeks = calculateGreeks(S, K, T, r, sigma, 'call');
    console.log("\nCall Greeks:");
    console.table(callGreeks);

    const putGreeks = calculateGreeks(S, K, T, r, sigma, 'put');
    console.log("Put Greeks:");
    console.table(putGreeks);

    // Sanity Checks
    // Delta of ATM call should be approx 0.5 + small amount (due to r)
    // Put Delta should be Call Delta - 1
    if (Math.abs(callGreeks.delta - (putGreeks.delta + 1)) < 0.0001) {
        console.log("✅ Delta Logic Verified (Call Delta = Put Delta + 1)");
    } else {
        console.error("❌ Delta Logic Failed");
    }
};

runTests();
