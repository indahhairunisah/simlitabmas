// Print functionality
document.getElementById('printBtn').addEventListener('click', function() {
    window.print();
  });
  
  // Export to Excel functionality
  document.getElementById('exportExcelBtn').addEventListener('click', function() {
    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ["Suhu Optimal", "Sensor 1", "Sensor 2", "Sensor 3", "Sensor 4", "Sensor 5", "Sensor 6", "Sensor 7"],
      // Example data
      ["25°C", "30°C", "28°C", "27°C", "29°C", "31°C", "26°C", "24°C"]
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  
    // Export the workbook
    XLSX.writeFile(wb, 'HistoriData.xlsx');
  });
  