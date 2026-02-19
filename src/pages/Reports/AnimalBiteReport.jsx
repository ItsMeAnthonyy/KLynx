

import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ProfileDropdown from '../../components/ProfileDropdown';
import EmergencyButton from '../../components/EmergencyButton';
import { Bar, Line } from "react-chartjs-2";
import axios from 'axios';
import 'chart.js/auto';
import { BiDownload } from 'react-icons/bi';
import styles from './AnimalBiteReport.module.css';

// Generate Animal Bite PDF Report
import { generatePDF } from '/Utility/AB Report PDF';

// Dates Application
const currentYear = new Date().getFullYear();

const allMonths = Array.from({ length: 12 }, (_, i) => {
  const month = (i + 1).toString().padStart(2, '0');
  return `${currentYear}-${month}`;
});

function AnimalBiteReport() {
  // Mock data for demonstration
  const mockYearlyBites = {
    '2025-01': 45,
    '2025-02': 38,
    '2025-03': 52,
    '2025-04': 41,
    '2025-05': 47,
    '2025-06': 55,
    '2025-07': 62,
    '2025-08': 58,
    '2025-09': 49,
    '2025-10': 43,
    '2025-11': 0,
    '2025-12': 0,
  };

  const mockMonthlyAnimalData = [
    { animal_type: 'Dog', count: 28, new_cases: 5, under_treatment: 8, recovered: 18, deaths: 2 },
    { animal_type: 'Cat', count: 12, new_cases: 3, under_treatment: 4, recovered: 8, deaths: 0 },
    { animal_type: 'Rat', count: 8, new_cases: 2, under_treatment: 3, recovered: 5, deaths: 0 },
    { animal_type: 'Snake', count: 5, new_cases: 1, under_treatment: 2, recovered: 3, deaths: 0 },
    { animal_type: 'Monkey', count: 3, new_cases: 1, under_treatment: 1, recovered: 1, deaths: 0 },
  ];

  const mockMonthlyTrends = {
    'Dog': [5, 6, 8, 7, 9, 6, 7, 8, 9, 7, 0, 0],
    'Cat': [3, 4, 5, 5, 4, 3, 3, 5, 4, 4, 0, 0],
    'Rat': [1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 0, 0],
    'Other': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0]
  };

  const mockStats = {
    total: 490
  };

  // State for storing animal bite data
  const [animalBiteStats, setAnimalBiteStats] = useState(mockStats);
  const [monthlyAnimalData, setMonthlyAnimalData] = useState(mockMonthlyAnimalData);
  const [yearlyBites, setYearlyBites] = useState(mockYearlyBites);
  const [monthlyTrends, setMonthlyTrends] = useState(mockMonthlyTrends);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7); // YYYY-MM format
  });

  // Fetching Overall Animal Bite Statistics
  // useEffect(() => {
  //   const fetchAnimalBiteStats = async () => {
  //     try {
  //       const response = await axios.get('http://localhost/api/animal-bite-stats.php');
  //       setAnimalBiteStats(response.data);
  //     } catch (error) {
  //       console.error("Error fetching animal bite stats:", error);
  //       setMessage({ text: 'Error fetching animal bite statistics', type: 'error' });
  //       setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  //     }
  //   };

  //   fetchAnimalBiteStats();
  // }, []);

  // Fetching Animal Types for Selected Month
  // useEffect(() => {
  //   const fetchMonthlyAnimalData = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost/api/animal-types-month.php?month=${selectedMonth}`);
  //       setMonthlyAnimalData(response.data);
  //     } catch (error) {
  //       console.error("Error fetching monthly animal data:", error);
  //     }
  //   };

  //   if (selectedMonth) {
  //     fetchMonthlyAnimalData();
  //   }
  // }, [selectedMonth]);

  // Fetching Yearly Bite Counts by Month
  // useEffect(() => {
  //   const fetchYearlyBites = async () => {
  //     try {
  //       const response = await axios.get(`http://localhost/api/animal-bites-yearly.php?year=${currentYear}`);
  //       setYearlyBites(response.data);
  //     } catch (error) {
  //       console.error("Error fetching yearly bites:", error);
  //     }
  //   };

  //   fetchYearlyBites();
  // }, []);

  // Handle Overall Animal Bite Report Download
  const handleAnimalBite = async () => {
    try {
      if (Object.keys(yearlyBites).length === 0) {
        setMessage({ text: 'No yearly data available to download.', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        return;
      }

      // Prepare data for Overall Annual Report
      const rows = allMonths.map((monthKey, index) => {
        const date = new Date(`${monthKey}-01`);
        const monthLabel = date.toLocaleDateString("en-PH", {
          month: "long",
          year: "numeric"
        });
        return [
          index + 1,
          monthLabel,
          yearlyBites[monthKey] || 0
        ];
      });

      const headers = ['#', 'Month', 'Number of Bites'];

      generatePDF({
        title: 'Animal Bite Annual Report',
        monthYear: `${currentYear} Full Year`,
        tableHeaders: headers,
        tableData: rows,
        logo: 'src/assets/picture/medikablue.png',
      });

      setMessage({ text: `Annual report for ${currentYear} downloaded successfully!`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setMessage({ text: 'Could not generate annual report.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  // Handle Monthly Animal Bite Report Download
  const handleAnimalBiteMonthly = async () => {
    try {
      if (monthlyAnimalData.length === 0) {
        setMessage({ text: 'No data available to download for this month.', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        return;
      }

      const monthYear = getSelectedMonthLabel();

      // Prepare data for Monthly Report
      const rows = monthlyAnimalData.map((item, index) => {
        const totalCases = item.count || 0;
        const newCases = item.new_cases || Math.floor(totalCases * 0.1);
        const underTreatment = item.under_treatment || Math.floor(totalCases * 0.15);
        const recovered = item.recovered || Math.floor(totalCases * 0.75);
        const deaths = item.deaths || 0;
        
        let notes = '';
        if (index === 0) notes = 'Most common in Barangay 1';
        else if (index === 1) notes = 'Increasing in urban areas';
        else if (index === 2) notes = 'Stable';
        else notes = 'Rare cases';
        
        return [
          item.animal_type || 'Unknown',
          totalCases,
          newCases,
          underTreatment,
          recovered,
          deaths,
          notes
        ];
      });

      const headers = ['Animal Type', 'Total Cases', 'New Cases', 'Under Treatment', 'Recovered', 'Deaths', 'Notes/Trends'];

      generatePDF({
        title: 'Animal Bite Monthly Report',
        monthYear: monthYear,
        tableHeaders: headers,
        tableData: rows,
        logo: 'src/assets/picture/medikablue.png',
      });

      setMessage({ text: `Report for ${monthYear} downloaded successfully!`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setMessage({ text: 'Could not generate monthly report.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

 
  const monthlyTrendsChartData = {
    labels: allMonths.map(monthKey =>
      new Date(`${monthKey}-01`).toLocaleDateString("en-PH", {
        month: "short"
      })
    ),
    datasets: [
      {
        label: 'Dog',
        data: monthlyTrends['Dog'] || [],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Cat',
        data: monthlyTrends['Cat'] || [],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Rat',
        data: monthlyTrends['Rat'] || [],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Other',
        data: monthlyTrends['Other'] || [],
        borderColor: '#27374D',
        backgroundColor: 'rgba(39, 55, 77, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  const monthlyTrendsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#27374D',
          font: {
            size: 12,
            weight: '500'
          },
          padding: 15,
          usePointStyle: true,
        }
      },
      title: {
        display: true,
        text: 'Monthly Animal Bite Cases',
        color: "#27374D",
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: {
          bottom: 20
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#27374D",
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(39, 55, 77, 0.1)',
          drawBorder: false,
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#27374D",
          font: {
            size: 12
          },
          stepSize: 3
        },
        grid: {
          color: 'rgba(39, 55, 77, 0.1)',
          drawBorder: false,
        }
      },
    }
  };

  // Animal Types Horizontal Bar Chart
  const getSelectedMonthLabel = () => {
    if (!selectedMonth) return 'Current Month';
    const date = new Date(`${selectedMonth}-01`);
    return date.toLocaleString("en-PH", {
      timeZone: 'Asia/Manila',
      month: "long",
      year: "numeric",
    });
  };

  const animalTypeChartData = {
    labels: monthlyAnimalData.map(item => item.animal_type || 'Unknown'),
    datasets: [
      {
        label: 'Number of Bites',
        data: monthlyAnimalData.map(item => item.count),
        backgroundColor: [
          '#ef4444', // Red
          '#f59e0b', // Orange
          '#10b981', // Green
          '#3b82f6', // Blue
          '#8b5cf6', // Purple
          '#ec4899', // Pink
        ],
        borderColor: '#27374D',
        borderWidth: 1,
      }
    ],
  };

  const animalTypeChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Animal Types - ${getSelectedMonthLabel()}`,
        color: "#27374D",
        font: {
          size: 20,
          weight: 'bold',
        }
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "#27374D",
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(39, 55, 77, 0.1)'
        }
      },
      y: {
        ticks: {
          color: "#27374D",
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      },
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      
      <main className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Animal Bite Report</h1>
          </div>
          <div className={styles.headerRight}>
            <EmergencyButton />
            <ProfileDropdown 
              email="admin@klynx.com"
              name="Admin User"
            />
          </div>
        </div>

        {/* Success/Error Message */}
        {message.text && (
          <div className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
            {message.text}
          </div>
        )}

         {/* Download Button for Overall Annual Report */}
              <div className={styles.actionSection}>
                <button className={styles.downloadButton} onClick={handleAnimalBite}>
                  <BiDownload size={20} />
                  Download Annual Report
                </button>
              </div>

        {/* Statistics Card */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard} style={{ borderLeftColor: '#ef4444' }}>
            <div className={styles.statLabel}>Total Animal Bite Cases</div>
            <div className={styles.statValue}>{animalBiteStats.total || 0}</div>
            <div className={styles.statSubtext}>All recorded incidents</div>
          </div>
        </div>

        {/* Monthly Trends Line Chart */}
        <div className={styles.chartSection}>
          <div className={styles.chartContainer}>
            {Object.keys(monthlyTrends).length === 0 ? (
              <p className={styles.noData}>No trend data available.</p>
            ) : (
              <Line data={monthlyTrendsChartData} options={monthlyTrendsChartOptions} />
            )}
          </div>
        </div>

        {/* Yearly Bites Chart
        <div className={styles.chartSection}>
          <div className={styles.chartContainer}>
            {Object.keys(yearlyBites).length === 0 ? (
              <p className={styles.noData}>No data available for this year.</p>
            ) : (
              <Bar data={yearlyBitesChartData} options={yearlyBitesChartOptions} />
            )}
          </div>
        </div> */}

        {/* Animal Types Horizontal Bar Chart with Month Selector and Download */}
        <div className={styles.chartSection}>
          <div className={styles.chartHeader}>
            <div className={styles.chartControls}>
              <label htmlFor="monthSelector" className={styles.monthLabel}>
                Select Month:
              </label>
              <select
                id="monthSelector"
                className={styles.monthSelector}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {allMonths.map(month => {
                  const date = new Date(`${month}-01`);
                  const label = date.toLocaleDateString("en-PH", {
                    timeZone: 'Asia/Manila',
                    month: "long",
                    year: "numeric"
                  });
                  return (
                    <option key={month} value={month}>
                      {label}
                    </option>
                  );
                })}
              </select>
            </div>
            <button 
              className={styles.downloadChartButton} 
              onClick={handleAnimalBiteMonthly}
              disabled={monthlyAnimalData.length === 0}
            >
              <BiDownload size={18} />
              Download Monthly Report
            </button>
          </div>
          <div className={styles.chartContainer}>
            {monthlyAnimalData.length === 0 ? (
              <p className={styles.noData}>No data available for this month.</p>
            ) : (
              <Bar data={animalTypeChartData} options={animalTypeChartOptions} />
            )}
          </div>
        </div>

        {/* Summary Table */}
        <div className={styles.tableSection}>
          <h2 className={styles.tableTitle}>Animal Bite Case Summary</h2>
          <p className={styles.tableSubtitle}>Comprehensive overview of animal bite cases by type</p>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Animal Type</th>
                  <th>Total Cases</th>
                  <th>New Cases</th>
                  <th>Under Treatment</th>
                  <th>Recovered</th>
                  <th>Deaths</th>
                  <th>Notes / Trends</th>
                </tr>
              </thead>
              <tbody>
                {monthlyAnimalData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyMessage}>
                      No animal bite data available for this month
                    </td>
                  </tr>
                ) : (
                  monthlyAnimalData.map((item, index) => {
                    const totalCases = item.count || 0;
                    const newCases = item.new_cases || Math.floor(totalCases * 0.1);
                    const underTreatment = item.under_treatment || Math.floor(totalCases * 0.15);
                    const recovered = item.recovered || Math.floor(totalCases * 0.75);
                    const deaths = item.deaths || 0;
                    
                    return (
                      <tr key={index}>
                        <td className={styles.animalTypeCell}>{item.animal_type || 'Unknown'}</td>
                        <td className={styles.numberCell}>{totalCases}</td>
                        <td className={styles.numberCell}>{newCases}</td>
                        <td className={styles.treatmentCell}>{underTreatment}</td>
                        <td className={styles.recoveredCell}>{recovered}</td>
                        <td className={styles.deathsCell}>{deaths}</td>
                        <td className={styles.notesCell}>
                          {index === 0 && 'Most common in Barangay 1'}
                          {index === 1 && 'Increasing in urban areas'}
                          {index === 2 && 'Stable'}
                          {index > 2 && 'Rare cases'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AnimalBiteReport;