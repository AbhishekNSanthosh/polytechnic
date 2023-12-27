import React, { useState } from 'react'
import styles from './Download.module.css'
import axios from 'axios';

const Download = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDownloadPDF = async () => {
    try {
      // Make a request to the API to download the CSV file
      const response = await axios.post(`http://localhost:9000/api/v2/admin/generate-pdf`, { startDate, endDate }, { responseType: 'blob', });

      const blob = new Blob([response.data], { type: 'text/csv' });

      // Create a download link and trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'all_letters.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async () => {
    try {
      // Make a request to the API to generate and download the PDF file
      const response = await axios.post('http://localhost:9000/api/v2/admin/generate', { startDate, endDate }, {
        responseType: 'blob', // Specify response type as blob
      });

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a link element and trigger a download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'letters.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <label>Start Date: </label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <label>End Date: </label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        <button onClick={handleDownload}>Download PDF</button>
      </div>

    </div>
  )
}

export default Download