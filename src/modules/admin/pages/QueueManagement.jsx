import { useState, useEffect } from 'react';
import { BiCalendar, BiUser, BiTime, BiCheckCircle, BiLoaderAlt } from 'react-icons/bi';
import Sidebar from '../../../components/Sidebar';
import ProfileDropdown from '../../../components/ProfileDropdown';
import EmergencyButton from '../../../components/EmergencyButton';
import styles from './QueueManagement.module.css';

const QueueManagement = () => {
    // Initialize appointments from localStorage or use mock data
    const [appointments, setAppointments] = useState(() => {
        const savedQueue = localStorage.getItem('queueAppointments');
        if (savedQueue) {
            return JSON.parse(savedQueue);
        }
        return [
            {
                queueNumber: 1,
                name: 'Rie Mabitado',
                phone: '09667034802',
                status: 'completed',
                complaint: ''
            },
            {
                queueNumber: 2,
                name: 'Eli Austria',
                phone: '0957456612',
                status: 'in-progress',
                complaint: ''
            },
            {
                queueNumber: 3,
                name: 'John Doe',
                phone: '0965613213',
                status: 'waiting',
                complaint: 'headache'
            }
        ];
    });

    // Save appointments to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('queueAppointments', JSON.stringify(appointments));
    }, [appointments]);

    // Calculate stats
    const totalToday = appointments.length;
    const waiting = appointments.filter(apt => apt.status === 'waiting').length;
    const inProgress = appointments.filter(apt => apt.status === 'in-progress').length;
    const completed = appointments.filter(apt => apt.status === 'completed').length;

    // Get current date
    const getCurrentDate = () => {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return today.toLocaleDateString('en-US', options);
    };

    const handleStart = (queueNumber) => {
        setAppointments(appointments.map(apt => 
            apt.queueNumber === queueNumber ? { ...apt, status: 'in-progress' } : apt
        ));
    };

    const handleComplete = (queueNumber) => {
        setAppointments(appointments.map(apt => 
            apt.queueNumber === queueNumber ? { ...apt, status: 'completed' } : apt
        ));
    };

    const handleCancel = (queueNumber) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            setAppointments(appointments.filter(apt => apt.queueNumber !== queueNumber));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return styles.statusCompleted;
            case 'in-progress':
                return styles.statusInProgress;
            case 'waiting':
                return styles.statusWaiting;
            default:
                return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'COMPLETED';
            case 'in-progress':
                return 'IN-PROGRESS';
            case 'waiting':
                return 'WAITING';
            default:
                return '';
        }
    };

    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>QUEUE MANAGEMENT</h1>
                    </div>
                    <div className={styles.headerRight}>
                        <EmergencyButton />
                        <ProfileDropdown 
                            email="admin@klynx.com"
                            name="Admin User"
                        />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className={styles.statsContainer}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <BiUser />
                        </div>
                        <div className={styles.statInfo}>
                            <p className={styles.statLabel}>Total Today</p>
                            <h2 className={styles.statValue}>{totalToday}</h2>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <BiTime />
                        </div>
                        <div className={styles.statInfo}>
                            <p className={styles.statLabel}>Waiting</p>
                            <h2 className={styles.statValue}>{waiting}</h2>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <BiLoaderAlt />
                        </div>
                        <div className={styles.statInfo}>
                            <p className={styles.statLabel}>In Progress</p>
                            <h2 className={styles.statValue}>{inProgress}</h2>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <BiCheckCircle />
                        </div>
                        <div className={styles.statInfo}>
                            <p className={styles.statLabel}>Completed</p>
                            <h2 className={styles.statValue}>{completed}</h2>
                        </div>
                    </div>
                </div>

                {/* Today's Appointments */}
                <div className={styles.appointmentsSection}>
                    <div className={styles.sectionHeader}>
                        <BiCalendar className={styles.sectionIcon} />
                        <div>
                            <h2 className={styles.sectionTitle}>Today&apos;s Appointments</h2>
                            <p className={styles.sectionDate}>{getCurrentDate()}</p>
                        </div>
                    </div>

                    <div className={styles.appointmentsList}>
                        {appointments.map((appointment) => (
                            <div key={appointment.queueNumber} className={styles.appointmentCard}>
                                <div className={styles.appointmentLeft}>
                                    <div className={styles.appointmentNumber}>
                                        {appointment.queueNumber}
                                    </div>
                                    <div className={styles.appointmentInfo}>
                                        <h3 className={styles.appointmentName}>{appointment.name}</h3>
                                        <p className={styles.appointmentPhone}>{appointment.phone}</p>
                                        {appointment.complaint && (
                                            <p className={styles.appointmentComplaint}>&quot;{appointment.complaint}&quot;</p>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.appointmentRight}>
                                    <span className={`${styles.statusBadge} ${getStatusColor(appointment.status)}`}>
                                        {getStatusText(appointment.status)}
                                    </span>
                                    <div className={styles.appointmentActions}>
                                        {appointment.status === 'waiting' && (
                                            <>
                                                <button 
                                                    className={styles.startButton}
                                                    onClick={() => handleStart(appointment.queueNumber)}
                                                >
                                                    Start
                                                </button>
                                                <button 
                                                    className={styles.cancelButton}
                                                    onClick={() => handleCancel(appointment.queueNumber)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                        {appointment.status === 'in-progress' && (
                                            <>
                                                <button 
                                                    className={styles.completeButton}
                                                    onClick={() => handleComplete(appointment.queueNumber)}
                                                >
                                                    Complete
                                                </button>
                                                <button 
                                                    className={styles.cancelButton}
                                                    onClick={() => handleCancel(appointment.queueNumber)}
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QueueManagement;