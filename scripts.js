async function fetchData() {
  const url = 'https://api.thingspeak.com/channels/2588909/feeds.json?results=1'; // Mendapatkan 1 hasil terbaru
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.feeds[0]; // Mengambil data feed terbaru
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

async function updateInfoBoxes() {
  const data = await fetchData();
  if (data) {
    // Update the values in the HTML elements
    document.getElementById('time1').textContent = new Date(data.created_at).toLocaleString(); // Update waktu
    document.getElementById('suhu1').textContent = `${data.field1 || 'N/A'} °C`; // Sensor 1
    document.getElementById('suhu2').textContent = `${data.field2 || 'N/A'} °C`; // Sensor 2
    document.getElementById('suhu3').textContent = `${data.field3 || 'N/A'} °C`; // Sensor 3
    document.getElementById('suhu4').textContent = `${data.field4 || 'N/A'} °C`; // Sensor 4
    document.getElementById('suhu5').textContent = `${data.field5 || 'N/A'} °C`; // Sensor 5
    document.getElementById('suhu6').textContent = `${data.field6 || 'N/A'} °C`; // Sensor 6
    document.getElementById('suhu7').textContent = `${data.field7 || 'N/A'} °C`; // Sensor 7
  }
}

// Update info boxes when the page loads
window.onload = updateInfoBoxes;


// Update info boxes when the page loads
window.onload = () => {
  updateInfoBoxes();
  updateCharts(); // Ensure charts are updated as well
};


// Chart.js configurations
const suhuOptimalCtx = document.getElementById('suhuOptimal').getContext('2d');
const lineChart1Ctx = document.getElementById('lineChart1').getContext('2d');
const lineChart2Ctx = document.getElementById('lineChart2').getContext('2d');
const lineChart3Ctx = document.getElementById('lineChart3').getContext('2d');
const lineChart4Ctx = document.getElementById('lineChart4').getContext('2d');
const lineChart5Ctx = document.getElementById('lineChart5').getContext('2d');
const lineChart6Ctx = document.getElementById('lineChart6').getContext('2d');
const lineChart7Ctx = document.getElementById('lineChart7').getContext('2d');

let suhuOptimalChart = new Chart(suhuOptimalCtx, { type: 'line', data: {}, options: {} });
let lineChart1 = new Chart(lineChart1Ctx, { type: 'line', data: {}, options: {} });
let lineChart2 = new Chart(lineChart2Ctx, { type: 'line', data: {}, options: {} });
let lineChart3 = new Chart(lineChart3Ctx, { type: 'line', data: {}, options: {} });
let lineChart4 = new Chart(lineChart4Ctx, { type: 'line', data: {}, options: {} });
let lineChart5 = new Chart(lineChart5Ctx, { type: 'line', data: {}, options: {} });
let lineChart6 = new Chart(lineChart6Ctx, { type: 'line', data: {}, options: {} });
let lineChart7 = new Chart(lineChart7Ctx, { type: 'line', data: {}, options: {} });

// Function to fetch data from ThingSpeak
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


// Function to update the charts with fetched data
async function updateCharts(startDate, endDate) {
  const data = await fetchData(startDate, endDate);
  if (data) {
    const suhuData = data.map(feed => parseFloat(feed.field1));
    const sensor1Data = data.map(feed => parseFloat(feed.field2));
    const sensor2Data = data.map(feed => parseFloat(feed.field3));
    const sensor3Data = data.map(feed => parseFloat(feed.field4));
    const sensor4Data = data.map(feed => parseFloat(feed.field5));
    const sensor5Data = data.map(feed => parseFloat(feed.field6));
    const sensor6Data = data.map(feed => parseFloat(feed.field7));
    const sensor7Data = data.map(feed => parseFloat(feed.field8));
    const labels = data.map(feed => new Date(feed.created_at).toLocaleString());

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

document.getElementById('filterBtn').addEventListener('click', () => {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  updateCharts(startDate, endDate);
});

// Update the charts when the page loads
window.onload = updateCharts;


// Print functionality
document.getElementById('printBtn').addEventListener('click', () => {
  window.print();
});

// Export to Excel functionality
document.getElementById('exportExcelBtn').addEventListener('click', async () => {
  const data = await fetchData();  // Optionally pass startDate and endDate here if needed
  if (data) {
    const ws = XLSX.utils.json_to_sheet(data.map(feed => ({
      Suhu_Optimal: feed.field1,
      Sensor_1: feed.field2,
      Sensor_2: feed.field3,
      Sensor_3: feed.field4,
      Sensor_4: feed.field5,
      Sensor_5: feed.field6,
      Sensor_6: feed.field7,
      Sensor_7: feed.field8,
      Created_At: feed.created_at
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, 'data.xlsx');
  }
});



