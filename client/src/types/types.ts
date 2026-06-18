export interface BirthdayPerson {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BirthdayInput {
  firstName: string;
  lastName: string;
  birthDate: string;
}

export interface BirthdaysResponse {
  people: BirthdayPerson[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface TodayBirthdaysResponse {
  people: BirthdayPerson[];
}