import { ObjectId } from 'mongodb';

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
  _id?: string; // MongoDB's primary key
  name: string;
  email: string;
  date: string;
  time: string;
  riskScore?: number;
  userId?: string;
}

// Mock User for local storage auth
export interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}
