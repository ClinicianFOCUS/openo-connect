import { Appointment } from "@/types/types";

/**
 * Splits the appointment history into past and upcoming appointments.
 *
 * @param {Array} appointmentHistory - The list of appointments to be split.
 * Each appointment should have an `appointmentDate` and `startTime` property.
 *
 * @returns {Object} An object containing two arrays:
 * - `pastAppointments`: Appointments that have already occurred.
 * - `upcomingAppointments`: Appointments that are scheduled for the future.
 *
 * The function categorizes appointments based on their date and time.
 * Past appointments are those with a date and time earlier than the current date and time.
 * Upcoming appointments are those with a date and time later than the current date and time.
 *
 * The upcoming appointments are sorted in ascending order by date and time.
 *
 * The function updates the state with the categorized appointments using `setPastAppointments` and `setUpcomingAppointments`.
 */
export const splitAppointments = (appointmentHistory: Appointment[]) => {
  const pastAppointments: Appointment[] = [];
  const upcomingAppointments: Appointment[] = [];

  appointmentHistory.forEach((appointment) => {
    let appointmentDateTime;
    if (appointment.date) {
      appointmentDateTime = new Date(appointment.date);
    } else {
      appointmentDateTime = new Date(
        `${appointment.appointmentDate} ${appointment.startTime}`
      );
    }
    if (appointmentDateTime < new Date()) {
      pastAppointments.push(appointment);
    } else {
      upcomingAppointments.push(appointment);
    }
  });

  // Sort upcoming appointments by date and time in descending order
  upcomingAppointments.sort((a, b) => {
    const dateA = new Date(`${a.appointmentDate} ${a.startTime}`);
    const dateB = new Date(`${b.appointmentDate} ${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  return { pastAppointments, upcomingAppointments };
};
