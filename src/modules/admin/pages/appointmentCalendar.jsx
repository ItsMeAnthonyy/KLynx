import React, { useMemo, useRef, useState, useEffect } from 'react';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { format } from 'date-fns';
import styles from './AppointmentCalendar.module.css';
import DayViewPanel from './dayViewPanel';

const STATUS_COLORS = {
    pending: '#F59E0B',
    scheduled: '#10B981',
    late: '#F97316',
    completed: '#6B7280',
    cancelled: '#EF4444'
};

const PRIORITY_LABELS = {
    routine: 'Routine',
    urgent: 'Urgent',
    emergency: 'Emergency'
};


const AppointmentCalendar = ({
  appointments,
  onAppointmentClick,
  currentDate,
  onDateChange,
  viewMode,
  onViewChange
}) => {

    const calendarRef = useRef(null);
    const [dayViewDate, setDayViewDate] = useState(currentDate);



    useEffect(() => {
        if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        const currentCalendarDate = calendarApi.getDate();
        // Only navigate if dates are different (avoid unnecessary updates)
            if (currentCalendarDate.toDateString() !== currentDate.toDateString()) {
                calendarApi.gotoDate(currentDate);
            }
        }
    }, [currentDate]);
    
    // Convert view mode to FullCalendar view
    const calendarView = useMemo(() => {
        switch (viewMode) {
        case 'week':
            return 'timeGridWeek';
        case 'month':
            return 'dayGridMonth';
        case 'agenda':
            return 'listWeek';
        default:
            return 'timeGridWeek';
        }
    }, [viewMode]);

     // Change view when viewMode changes
    useEffect(() => {
        if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.changeView(calendarView);
        }
    }, [calendarView]);

    // Convert appointments to FullCalendar events
    const events = useMemo(() => {
        return appointments.map(apt => {
        const endTime = new Date(apt.scheduled_time);
        endTime.setMinutes(endTime.getMinutes() + (apt.visit_duration_minutes || 30));
        
        return {
            id: apt.id,
            title: apt.patient_name || 'Unknown Patient',
            start: apt.scheduled_time,
            end: endTime.toISOString(),
            backgroundColor: STATUS_COLORS[apt.status] || '#10B981',
            borderColor: STATUS_COLORS[apt.status] || '#10B981',
            extendedProps: {
            ...apt,
            priorityLabel: PRIORITY_LABELS[apt.priority] || 'Routine'
            }
        };
        });
    }, [appointments]);

    const handleEventClick = (info) => {
        const appointment = {
            id: info.event.id,
            ...info.event.extendedProps
        };
        onAppointmentClick(appointment);
    };

    const handleDatesSet = (dateInfo) => {
        if (currentDate.toDateString() !== dateInfo.start.toDateString()) {
            onDateChange(dateInfo.start);
        }
    };

    const handleDayViewDateChange = (newDate) => {
        setDayViewDate(newDate);
        // Optionally navigate main calendar too
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi();
            calendarApi.gotoDate(newDate);
        }
    };
    return(

        <div className={styles.splitLayout}>
            <div className={styles.mainPanel}>
                <div className={styles.viewToggle}>
                    <button
                        className={`${styles.viewBtn} ${viewMode === 'week' ? styles.active : ''}`}
                        onClick={() => onViewChange('week')}
                    >
                        Week
                    </button>
                    <button
                        className={`${styles.viewBtn} ${viewMode === 'month' ? styles.active : ''}`}
                        onClick={() => onViewChange('month')}
                    >
                        Month
                    </button>
                    <button
                        className={`${styles.viewBtn} ${viewMode === 'agenda' ? styles.active : ''}`}
                        onClick={() => onViewChange('agenda')}
                    >
                        Agenda
                    </button>
                </div>

                <div className={styles.calendarWrapper}>
                    <FullCalendar
                        ref = {calendarRef}
                        key={calendarView}
                        plugins = {[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView={calendarView}
                        initialDate={currentDate}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: ''
                        }}
                        events={events}
                        eventClick={handleEventClick}
                        datesSet={handleDatesSet}
                        height="calc(100vh - 280px)"
                        slotMinTime="07:00:00"
                        slotMaxTime="19:00:00"
                        allDaySlot={false}
                        nowIndicator={true}
                        firstDay={0}
                        hiddenDays={[0, 6]}
                        businessHours={{
                            daysOfWeek: [1, 2, 3, 4, 5],
                            startTime: '07:00',
                            endTime: '19:00',
                        }}
                        eventContent={(eventInfo) => {
                            if (calendarView === 'listWeek') {
                                return (
                                    <div className={styles.listEventContent}>
                                        <div className={styles.listEventTime}>
                                            {format(new Date(eventInfo.event.start), 'h:mm a')}
                                        </div>
                                        <div className={styles.listEventInfo}>
                                            <div className={styles.eventTitle}>{eventInfo.event.title}</div>
                                            <div className={styles.eventDetails}>
                                                <span className={styles.eventPriority}>
                                                    {eventInfo.event.extendedProps.priorityLabel}
                                                </span>
                                                <span className={styles.eventType}>
                                                    {eventInfo.event.extendedProps.consultation_type?.replace('_', ' ') || 'General'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        
                            return (
                                <div className={styles.eventContent}>
                                    <div className={styles.eventTime}>
                                        {format(new Date(eventInfo.event.start), 'h:mm a')}
                                    </div>
                                    <div className={styles.eventTitle}>{eventInfo.event.title}</div>
                                    <div className={styles.eventDetails}>
                                        <span className={styles.eventPriority}>
                                            {eventInfo.event.extendedProps.priorityLabel}
                                        </span>
                                        <span className={styles.eventType}>
                                            {eventInfo.event.extendedProps.consultation_type?.replace('_', ' ') || 'General'}
                                        </span>
                                    </div>
                                </div>
                            );
                        }}
                        
                    />
                    
                </div>
                
            </div>

            <div className={styles.sidePanel}>
                <DayViewPanel
                    appointments={appointments}
                    selectedDate={dayViewDate}
                    onDateChange={handleDayViewDateChange}
                    onAppointmentClick={onAppointmentClick}
                />
            </div>
        </div>

    );
}

export default AppointmentCalendar;