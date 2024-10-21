import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { AppointmentStatus, StatusType } from '@/types/types';
import { constructUrl } from '@/utils/utils';
import { useEffect, useState } from 'react';

/**
 * Custom hook to manage appointment statuses.
 * Fetches appointment statuses from the server and provides utility functions
 * to get color and icon based on the status.
 *
 * @returns {Object} An object containing functions to get color and icon from status.
 */
export const useAppointmentStatus = () => {
  const [appointmentStatuses, setAppointmentStatuses] = useState<
    AppointmentStatus[]
  >([]);

  const { manager } = useAuthManagerStore();

  useEffect(() => {
    // Fetch appointment statuses when the component mounts
    manager?.makeAuthorizedRequest('GET', `schedule/statuses`).then((res) => {
      if (res.status === StatusType.SUCCESS) {
        setAppointmentStatuses(res.data.content);
      }
    });
  }, [manager]);

  /**
   * Finds the appointment status object based on the status string.
   *
   * @param {string} status - The status string to search for.
   * @returns {AppointmentStatus | undefined} The appointment status object if found, otherwise undefined.
   */
  const getStatus = (status: string): AppointmentStatus | undefined => {
    return appointmentStatuses.find((item) => item.status === status);
  };

  /**
   * Gets the color associated with a given status.
   *
   * @param {string} status - The status string to get the color for.
   * @returns {string} The color associated with the status, or an empty string if not found.
   */
  const getColorFromStatus = (status: string): string => {
    const statusFound = getStatus(status);
    return statusFound ? statusFound.color : '';
  };

  /**
   * Gets the icon URL associated with a given status.
   *
   * @param {string} status - The status string to get the icon for.
   * @returns {string | undefined} The URL of the icon associated with the status, or undefined if not found.
   */
  const getIconFromStatus = (status: string): string | undefined => {
    const statusFound = getStatus(status);
    return statusFound?.icon
      ? constructUrl(`/images/${statusFound.icon}`)
      : undefined;
  };

  /**
   * Gets the status description from the status code.
   * @param {string} status - The status code.
   * @returns {string} The status description.
   */
  const getStatusFromCode = (status: string): string => {
    const statusFound = getStatus(status);
    return statusFound ? statusFound.description : status;
  };

  return { getColorFromStatus, getIconFromStatus, getStatusFromCode };
};
