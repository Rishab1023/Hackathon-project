import type { Resource } from "@/lib/types";
import { Users, Heart, Phone, University } from "lucide-react";

export const resources: Resource[] = [
  {
    id: "1",
    name: "Campus Counseling Center",
    category: "On-Campus",
    description: "Confidential counseling services for all registered students.",
    services: [
      "Individual Therapy",
      "Group Therapy",
      "Stress Management Workshops",
      "24/7 Crisis Line",
    ],
    contact: {
      phone: "123-456-7890",
      email: "counseling@university.edu",
      website: "counseling.university.edu",
    },
    icon: University,
  },
  {
    id: "2",
    name: "National Suicide Prevention Lifeline",
    category: "National",
    description: "Free and confidential support for people in distress, prevention and crisis resources for you or your loved ones.",
    services: [
      "24/7 Call & Text Support",
      "Online Chat",
      "Resources for Veterans",
    ],
    contact: {
      phone: "988",
      website: "988lifeline.org",
    },
    icon: Phone,
  },
  {
    id: "3",
    name: "Youth Help Line",
    category: "National",
    description: "The world's largest suicide prevention and crisis intervention organization for young people.",
    services: [
      "24/7 Call, Text & Chat",
      "Online Community",
      "Advocacy Programs",
    ],
    contact: {
      phone: "1-866-488-7386",
      website: "thetrevorproject.org",
    },
    icon: Heart,
  },
   {
    id: "4",
    name: "Peer Support Network",
    category: "Peer Support",
    description: "Connect with trained peer volunteers who can offer a listening ear and share their own experiences.",
    services: [
      "One-on-one Peer Chat",
      "Support Groups",
      "Community Events",
    ],
    contact: {
      website: "/chat", // Fictional internal link
    },
    icon: Users,
  },
];
