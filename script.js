document.getElementById('profile-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(this);
  const data = {};

  for (let [key, value] of formData.entries()) {
    data[key] = isNaN(value) || value.trim() === "" ? value : parseFloat(value);
  }

  // Basic simulation logic
  const years = data.retirement_age - data.age;
  const annualIncome = data.income;
  const annualExpenses = data.expenses * 12;
  const annualSavings = annualIncome - annualExpenses;
  const raise = (data.raise || 0) / 100;
  const growthRate = (data.market_growth || 5) / 100;
  const inflation = (data.inflation || 6) / 100;


  let savings = 0;
  const yearLabels = [];
  const savingsData = [];

  for (let i = 0; i <= years; i++) {
    let realGrowth = (1 + growthRate) / (1 + inflation) - 1;
    savings += annualSavings * Math.pow(1 + realGrowth, i);
    savingsData.push(Math.round(savings));
    yearLabels.push(Number(data.age) + i);
  }
  
  document.getElementById('output').innerHTML = `
  <h2>📈 Simulation Result</h2>
  <p>Estimated total savings by retirement: ₹<b>${savingsData[savingsData.length - 1].toLocaleString()}</b></p>
  <canvas id="savingsChart" width="100%" height="50"></canvas>
`;


  // Render Chart
  const ctx = document.getElementById('savingsChart').getContext('2d');
  if (window.savingsChartInstance) window.savingsChartInstance.destroy(); // Avoid multiple charts
  window.savingsChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: yearLabels,
      datasets: [{
        label: 'Projected Savings (₹)',
        data: savingsData,
        fill: true,
        backgroundColor: 'rgba(0,123,255,0.2)',
        borderColor: '#007bff',
        tension: 0.2,
      }]
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
});
