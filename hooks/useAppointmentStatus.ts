import { useAuthManagerStore } from '@/store/useAuthManagerStore';
import { AppointmentStatus, StatusType } from '@/types/types';
import { constructUrl } from '@/utils/utils';
import { useEffect, useState } from 'react';

export const useAppointmentStatus = () => {
  const [appointmentStatuses, setAppointmentStatuses] = useState<
    AppointmentStatus[]
  >([]);

  const { manager } = useAuthManagerStore();

  useEffect(() => {
    manager?.makeAuthorizedRequest('GET', `schedule/statuses`).then((res) => {
      if (res.status === StatusType.SUCCESS) {
        setAppointmentStatuses(res.data.content);
      }
    });
  }, []);

  const getStatus = (status: string) => {
    const statusFound = appointmentStatuses.find(
      (item) => item.status === status
    );
    return statusFound;
  };

  const getColorFromStatus = (status: string): string => {
    const statusFound = getStatus(status);
    return statusFound ? statusFound.color : '';
  };

  const getIconFromStatus = (status: string): string | undefined => {
    const statusFound = getStatus(status);
    return statusFound?.icon
      ? constructUrl(`/images/${statusFound.icon}`)
      : undefined;
  };

  return { getColorFromStatus, getIconFromStatus };
};
