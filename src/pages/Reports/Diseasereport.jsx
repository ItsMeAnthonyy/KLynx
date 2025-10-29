import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ProfileDropdown from '../../components/ProfileDropdown';
import { Bar, Line } from "react-chartjs-2";
import axios from 'axios';
import 'chart.js/auto';
import { BiError, BiDownload } from 'react-icons/bi';
import styles from './DiseaseReport.module.css';

// Generate Disease PDF Report
import { generatePDF } from './D Report PDF';

// Dates Application
const currentYear = new Date().getFullYear();
const today = new Date();

const formattedDate = today.toLocaleDateString('en-PH', {
  timeZone: 'Asia/Manila',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

const currentMonth = today.toLocaleString("en-PH", {
  timeZone: 'Asia/Manila',
  month: "long",
  year: "numeric",
});

const allMonths = Array.from({ length: 12 }, (_, i) => {
  const month = (i + 1).toString().padStart(2, '0');
  return `${currentYear}-${month}`;
});

function DiseaseReport() {
  // State for storing health data
  const [HealthData, setHealthData] = useState([]);
  const [diseaseStats, setDiseaseStats] = useState([]);
  const [topDiseasesMonth, setTopDiseasesMonth] = useState([]);
  const [monthlyTopDiseases, setMonthlyTopDiseases] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7); // YYYY-MM format
  });


