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
