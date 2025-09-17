export type Resource = {
  id: string;
  name: string;
  category: string;
  description: string;
  services: string[];
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  icon: React.ComponentType<{ className?: string }>;
};

export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface Appointment {
  id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  riskScore?: number;
  userId?: string;
}
