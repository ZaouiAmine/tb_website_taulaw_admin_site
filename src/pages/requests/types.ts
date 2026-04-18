export type LawyerRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status?: number;
  role?: number;
  isEmailVerified?: boolean;
};
