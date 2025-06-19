// Monte Carlo Simulation Engine

/**
 * Runs a Monte Carlo simulation for retirement savings.
 * @param {Object} inputs - User financial data
 * @param {number} simulations - Number of simulation runs (default 1000)
 * @returns {Array} - Array of final savings values from all simulations
 */
function runMonteCarloSimulation(inputs, simulations = 1000) {
  const {
    age,
    retirement_age,
    income,
    expenses,
    raise = 0,
    inflation = 6,
    market_growth = 8,
    risk = 5,
    debt = 0,
    shock = 0
  } = inputs;

  const years = retirement_age - age;
  const annualExpenses = expenses * 12;
  const raiseRate = raise / 100;
  const inflationAvg = inflation / 100;
  const marketAvg = market_growth / 100;
  const volatility = 0.15 - (risk / 100); // Lower risk = lower volatility
  const shockFactor = shock * 0.2; // Increases worst-case dips

  const finalSavingsArray = [];

  for (let sim = 0; sim < simulations; sim++) {
    let salary = income;
    let savings = -debt;

    for (let year = 0; year <= years; year++) {
      // Randomize market growth with normal distribution approximation
      const marketReturn = randomNormal(marketAvg, volatility) - shockFactor;
      const inflationRate = randomNormal(inflationAvg, 0.01); // small inflation variation

      const realGrowth = (1 + marketReturn) / (1 + inflationRate) - 1;
      const yearlySavings = salary - annualExpenses;

      savings += yearlySavings * Math.pow(1 + realGrowth, year);
      salary *= 1 + raiseRate;
    }

    finalSavingsArray.push(Math.round(savings));
  }

  return finalSavingsArray;
}

// Approximate normal distribution using Box-Muller Transform
function randomNormal(mean = 0, stdDev = 1) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // avoid 0
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdDev + mean;
}

/**
 * Calculates P10, P50, P90 percentiles from simulation output.
 * @param {Array} data - Array of final savings from all simulations
 */
function getPercentiles(data) {
  const sorted = [...data].sort((a, b) => a - b);
  const get = (p) => sorted[Math.floor(p * sorted.length)];
  return {
    p10: get(0.1),
    p50: get(0.5),
    p90: get(0.9)
  };
}
