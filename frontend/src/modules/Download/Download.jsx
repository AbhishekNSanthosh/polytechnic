import React, { useState } from 'react'
import styles from './Download.module.css'
import axios from 'axios';
import { generatePdf } from './services/apis';
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'

const Download = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const accessType = localStorage.getItem("accessType");
  const authToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const toast = useToast();

  const handleDownloadPDF = async () => {
    // try {
    //   // Make a request to the API to download the CSV file
    //   const response = await axios.post(`http://localhost:9000/api/v2/admin/generate-pdf`, { startDate, endDate }, { responseType: 'blob', });

    //   const blob = new Blob([response.data], { type: 'text/csv' });

    //   // Create a download link and trigger the download
    //   const link = document.createElement('a');
    //   link.href = window.URL.createObjectURL(blob);
    //   link.download = 'all_letters.csv';
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
    // } catch (error) {
    //   console.error(error);
    // }
    await generatePdf(startDate, endDate, authToken, navigate, toast)
  };

  const handleDownloadCSV = async () => {
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
      <div className={styles.wrap}>
        <div className={styles.downloadRow}>
          <span className={styles.title}>Download Grievances</span>
        </div>
        <div className={styles.downloadWrap}>
          <div className={styles.downloadRow}>
            <span className={styles.info}>Please choose date range</span>
          </div>
          <div className={styles.downloadItemRow}>
            <div className={styles.left}>
              <label>Start Date: </label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className={styles.right}>
              <label>End Date: </label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className={styles.downloadItemRow}>
            <div className={styles.left}>
              <button className={styles.download} onClick={handleDownloadCSV}>Generate CSV</button>
            </div>
            <div className={styles.left}>
              <button className={styles.download} onClick={handleDownloadPDF}>Generate PDF</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Download