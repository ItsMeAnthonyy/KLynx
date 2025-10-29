import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import ProfileDropdown from '../../components/ProfileDropdown';
import { Bar, Line } from "react-chartjs-2";
import axios from 'axios';
import 'chart.js/auto';
import { BiError, BiDownload } from 'react-icons/bi';
import styles from './MaternalReport.module.css';

// Generate Maternal PDF Report
import { generatePDF } from '/Utility/MCReportPDF';

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

function MaternalReport() {
  // Mock data for demonstration
  const mockCheckupStats = {
    prenatal: 185,
    intrapartum: 92,
    postpartum: 143
  };

  const mockAgeGroupData = [
    { age_group: 'Under 18', count: 12 },
    { age_group: '18-25', count: 45 },
    { age_group: '26-30', count: 38 },
    { age_group: '31-35', count: 25 },
    { age_group: '36+', count: 8 }
  ];

  const mockMonthlyCheckups = {
    '2025-01': { prenatal: 18, intrapartum: 9, postpartum: 14 },
    '2025-02': { prenatal: 15, intrapartum: 8, postpartum: 12 },
    '2025-03': { prenatal: 20, intrapartum: 10, postpartum: 15 },
    '2025-04': { prenatal: 17, intrapartum: 8, postpartum: 13 },
    '2025-05': { prenatal: 19, intrapartum: 9, postpartum: 14 },
    '2025-06': { prenatal: 16, intrapartum: 7, postpartum: 11 },
    '2025-07': { prenatal: 21, intrapartum: 11, postpartum: 16 },
    '2025-08': { prenatal: 18, intrapartum: 9, postpartum: 13 },
    '2025-09': { prenatal: 22, intrapartum: 10, postpartum: 17 },
    '2025-10': { prenatal: 19, intrapartum: 11, postpartum: 18 },
    '2025-11': { prenatal: 0, intrapartum: 0, postpartum: 0 },
    '2025-12': { prenatal: 0, intrapartum: 0, postpartum: 0 },
  };

  const mockPrenatalTrends = {
    'High-Risk Cases': [3, 2, 4, 3, 3, 4, 2, 4, 5, 2, 0, 0],
    'New Registrations': [5, 6, 7, 5, 8, 6, 5, 7, 6, 5, 0, 0],
    'Total Checkups': [18, 22, 25, 20, 28, 31, 24, 27, 29, 23, 0, 0]
  };

  // State for storing maternal data
  const [checkupStats, setCheckupStats] = useState(mockCheckupStats);
  const [ageGroupData, setAgeGroupData] = useState(mockAgeGroupData);
  const [monthlyCheckups, setMonthlyCheckups] = useState(mockMonthlyCheckups);
  const [prenatalTrends, setPrenatalTrends] = useState(mockPrenatalTrends);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 7); // YYYY-MM format
  });

  // Fetching Maternal Checkup Statistics (Prenatal, Intrapartum, Postpartum)
  useEffect(() => {
    const fetchCheckupStats = async () => {
      try {
        const response = await axios.get('http://localhost/api/maternal-checkup-stats.php');
        setCheckupStats(response.data);
      } catch (error) {
        console.error("Error fetching checkup stats:", error);
        setMessage({ text: 'Error fetching checkup statistics', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    };

    fetchCheckupStats();
  }, []);

  // Fetching Age Group Distribution for Selected Month
  useEffect(() => {
    const fetchAgeGroupData = async () => {
      try {
        const response = await axios.get(`http://localhost/api/maternal-age-groups.php?month=${selectedMonth}`);
        setAgeGroupData(response.data);
      } catch (error) {
        console.error("Error fetching age group data:", error);
      }
    };

    if (selectedMonth) {
      fetchAgeGroupData();
    }
  }, [selectedMonth]);

  // Fetching Monthly Checkups for the Year
  useEffect(() => {
    const fetchMonthlyCheckups = async () => {
      try {
        const response = await axios.get(`http://localhost/api/maternal-monthly-checkups.php?year=${currentYear}`);
        setMonthlyCheckups(response.data);
      } catch (error) {
        console.error("Error fetching monthly checkups:", error);
      }
    };

    fetchMonthlyCheckups();
  }, []);

  const handleMaternalDownload = async () => {
    try {
      // Prepare data for PDF
      const rows = [
        ['Prenatal Checkups', checkupStats.prenatal || 0],
        ['Intrapartum Checkups', checkupStats.intrapartum || 0],
        ['Postpartum Checkups', checkupStats.postpartum || 0],
        ['Total Checkups', (checkupStats.prenatal || 0) + (checkupStats.intrapartum || 0) + (checkupStats.postpartum || 0)]
      ];

      const headers = ['Checkup Type', 'Total Count'];

      generatePDF({
        title: 'Maternal Care Report',
        monthYear: currentMonth,
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

  const handleAgeGroupDownload = async () => {
    try {
      if (ageGroupData.length === 0) {
        setMessage({ text: 'No age group data available to download.', type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        return;
      }

      const monthYear = getSelectedMonthLabel();

      // Prepare data for Age Group PDF
      const rows = ageGroupData.map((item, index) => [
        index + 1,
        item.age_group,
        item.count
      ]);

      const headers = ['#', 'Age Group', 'Number of Patients'];

      generatePDF({
        title: 'Maternal Age Group Distribution',
        monthYear: monthYear,
        tableHeaders: headers,
        tableData: rows,
        logo: 'src/assets/picture/medikablue.png',
      });

      setMessage({ text: `Age group report for ${monthYear} downloaded successfully!`, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setMessage({ text: 'Could not generate age group report.', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  // Monthly Checkups Bar Chart
  const monthlyCheckupsChartData = {
    labels: allMonths.map(monthKey =>
      new Date(`${monthKey}-01`).toLocaleDateString("en-PH", {
        month: "short",
        year: "numeric"
      })
    ),
    datasets: [
      {
        label: 'Prenatal',
        data: allMonths.map(monthKey => monthlyCheckups[monthKey]?.prenatal || 0),
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
        borderWidth: 1,
      },
      {
        label: 'Intrapartum',
        data: allMonths.map(monthKey => monthlyCheckups[monthKey]?.intrapartum || 0),
        backgroundColor: '#10b981',
        borderColor: '#10b981',
        borderWidth: 1,
      },
      {
        label: 'Postpartum',
        data: allMonths.map(monthKey => monthlyCheckups[monthKey]?.postpartum || 0),
        backgroundColor: '#f59e0b',
        borderColor: '#f59e0b',
        borderWidth: 1,
      }
    ],
  };

  const monthlyCheckupsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#27374D',
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      title: {
        display: true,
        text: `${currentYear} Monthly Maternal Checkups`,
        color: "#27374D",
        font: {
          size: 20,
          weight: 'bold',
        }
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: "#27374D",
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(39, 55, 77, 0.1)'
        }
      },
      y: {
        stacked: true,
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
    }
  };

  // Monthly Prenatal Care Trends Line Chart
  const prenatalTrendsChartData = {
    labels: allMonths.map(monthKey =>
      new Date(`${monthKey}-01`).toLocaleDateString("en-PH", {
        month: "short"
      })
    ),
    datasets: [
      {
        label: 'High-Risk Cases',
        data: prenatalTrends['High-Risk Cases'] || [],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'New Registrations',
        data: prenatalTrends['New Registrations'] || [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Total Checkups',
        data: prenatalTrends['Total Checkups'] || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ],
  };

  const prenatalTrendsChartOptions = {
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
        text: 'Monthly Prenatal Care Trends',
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
        max: 32,
        ticks: {
          color: "#27374D",
          font: {
            size: 12
          },
          stepSize: 8
        },
        grid: {
          color: 'rgba(39, 55, 77, 0.1)',
          drawBorder: false,
        }
      },
    }
  };

  // Age Group Horizontal Bar Chart
  const getSelectedMonthLabel = () => {
    if (!selectedMonth) return 'Current Month';
    const date = new Date(`${selectedMonth}-01`);
    return date.toLocaleString("en-PH", {
      timeZone: 'Asia/Manila',
      month: "long",
      year: "numeric",
    });
  };

  const ageGroupChartData = {
    labels: ageGroupData.map(item => item.age_group),
    datasets: [
      {
        label: 'Number of Patients',
        data: ageGroupData.map(item => item.count),
        backgroundColor: [
          '#3b82f6', // Blue
          '#10b981', // Green
          '#f59e0b', // Orange
          '#ef4444', // Red
          '#8b5cf6', // Purple
        ],
        borderColor: '#27374D',
        borderWidth: 1,
      }
    ],
  };

  const ageGroupChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Age Group Distribution - ${getSelectedMonthLabel()}`,
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
            <h1 className={styles.title}>Maternal Care Report</h1>
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
          <button className={styles.downloadButton} onClick={handleMaternalDownload}>
            <BiDownload size={20} />
            Download Maternal Report
          </button>
        </div>

        {/* Checkup Statistics Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard} style={{ borderLeftColor: '#3b82f6' }}>
            <div className={styles.statLabel}>Prenatal Checkups</div>
            <div className={styles.statValue}>{checkupStats.prenatal || 0}</div>
          </div>
          <div className={styles.statCard} style={{ borderLeftColor: '#10b981' }}>
            <div className={styles.statLabel}>Intrapartum Checkups</div>
            <div className={styles.statValue}>{checkupStats.intrapartum || 0}</div>
          </div>
          <div className={styles.statCard} style={{ borderLeftColor: '#f59e0b' }}>
            <div className={styles.statLabel}>Postpartum Checkups</div>
            <div className={styles.statValue}>{checkupStats.postpartum || 0}</div>
          </div>
        </div>

        {/* Prenatal Care Trends Line Chart */}
        <div className={styles.chartSection}>
          <div className={styles.chartContainer}>
            {Object.keys(prenatalTrends).length === 0 ? (
              <p className={styles.noData}>No trend data available.</p>
            ) : (
              <Line data={prenatalTrendsChartData} options={prenatalTrendsChartOptions} />
            )}
          </div>
        </div>

        {/* Monthly Checkups Chart */}
        <div className={styles.chartSection}>
          <div className={styles.chartContainer}>
            {Object.keys(monthlyCheckups).length === 0 ? (
              <p className={styles.noData}>No data available for this year.</p>
            ) : (
              <Bar data={monthlyCheckupsChartData} options={monthlyCheckupsChartOptions} />
            )}
          </div>
        </div>

        {/* Age Group Horizontal Bar Chart with Month Selector */}
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
              onClick={handleAgeGroupDownload}
              disabled={ageGroupData.length === 0}
            >
              <BiDownload size={18} />
              Download Age Group Report
            </button>
          </div>
          <div className={styles.chartContainer}>
            {ageGroupData.length === 0 ? (
              <p className={styles.noData}>No data available for this month.</p>
            ) : (
              <Bar data={ageGroupChartData} options={ageGroupChartOptions} />
            )}
          </div>
        </div>

        {/* Summary Table */}
        <div className={styles.tableSection}>
          <h2 className={styles.tableTitle}>Maternal Checkup Summary</h2>
          <p className={styles.tableSubtitle}>Overview of maternal care services as of {formattedDate}</p>
          
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Checkup Type</th>
                  <th>Total Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const total = (checkupStats.prenatal || 0) + (checkupStats.intrapartum || 0) + (checkupStats.postpartum || 0);
                  const checkups = [
                    { type: 'Prenatal', count: checkupStats.prenatal || 0 },
                    { type: 'Intrapartum', count: checkupStats.intrapartum || 0 },
                    { type: 'Postpartum', count: checkupStats.postpartum || 0 },
                  ];

                  return checkups.map((checkup, index) => {
                    const percentage = total > 0 ? ((checkup.count / total) * 100).toFixed(1) : 0;
                    return (
                      <tr key={index}>
                        <td className={styles.indexCell}>{index + 1}</td>
                        <td className={styles.typeCell}>{checkup.type}</td>
                        <td className={styles.countCell}>{checkup.count}</td>
                        <td className={styles.percentCell}>{percentage}%</td>
                      </tr>
                    );
                  });
                })()}
                <tr className={styles.totalRow}>
                  <td colSpan={2} className={styles.totalLabel}>Total</td>
                  <td className={styles.totalValue}>
                    {(checkupStats.prenatal || 0) + (checkupStats.intrapartum || 0) + (checkupStats.postpartum || 0)}
                  </td>
                  <td className={styles.totalValue}>100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MaternalReport;