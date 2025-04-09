
import { toast } from "sonner";

export interface JobApplication {
  _id?: string;
  company: string;
  role: string;
  status: "Applied" | "Interview" | "Offer" | "Rejected";
  applicationDate: string;
  link?: string;
}

// For development, we'll use a placeholder URL
// In production, this would be replaced with the actual backend URL
const API_URL = "https://your-backend-url.com/api";

export const fetchApplications = async (): Promise<JobApplication[]> => {
  try {
    // For initial frontend development, return mock data
    // Later, this will be replaced with actual API calls
    return mockApplications;
  } catch (error) {
    toast.error("Failed to fetch applications");
    console.error("Error fetching applications:", error);
    return [];
  }
};

export const addApplication = async (application: Omit<JobApplication, "_id">): Promise<JobApplication> => {
  try {
    // For initial frontend development, return the application with a mock ID
    // Later, this will be replaced with actual API calls
    const newApplication = {
      ...application,
      _id: Date.now().toString(),
    };
    
    toast.success("Application added successfully");
    return newApplication;
  } catch (error) {
    toast.error("Failed to add application");
    console.error("Error adding application:", error);
    throw error;
  }
};

export const updateApplication = async (application: JobApplication): Promise<JobApplication> => {
  try {
    // For initial frontend development, return the updated application
    // Later, this will be replaced with actual API calls
    toast.success("Application updated successfully");
    return application;
  } catch (error) {
    toast.error("Failed to update application");
    console.error("Error updating application:", error);
    throw error;
  }
};

export const deleteApplication = async (id: string): Promise<void> => {
  try {
    // For initial frontend development, just return
    // Later, this will be replaced with actual API calls
    toast.success("Application deleted successfully");
    return;
  } catch (error) {
    toast.error("Failed to delete application");
    console.error("Error deleting application:", error);
    throw error;
  }
};

// Mock data for initial development
const mockApplications: JobApplication[] = [
  {
    _id: "1",
    company: "Google",
    role: "Software Engineer Intern",
    status: "Applied",
    applicationDate: "2025-02-15",
    link: "https://careers.google.com"
  },
  {
    _id: "2",
    company: "Microsoft",
    role: "Frontend Developer",
    status: "Interview",
    applicationDate: "2025-03-01",
    link: "https://careers.microsoft.com"
  },
  {
    _id: "3",
    company: "Amazon",
    role: "Full Stack Developer",
    status: "Rejected",
    applicationDate: "2025-01-10",
    link: "https://amazon.jobs"
  },
  {
    _id: "4",
    company: "Apple",
    role: "UI/UX Designer",
    status: "Offer",
    applicationDate: "2025-02-20",
    link: "https://apple.com/careers"
  },
  {
    _id: "5",
    company: "Facebook",
    role: "React Developer",
    status: "Applied",
    applicationDate: "2025-03-05",
    link: "https://facebook.com/careers"
  }
];
