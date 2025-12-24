import { useState, useMemo } from 'react';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import PnLChart from './components/PnLChart';
import { calculateOptionPrice, calculateGreeks } from './utils/blackScholes';
import { calculateImpliedVolatility } from './utils/impliedVolatility';
import './index.css';

function App() {
  const [mode, setMode] = useState('pricing'); // 'pricing' | 'iv'
  const [marketPrice, setMarketPrice] = useState(10); // Target price for IV calc

  const [inputs, setInputs] = useState({
    S: 100,
    K: 100,
    T: 1,
    r: 0.05,
    sigma: 0.2
  });

  const results = useMemo(() => {
    const { S, K, T, r, sigma } = inputs;

    // In IV mode, we use the calculated IV as the sigma for Greeks/PnL display
    let activeSigma = sigma;
    let impliedVol = 0;

    if (mode === 'iv') {
      // Calculate IV for Call (defaulting to Call for MVP simplicity, could add toggle)
      // Or we can assume the user wants the IV that explains the price for a 'Call' option specifically?
      // Let's calculate IV for Call as primary example.
      const calculatedIV = calculateImpliedVolatility(marketPrice, S, K, T, r, 'call');
      if (calculatedIV !== null) {
        activeSigma = calculatedIV;
        impliedVol = calculatedIV;
      }
    }

    return {
      callPrice: calculateOptionPrice(S, K, T, r, activeSigma, 'call'),
      putPrice: calculateOptionPrice(S, K, T, r, activeSigma, 'put'),
      callGreeks: calculateGreeks(S, K, T, r, activeSigma, 'call'),
      putGreeks: calculateGreeks(S, K, T, r, activeSigma, 'put'),
      impliedVol: impliedVol,
      activeSigma: activeSigma
    };
  }, [inputs, mode, marketPrice]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Black-Scholes Calculator
          </h1>
          <p className="text-gray-600">
            Real-time European Option Pricing & Greeks Analysis
          </p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
          <div className="w-full text-left">
            <InputForm
              inputs={inputs}
              setInputs={setInputs}
              mode={mode}
              setMode={setMode}
              marketPrice={marketPrice}
              setMarketPrice={setMarketPrice}
            />
          </div>
          <div className="w-full text-left">
            <ResultCard
              callPrice={results.callPrice}
              putPrice={results.putPrice}
              callGreeks={results.callGreeks}
              putGreeks={results.putGreeks}
              mode={mode}
              impliedVol={results.impliedVol}
            />
          </div>
        </main>

        <div className="w-full">
          <PnLChart
            S={inputs.S}
            K={inputs.K}
            T={inputs.T}
            r={inputs.r}
            sigma={results.activeSigma}
            callPrice={results.callPrice}
            putPrice={results.putPrice}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
