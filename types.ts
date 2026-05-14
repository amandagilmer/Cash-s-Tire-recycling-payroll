
export enum EmploymentType {
  W2 = 'W2',
  CONTRACTOR = 'Contractor'
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ssn: string;
  address: string;
  hourlyRate: number;
  defaultTireRate: number;
  type: EmploymentType;
  joinedDate: string;
}

export interface PayPeriod {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  year: number;
  hoursWorked: number;
  overtimeHours: number;
  tireCount: number;
  commissionPay: number;
  tireRateUsed: number;
  christmasBonus: number; // Added tracking for bonuses
  grossPay: number;
  taxWithheld: number;
  netPay: number;
  status: 'Draft' | 'Paid';
}

export interface BusinessProfile {
  name: string;
  ein: string;
  address: string;
}
