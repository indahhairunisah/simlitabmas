async function fetchData(startDate, endDate) {
  const baseUrl = 'https://api.thingspeak.com/channels/2588909/feeds.json?results=2';
  const results = 1000;
  let url = `${baseUrl}?results=${results}`;

  if (startDate && endDate) {
    // Format date as ISO string
    const startISO = new Date(startDate).toISOString();
    const endISO = new Date(endDate).toISOString();
    url += `&start=${startISO}&end=${endISO}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.feeds;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

async function updateInfoBoxes() {
  const data = await fetchData(); // Ambil data terbaru
  if (data && data.length > 0) {
    const latestFeed = data[0];
    document.getElementById('time1').textContent = new Date(latestFeed.created_at).toLocaleString(); // Update waktu
    document.getElementById('suhu1').textContent = `${(parseFloat(latestFeed.field1) || 0).toFixed(2)} °C`; // Sensor 1
    document.getElementById('suhu2').textContent = `${(parseFloat(latestFeed.field2) || 0).toFixed(2)} °C`; // Sensor 2
    document.getElementById('suhu3').textContent = `${(parseFloat(latestFeed.field3) || 0).toFixed(2)} °C`; // Sensor 3
    document.getElementById('suhu4').textContent = `${(parseFloat(latestFeed.field4) || 0).toFixed(2)} °C`; // Sensor 4
    document.getElementById('suhu5').textContent = `${(parseFloat(latestFeed.field5) || 0).toFixed(2)} °C`; // Sensor 5
    document.getElementById('suhu6').textContent = `${(parseFloat(latestFeed.field6) || 0).toFixed(2)} °C`; // Sensor 6
    document.getElementById('suhu7').textContent = `${(parseFloat(latestFeed.field7) || 0).toFixed(2)} °C`; // Sensor 7
  }
}

async function updateCharts(startDate, endDate) {
  const data = await fetchData(startDate, endDate);
  if (data) {
    const suhuData = data.map((feed) => parseFloat(feed.field1).toFixed(2));
    const sensor1Data = data.map((feed) => parseFloat(feed.field2).toFixed(2));
    const sensor2Data = data.map((feed) => parseFloat(feed.field3).toFixed(2));
    const sensor3Data = data.map((feed) => parseFloat(feed.field4).toFixed(2));
    const sensor4Data = data.map((feed) => parseFloat(feed.field5).toFixed(2));
    const sensor5Data = data.map((feed) => parseFloat(feed.field6).toFixed(2));
    const sensor6Data = data.map((feed) => parseFloat(feed.field7).toFixed(2));
    const sensor7Data = data.map((feed) => parseFloat(feed.field8).toFixed(2));
    const labels = data.map((feed) => new Date(feed.created_at).toLocaleString());

    // Update chart data
    suhuOptimalChart.data = { labels, datasets: [{ label: 'Suhu Optimal', data: suhuData, borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] };
    lineChart1.data = { labels, datasets: [{ label: 'Sensor 1', data: sensor1Data, borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] };
    lineChart2.data = { labels, datasets: [{ label: 'Sensor 2', data: sensor2Data, borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] };
    lineChart3.data = { labels, datasets: [{ label: 'Sensor 3', data: sensor3Data, borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] };
    lineChart4.data = { labels, datasets: [{ label: 'Sensor 4', data: sensor4Data, borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] };
    lineChart5.data = { labels, datasets: [{ label: 'Sensor 5', data: sensor5Data, borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] };
    lineChart6.data = { labels, datasets: [{ label: 'Sensor 6', data: sensor6Data, borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] };
    lineChart7.data = { labels, datasets: [{ label: 'Sensor 7', data: sensor7Data, borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }] };

    // Update charts
    suhuOptimalChart.update();
    lineChart1.update();
    lineChart2.update();
    lineChart3.update();
    lineChart4.update();
    lineChart5.update();
    lineChart6.update();
    lineChart7.update();
  }
}

// Update info boxes and charts when the page loads
window.onload = () => {
  updateInfoBoxes();
  updateCharts(); // Ensure charts are updated as well
};

// Event listener for filter button
document.getElementById('filterBtn').addEventListener('click', () => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  updateCharts(startDate, endDate);
});

// Print functionality
document.getElementById('printBtn').addEventListener('click', () => {
  window.print();
});

// Export to Excel functionality
document.getElementById('exportExcelBtn').addEventListener('click', async () => {
  const data = await fetchData(); // Optionally pass startDate and endDate here if needed
  if (data) {
    const ws = XLSX.utils.json_to_sheet(
      data.map((feed) => ({
        Suhu_Optimal: (parseFloat(feed.field1) || 0).toFixed(2),
        Sensor_1: (parseFloat(feed.field2) || 0).toFixed(2),
        Sensor_2: (parseFloat(feed.field3) || 0).toFixed(2),
        Sensor_3: (parseFloat(feed.field4) || 0).toFixed(2),
        Sensor_4: (parseFloat(feed.field5) || 0).toFixed(2),
        Sensor_5: (parseFloat(feed.field6) || 0).toFixed(2),
        Sensor_6: (parseFloat(feed.field7) || 0).toFixed(2),
        Sensor_7: (parseFloat(feed.field8) || 0).toFixed(2),
        Created_At: feed.created_at,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, 'data.xlsx');
  }
});
