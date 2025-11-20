import React, { useState, useEffect } from 'react';
import Sidebar from '../../../components/Sidebar';
import EmergencyButton from '../../../components/EmergencyButton';
import ProfileDropdown from '../../../components/ProfileDropdown';
import AppointmentCalendar from './appointmentCalendar';
import AppointmentBookingModal from '../popups/appointmentBookingModal';
import { getAppointments, getProviders } from '../api/patientAppointmentApi';

import styles from './appointment.module.css';
import useAuth from '../../../hooks/useAuth';
import { BiPlus } from "react-icons/bi";

const Appointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [providers, setProviders] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedProvider, setSelectedProvider] = useState('all');
    const [selectedConsultationType, setSelectedConsultationType] = useState('all');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    //const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('week');
    const [lateAppointments, setLateAppointments] = useState([]);

    const { auth } = useAuth();
    const isAdmin  = auth?.userRole?.includes("admin");

    useEffect(() => {
        //checkUser();
        fetchProviders();
    }, []);

    useEffect(() => {
        if (!auth.userRole) return;
        fetchAppointments();
    }, []);

    const fetchProviders = async () => {
        try {
            const data = await getProviders();
            setProviders(data);
        } catch (error) {
            console.error('Error fetching providers:', error);
        }
    };

    const fetchAppointments = async () => {
        try {
            let startDate, endDate;
            if (viewMode === 'day') {
                startDate = startOfDay(currentDate).toISOString();
                endDate = endOfDay(currentDate).toISOString();
            } else if (viewMode === 'week') {
                const { startOfWeek, endOfWeek } = await import('date-fns');
                startDate = startOfWeek(currentDate, { weekStartsOn: 1 }).toISOString();
                endDate = endOfWeek(currentDate, { weekStartsOn: 1 }).toISOString();
            } else {
                const { startOfMonth, endOfMonth } = await import('date-fns');
                startDate = startOfMonth(currentDate).toISOString();
                endDate = endOfMonth(currentDate).toISOString();
            }

            const providerId = selectedProvider === 'all' ? null : selectedProvider;
            const data = await getAppointments(startDate, endDate, providerId);
            setAppointments(data);
        } catch (err){

        } finally {
            setLoading(false);
        }
    };

    const filteredAppointments = appointments.filter(apt => {
        const matchesConsultationType = selectedConsultationType === 'all' || apt.consultation_type === selectedConsultationType;
        return matchesConsultationType;
    });

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return(
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.title}>Appointment</h1>
                    </div>
                    <div className={styles.headerRight}>
                        <EmergencyButton />
                        <ProfileDropdown 
                            email={auth.userEmail || "Email"}
                            name= {auth.userFirstName + " " + auth.userLastName || "User"}
                        />
                    </div>
                </div>




                <div className={styles.header2}>
                    <div className={styles.headerRight2}>
                        <div></div>
                        <div className={styles.filters}>
                            <select
                                value={selectedProvider}
                                onChange={(e) => setSelectedProvider(e.target.value)}
                                className={styles.select}
                            >
                                <option value="all">All Providers</option>
                                {providers.map((provider) => (
                                    <option key={provider.user_id} value={provider.user_id}>
                                        {provider.first_name} {provider.last_name} ({provider.role})
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedConsultationType}
                                onChange={(e) => setSelectedConsultationType(e.target.value)}
                                className={styles.select}
                            >
                                <option value="all">All Types</option>
                                <option value="general">General</option>
                                <option value="prenatal">Prenatal</option>
                                <option value="postnatal">Postnatal</option>
                                <option value="family_planning">Family Planning</option>
                                <option value="immunization">Immunization</option>
                                <option value="pediatric">Pediatric</option>
                                <option value="dental">Dental</option>
                                <option value="laboratory">Laboratory</option>
                            </select>
                        </div>

                        {isAdmin && (
                            <button onClick={() => setShowBookingModal(true)} className={styles.newBtn}>
                                <BiPlus size={20} />
                                New Appointment
                            </button>
                        )}
                    </div>
                </div>

                <AppointmentCalendar
                    appointments={filteredAppointments}
                    onAppointmentClick={setSelectedAppointment}
                    currentDate={currentDate}
                    onDateChange={setCurrentDate}
                    viewMode={viewMode}
                    onViewChange={setViewMode}
                />

                {showBookingModal && (
                    <AppointmentBookingModal
                        onClose={() => setShowBookingModal(false)}
                        onSuccess={fetchAppointments}
                        currentUserId={currentUser?.id}
                    />
                )}
                
            </main>
        </div>
    );
}

export default Appointment;