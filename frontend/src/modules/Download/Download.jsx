import React, { useState } from 'react'
import styles from './Download.module.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { adminApi, backendApiUrl } from '../../utils/helpers';
import { useEffect } from 'react';

const Download = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const accessType = localStorage.getItem("accessType");
  const authToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const toast = useToast();

  const handleDownloadCSV = async () => {
    try {
      const response = await axios.post(backendApiUrl + adminApi.adminGenerateCSV, {
        startDate,
        endDate
      },
        {
          headers: {
            Authorization: "Bearer " + authToken
          }
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
      console.log(error);
      toast({
        title: error?.response?.data?.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      if (error?.response?.data?.error === "TokenExpiredError") {
        toast({
          title: 'Session Expired',
          description: "Redirecting to Login page",
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        localStorage.clear();
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.post(
        'http://localhost:9000' + adminApi.adminGeneratePDF,
        { startDate, endDate },
        {
          headers: {
            Authorization: "Bearer " + authToken,
          },
          responseType: 'blob',
        }
      );

      console.log(response)
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

        if (jsonData.error === "TokenExpiredError") {
          toast({
            title: 'Session Expired',
            description: "Redirecting to Login page",
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          localStorage.clear();
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          toast({
            title: jsonData.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
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