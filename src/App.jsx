import { useState, useMemo } from 'react';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import PnLChart from './components/PnLChart';
import { calculateOptionPrice, calculateGreeks } from './utils/blackScholes';
import './index.css';

function App() {
  const [inputs, setInputs] = useState({
    S: 100,
    K: 100,
    T: 1,
    r: 0.05,
    sigma: 0.2
  });

  const results = useMemo(() => {
    const { S, K, T, r, sigma } = inputs;
    return {
      callPrice: calculateOptionPrice(S, K, T, r, sigma, 'call'),
      putPrice: calculateOptionPrice(S, K, T, r, sigma, 'put'),
      callGreeks: calculateGreeks(S, K, T, r, sigma, 'call'),
      putGreeks: calculateGreeks(S, K, T, r, sigma, 'put')
    };
  }, [inputs]);

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
            <InputForm inputs={inputs} setInputs={setInputs} />
          </div>
          <div className="w-full text-left">
            <ResultCard
              callPrice={results.callPrice}
              putPrice={results.putPrice}
              callGreeks={results.callGreeks}
              putGreeks={results.putGreeks}
            />
          </div>
        </main>

        <div className="w-full">
          <PnLChart
            S={inputs.S}
            K={inputs.K}
            T={inputs.T}
            r={inputs.r}
            sigma={inputs.sigma}
            callPrice={results.callPrice}
            putPrice={results.putPrice}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