const handleDiseaseDownload = async () => {
  try {
    const now = new Date();
    const monthYear = now.toLocaleDateString('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: 'long'
    });

    // Use real-time data from HealthData state
    const rows = HealthData.map(item => {
      const age0_17 = Number(item['Age 0-17']) || 0;
      const age18_40 = Number(item['Age 18-40']) || 0;
      const age41_59 = Number(item['Age 41-59']) || 0;
      const age60plus = Number(item['Age 60+']) || 0;
      const total = age0_17 + age18_40 + age41_59 + age60plus;

      return [
        item["DiagnosisName"],
        age0_17,
        age18_40,
        age41_59,
        age60plus,
        total
      ];
    });

    const headers = [
      'Diagnosis Name',
      'Age [0–17]',
      'Age [18–40]',
      'Age [41–59]',
      'Age [60+]',
      'Total Cases'
    ];

    generatePDF({
      title: 'Medical Report',
      monthYear: monthYear,
      tableHeaders: headers,
      tableData: rows,
      logo: 'src/assets/picture/medikablue.png',
    });

    setMessage({ text: 'Report downloaded successfully!', type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  } catch (error) {
    console.error('Error generating PDF:', error);
    setMessage({ text: 'Could not generate report.', type: 'error' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  }
};

const handleMonthlyTopDiseasesDownload = async () => {
  try {
    if (topDiseasesMonth.length === 0) {
      setMessage({ text: 'No data available to download for this month.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }

    const monthYear = getSelectedMonthLabel();

    // Prepare data for PDF
    const rows = topDiseasesMonth.map((item, index) => [
      index + 1,
      item.disease || item.DiagnosisName,
      item.cases || item.total || 0
    ]);

    const headers = ['Rank', 'Disease Name', 'Number of Cases'];

    generatePDF({
      title: 'Top 10 Diseases Report',
      monthYear: monthYear,
      tableHeaders: headers,
      tableData: rows,
      logo: 'src/assets/picture/medikablue.png',
    });

    setMessage({ text: `Report for ${monthYear} downloaded successfully!`, type: 'success' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  } catch (error) {
    console.error('Error generating monthly report:', error);
    setMessage({ text: 'Could not generate monthly report.', type: 'error' });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  }
};

// Getting Real-time Data from PHP
useEffect(() => {
  const fetchData = async () => {
    try {
      const today = new Date();
      const dateParam = today.toISOString().split('T')[0];
      const monthParam = dateParam.slice(0, 7);

      const response = await fetch(`http://localhost/api/fetchHealthReport.php?date=${dateParam}&month=${monthParam}`);
      const data = await response.json();
      setHealthData(data);
    } catch (error) {
      console.error('Error fetching health report:', error);
      setMessage({ text: 'Error fetching health data', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  fetchData();
}, []);

// Fetching Disease Statistics
useEffect(() => {
  const fetchData = async () => {
    try {
      const statsResponse = await axios.get('http://localhost/api/disease-statistics.php');
      setDiseaseStats(statsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMessage({ text: 'Error fetching disease statistics', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  fetchData();
}, []);

// Fetching Top 10 Diseases for Selected Month
useEffect(() => {
  const fetchTopDiseases = async () => {
    try {
      const response = await axios.get(`http://localhost/api/top-diseases-month.php?month=${selectedMonth}`);
      setTopDiseasesMonth(response.data);
    } catch (error) {
      console.error("Error fetching top diseases:", error);
    }
  };

  if (selectedMonth) {
    fetchTopDiseases();
  }
}, [selectedMonth]);

// Fetching Monthly Top 10 Diseases for the Year
useEffect(() => {
  const fetchMonthlyTopDiseases = async () => {
    try {
      const response = await axios.get(`http://localhost/api/monthly-top-diseases.php?year=${currentYear}`);
      setMonthlyTopDiseases(response.data);
    } catch (error) {
      console.error("Error fetching monthly top diseases:", error);
    }
  };

  fetchMonthlyTopDiseases();
}, []);

const chartData = {
  labels: allMonths.map(monthKey =>
    new Date(`${monthKey}-01`).toLocaleDateString("en-PH", {
      month: "long",
      year: "numeric"
    })
  ),
  datasets: [
    {
      label: 'Number of Cases',
      data: allMonths.map(monthKey => diseaseStats[monthKey] || 0),
      backgroundColor: "#27374D",
      borderColor: "#27374D",
      borderWidth: 2,
    }
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#27374D',
        font: {
          size: 14,
          weight: '600'
        }
      }
    },
    title: {
      display: true,
      text: `${currentYear} Monthly Total Diagnoses`,
      color: "#27374D",
      font: {
        size: 20,
        weight: 'bold',
      }
    },
  },
  scales: {
    x: {
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
          size: 12
        }
      },
      grid: {
        color: 'rgba(39, 55, 77, 0.1)'
      }
    },
  }
};

// Top 10 Diseases for Selected Month - Horizontal Bar Chart
const getSelectedMonthLabel = () => {
  if (!selectedMonth) return 'Current Month';
  const date = new Date(`${selectedMonth}-01`);
  return date.toLocaleString("en-PH", {
    timeZone: 'Asia/Manila',
    month: "long",
    year: "numeric",
  });
};

const topDiseasesChartData = {
  labels: topDiseasesMonth.map(item => item.disease || item.DiagnosisName),
  datasets: [
    {
      label: 'Number of Cases',
      data: topDiseasesMonth.map(item => item.cases || item.total),
      backgroundColor: [
        '#27374D', '#526D82', '#9DB2BF', '#DDE6ED',
        '#48A9A6', '#4281A4', '#3F88C5', '#5E60CE',
        '#7209B7', '#B5179E'
      ],
      borderColor: '#27374D',
      borderWidth: 1,
    }
  ],
};

const topDiseasesChartOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: `Top 10 Diseases - ${getSelectedMonthLabel()}`,
      color: "#27374D",
      font: {
        size: 20,
        weight: 'bold',
      }
    },
  },
  scales: {
    x: {
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

// Monthly Disease Trends - Line Chart (showing top 4 diseases over time)
const processMonthlyTrends = () => {
  if (!monthlyTopDiseases || Object.keys(monthlyTopDiseases).length === 0) {
    return { labels: [], datasets: [] };
  }

  // Count total cases for each disease across all months to get top 4
  const diseaseTotals = {};
  Object.values(monthlyTopDiseases).forEach(monthData => {
    if (Array.isArray(monthData)) {
      monthData.forEach(item => {
        const disease = item.disease || item.DiagnosisName;
        diseaseTotals[disease] = (diseaseTotals[disease] || 0) + (item.cases || 0);
      });
    }
  });

  // Get top 4 diseases by total cases
  const topDiseases = Object.entries(diseaseTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([disease]) => disease);

  // Define colors for line chart (similar to the image)
  const lineColors = [
    { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },  // Blue
    { border: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },  // Green
    { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },   // Red
    { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },  // Orange
  ];

  // Create datasets for each top disease
  const datasets = topDiseases.map((disease, index) => ({
    label: disease,
    data: allMonths.map(monthKey => {
      const monthData = monthlyTopDiseases[monthKey];
      if (!monthData || !Array.isArray(monthData)) return 0;
      
      const diseaseData = monthData.find(item => 
        (item.disease || item.DiagnosisName) === disease
      );
      return diseaseData ? (diseaseData.cases || diseaseData.total || 0) : 0;
    }),
    borderColor: lineColors[index].border,
    backgroundColor: lineColors[index].bg,
    borderWidth: 2,
    tension: 0.4, // Smooth curves
    fill: false,
    pointRadius: 4,
    pointHoverRadius: 6,
    pointBackgroundColor: lineColors[index].border,
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
  }));

  return {
    labels: allMonths.map(monthKey =>
      new Date(`${monthKey}-01`).toLocaleDateString("en-PH", {
        month: "short"
      })
    ),
    datasets
  };
};

const monthlyTrendsChartData = processMonthlyTrends();

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
        padding: 20,
        usePointStyle: true,
      }
    },
    title: {
      display: true,
      text: 'Monthly Disease Trends',
      color: "#27374D",
      font: {
        size: 20,
        weight: 'bold',
      },
      padding: {
        bottom: 20
      }
    },
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(39, 55, 77, 0.1)',
        drawBorder: false,
      },
      ticks: {
        color: "#27374D",
        font: {
          size: 11
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(39, 55, 77, 0.1)',
        drawBorder: false,
      },
      ticks: {
        color: "#27374D",
        font: {
          size: 11
        },
        stepSize: 6
      }
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
};

return (
  <div className={styles.container}>
    <Sidebar />
    
    <main className={styles.content}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Medical Report</h1>
         
        </div>
        <div className={styles.headerRight}>
          <button className={styles.emergencyButton}>
            <BiError />
            EMERGENCY MODE
          </button>
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

      {/* Download Button */}
      <div className={styles.actionSection}>
        <button className={styles.downloadButton} onClick={handleDiseaseDownload}>
          <BiDownload size={20} />
          Download Medical Report
        </button>
      </div>

      {/* Monthly Disease Trends Line Chart */}
      <div className={styles.chartSection}>
        <div className={styles.chartContainer}>
          {monthlyTrendsChartData.datasets.length === 0 ? (
            <p className={styles.noData}>No data available for this year.</p>
          ) : (
            <Line data={monthlyTrendsChartData} options={monthlyTrendsChartOptions} />
          )}
        </div>
      </div>

      {/* Top 10 Diseases with Month Selector */}
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
            onClick={handleMonthlyTopDiseasesDownload}
            disabled={topDiseasesMonth.length === 0}
          >
            <BiDownload size={18} />
            Download Report
          </button>
        </div>
        <div className={styles.chartContainer}>
          {topDiseasesMonth.length === 0 ? (
            <p className={styles.noData}>No data available for this month.</p>
          ) : (
            <Bar data={topDiseasesChartData} options={topDiseasesChartOptions} />
          )}
        </div>
      </div>

      {/* Total Cases Chart */}
      <div className={styles.chartSection}>
        <h2 className={styles.chartTitle}>{currentYear} Total Medical Cases</h2>
        <div className={styles.chartContainer}>
          {Object.keys(diseaseStats).length === 0 ? (
            <p className={styles.noData}>No data available for this year.</p>
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className={styles.tableSection}>
        <h2 className={styles.tableTitle}>Medical Summary Table</h2>
        <p className={styles.tableSubtitle}>Comprehensive disease diagnosis breakdown by age groups</p>
        
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Diagnosis Name</th>
                <th>Age 0-17</th>
                <th>Age 18-40</th>
                <th>Age 41-59</th>
                <th>Age 60+</th>
                <th>New Cases<br/><span className={styles.subHeader}>(as of {formattedDate})</span></th>
                <th>Total Cases<br/><span className={styles.subHeader}>(as of {currentMonth})</span></th>
              </tr>
            </thead>
            <tbody>
              {HealthData.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyMessage}>
                    No health data available
                  </td>
                </tr>
              ) : (
                HealthData.map((record, index) => {
                  const age0_17 = Number(record["Age 0-17"]) || 0;
                  const age18_40 = Number(record["Age 18-40"]) || 0;
                  const age41_59 = Number(record["Age 41-59"]) || 0;
                  const age60plus = Number(record["Age 60+"]) || 0;
                  const overallTotal = age0_17 + age18_40 + age41_59 + age60plus;

                  return (
                    <tr key={index}>
                      <td className={styles.indexCell}>{index + 1}</td>
                      <td className={styles.diagnosisCell}>{record["DiagnosisName"]}</td>
                      <td>{age0_17}</td>
                      <td>{age18_40}</td>
                      <td>{age41_59}</td>
                      <td>{age60plus}</td>
                      <td className={styles.highlightCell}>{record["New Cases"]}</td>
                      <td className={styles.totalCell}>{overallTotal}</td>
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

export default DiseaseReport;   