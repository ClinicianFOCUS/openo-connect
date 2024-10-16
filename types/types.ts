export enum CustomKeyType {
  CLIENT_KEY = 'client_key',
  CLIENT_SECRET = 'client_secret',
  O19_BASE_URL = 'o19_base_url',
  ACCESS_TOKEN = 'access_token',
  SECRET_KEY = 'secret_key',
  USERNAME = 'username',
  PASSWORD = 'password',
  PIN = 'pin',
}

export enum StatusType {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type CustomResponse = {
  status: StatusType;
  message: string;
  code?: number;
  data?: any;
};

export type Appointment = {
  id: number;
  demographicNo: number;
  appointmentNo: number;
  name: string;
  status: string;
  startTime: string;
  reason: string;
  duration: string;
  type: string;
  notes: string;
  date: string;
  appointmentDate: string;
};

export type AppointmentStatus = {
  id: number;
  status: string;
  description: string;
  color: string;
  icon: string;
  active: number;
  editable: number;
  shortLetters: string;
  shortLetterColour: string;
};

type Address = {
  address: string;
  city: string;
  province: string;
  postal: string;
};

type Age = {
  years: number;
};

export type PatientDetail = {
  firstName: string;
  lastName: string;
  sex: string;
  dobYear: number;
  dobMonth: number;
  dobDay: number;
  age: Age;
  address: Address;
  phone: string;
  email: string;
  hin: string;
};

/**
 * Column configuration type.
 * @interface {Object} ColumnConfig
 * @property {string} header - The header text for the column.
 * @property {string} accessor - The key to access the data in the item.
 * @property {(item: any) => React.ReactNode} [render] - Optional render function for custom rendering.
 */
export interface ColumnConfig {
  header: string;
  accessor: keyof Appointment;
  render?: (item: Appointment) => React.ReactNode;
}
