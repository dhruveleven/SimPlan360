function simulate(data) {
  const years = data.retirement_age - data.age;
  let income = data.income;
  const annualExpenses = data.expenses * 12;
  const raise = (data.raise || 0) / 100;
  const marketGrowth = (data.market_growth || 5) / 100;
  const inflation = (data.inflation || 6) / 100;
  const risk = data.risk || 5; // scale 1–10
  const debt = data.debt || 0;
  const shock = data.shock || 0;

  let savings = -debt; // initial net worth after deducting debt
  const savingsData = [];

  for (let i = 0; i <= years; i++) {
    // Adjust growth for risk and shock
    const volatilityFactor = 1 + (risk - 5) * 0.02 - shock * 0.1;
    const adjustedGrowth = marketGrowth * volatilityFactor;

    // Real growth rate
    const realGrowth = (1 + adjustedGrowth) / (1 + inflation) - 1;

    const annualSavings = income - annualExpenses;
    savings += annualSavings * Math.pow(1 + realGrowth, i);
    savingsData.push(Math.round(savings));
    income *= (1 + raise);
  }

  return savingsData;
}

function getFormData(form) {
  const formData = new FormData(form);
  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = parseFloat(value);
  }
  return data;
}

document.getElementById('compare-btn').addEventListener('click', () => {
  const formA = document.getElementById('form-a');
  const formB = document.getElementById('form-b');
  const dataA = getFormData(formA);
  const dataB = getFormData(formB);

  const savingsA = simulate(dataA);
  const savingsB = simulate(dataB);
  const labels = Array.from({ length: dataA.retirement_age - dataA.age + 1 }, (_, i) => dataA.age + i);

  const ctx = document.getElementById('comparisonChart').getContext('2d');
  if (window.chartInstance) window.chartInstance.destroy();

  window.chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Scenario A',
          data: savingsA,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0,123,255,0.2)',
          fill: true,
          tension: 0.2
        },
        {
          label: 'Scenario B',
          data: savingsB,
          borderColor: '#28a745',
          backgroundColor: 'rgba(40,167,69,0.2)',
          fill: true,
          tension: 0.2
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // Show Summary
  const finalA = savingsA[savingsA.length - 1];
  const finalB = savingsB[savingsB.length - 1];
  const diff = Math.abs(finalA - finalB);
  const better = finalA > finalB ? 'Scenario A' : 'Scenario B';

  document.getElementById('summary').innerHTML = `
    <h3>💡 Summary</h3>
    <p>Scenario A Total: ₹${finalA.toLocaleString()}</p>
    <p>Scenario B Total: ₹${finalB.toLocaleString()}</p>
    <p><b>${better}</b> performs better by ₹${diff.toLocaleString()}</p>
  `;
});
