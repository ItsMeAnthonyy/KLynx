import React from 'react';
import { format, addDays, subDays, startOfDay, isToday, parse } from 'date-fns';
import styles from './dayViewPanel.module.css';
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const STATUS_COLORS = {
  pending: '#F59E0B',
  scheduled: '#10B981',
  late: '#F97316',
  completed: '#6B7280',
  cancelled: '#EF4444'
};



const dayViewPanel = ({ appointments, selectedDate, onDateChange, onAppointmentClick }) => {
    const parseDBDate = (str) => {
        return parse(str, "yyyy-MM-dd HH:mm:ss", new Date());
    };

    const roundTo30 = (date) => {
        const d = new Date(date);
        const mins = d.getMinutes();

        if (mins < 15) d.setMinutes(0);
        else if (mins < 45) d.setMinutes(30);
        else {
            d.setMinutes(0);
            d.setHours(d.getHours() + 1);
        }

        d.setSeconds(0);
        d.setMilliseconds(0);
        return d;
    };

    const dayAppointments = appointments.filter(apt => {
        const parsed = parseDBDate(apt.scheduled_time);
        const aptDate = startOfDay(parsed);
        const selected = startOfDay(selectedDate);
        return aptDate.getTime() === selected.getTime();
    });

    const handlePrevDay = () => {
        onDateChange(subDays(selectedDate, 1));
    };

    const handleNextDay = () => {
        onDateChange(addDays(selectedDate, 1));
    };

    const handleToday = () => {
        onDateChange(new Date());
    };

    // Generate time slots from 7am to 7pm in 12-hour format
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 7; hour < 19; hour++) {

            // Create a date object for this hour to ensure consistent formatting
            const hourDate = new Date();
            hourDate.setHours(hour, 0, 0, 0);
            slots.push(format(hourDate, 'h:mma'));

            hourDate.setMinutes(30);
            slots.push(format(hourDate, 'h:mma'));
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const getAppointmentForSlot = (slot) => {
        return dayAppointments.find((apt) => {
            const parsed = parseDBDate(apt.scheduled_time);
            const rounded = roundTo30(parsed);
            const aptTime = format(rounded, "h:mma");
            return aptTime === slot;
        });
    };

    return (
        <div className={styles.dayPanel}>
            <div className={styles.header}>
                <div className={styles.navigation}>
                    <button onClick={handlePrevDay} className={styles.navBtn} title="Previous Day">
                        <BiChevronLeft size={20} />
                    </button>
                    <button onClick={handleToday} className={styles.todayBtn}>
                        Today
                    </button>
                    <button onClick={handleNextDay} className={styles.navBtn} title="Next Day">
                        <BiChevronRight size={20} />
                    </button>
                </div>
                <div className={styles.dateDisplay}>
                    <div className={styles.dayName}>{format(selectedDate, 'EEEE')}</div>
                    <div className={styles.dateNumber}>{format(selectedDate, 'dd')}</div>
                    <div className={styles.monthYear}>{format(selectedDate, 'MMMM yyyy')}</div>
                </div>
                {isToday(selectedDate) && <div className={styles.todayBadge}>Today</div>}
            </div>

            <div className={styles.timetable}>
                {timeSlots.map((slot) => {

                    const appointment = getAppointmentForSlot(slot);
                    return (
                        <div key={slot} className={styles.timeSlot}>
                            <div className={styles.timeLabel}>{slot}</div>
                            <div className={styles.slotContent}>
                                {appointment ? (
                                    <div
                                        className={styles.appointment}
                                        style={{
                                            borderLeftColor: STATUS_COLORS[appointment.status] || '#10B981',
                                            backgroundColor: `${STATUS_COLORS[appointment.status]}15` || '#10B98115'
                                        }}
                                        onClick={() => onAppointmentClick(appointment)}
                                    >
                                        <div className={styles.appointmentTime}>
                                            {format(new Date(appointment.scheduled_time), 'h:mm a')}
                                        </div>
                                        <div className={styles.appointmentPatient}>
                                            {appointment.patient_name || 'Unknown Patient'}
                                        </div>
                                        <div className={styles.appointmentType}>
                                            {appointment.consultation_type?.replace('_', ' ') || 'General'}
                                        </div>
                                        <div className={styles.appointmentStatus}>
                                            <span className={styles.statusBadge} style={{ backgroundColor: STATUS_COLORS[appointment.status] }}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.emptySlot}></div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default dayViewPanel;