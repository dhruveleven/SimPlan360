document.getElementById('profile-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const inputs = {};
  for (let [key, value] of formData.entries()) {
    inputs[key] = parseFloat(value);
  }

  // 🧠 Run Monte Carlo Simulation
  const results = runMonteCarloSimulation(inputs);
  const { p10, p50, p90 } = getPercentiles(results);

  // 📈 Render Result Output
  document.getElementById('output').innerHTML = `
    <h2>📊 Monte Carlo Simulation Result</h2>
    <p>Pessimistic (P10): ₹<b>${p10.toLocaleString()}</b></p>
    <p>Median (P50): ₹<b>${p50.toLocaleString()}</b></p>
    <p>Optimistic (P90): ₹<b>${p90.toLocaleString()}</b></p>
    <canvas id="savingsChart" height="60"></canvas>
  `;

  const ctx = document.getElementById('savingsChart').getContext('2d');
  if (window.chartInstance) window.chartInstance.destroy();

  window.chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['P10 (Worst)', 'P50 (Median)', 'P90 (Best)'],
      datasets: [{
        label: 'Projected Retirement Savings (₹)',
        data: [p10, p50, p90],
        backgroundColor: ['#dc3545', '#ffc107', '#28a745']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Percentile Savings at Retirement'
        }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
});
