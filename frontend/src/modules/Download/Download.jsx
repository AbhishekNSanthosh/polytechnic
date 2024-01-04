import React, { useState } from 'react'
import styles from './Download.module.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { adminApi, backendApiUrl } from '../../utils/helpers';
import { useEffect } from 'react';
import { privateGateway } from '../../services/apiGateWays';

const Download = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const accessType = localStorage.getItem("accessType");
  const authToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const toast = useToast();

  const handleDownloadCSV = async () => {
    try {
      const response = await privateGateway.post(adminApi.adminGenerateCSV, {
        startDate,
        endDate
      },
        {
          responseType: 'blob',
        });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Grievances.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: error?.response?.data?.message,
        description: error?.response?.data?.description,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await privateGateway.post(
        backendApiUrl + adminApi.adminGeneratePDF,
        { startDate, endDate },
        {
          responseType: 'blob',
        }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a link element and trigger a download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Grievances.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      const blob = new Blob([error.response.data], { type: 'application/json' });

      // Convert blob to text
      const reader = new FileReader();
      reader.onload = function () {
        const jsonData = JSON.parse(reader.result);
        toast({
          title: jsonData?.message,
          description: jsonData?.description,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      };
      reader.readAsText(blob);
    }
  };

  useEffect(() => {
    if (accessType !== "admin") {
      return null
    }
  }, [])

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
              <input className={styles.sdate} placeholder='DD/MM/YYYY' type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className={styles.right}>
              <label>End Date: </label>
              <input id="date" className={styles.edate} placeholder='DD/MM/YYYY' type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
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