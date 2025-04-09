
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobApplication, fetchApplications } from "@/services/api";
import AddApplicationForm from "@/components/AddApplicationForm";
import ApplicationsList from "@/components/ApplicationsList";
import StatusChart from "@/components/StatusChart";

const Dashboard = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getApplications = async () => {
      setIsLoading(true);
      const data = await fetchApplications();
      setApplications(data);
      setIsLoading(false);
    };

    getApplications();
  }, []);

  const handleAddApplication = (newApplication: JobApplication) => {
    setApplications([...applications, newApplication]);
  };

  const handleUpdateApplication = (updatedApplication: JobApplication) => {
    setApplications(
      applications.map((app) =>
        app._id === updatedApplication._id ? updatedApplication : app
      )
    );
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(applications.filter((app) => app._id !== id));
  };

  // Calculate statistics for the dashboard
  const stats = {
    total: applications.length,
    applied: applications.filter((app) => app.status === "Applied").length,
    interview: applications.filter((app) => app.status === "Interview").length,
    offer: applications.filter((app) => app.status === "Offer").length,
    rejected: applications.filter((app) => app.status === "Rejected").length,
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Student Job Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">Total</CardTitle>
            <CardDescription>All applications</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-blue-600">Applied</CardTitle>
            <CardDescription>Applications submitted</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.applied}</p>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-yellow-600">Interview</CardTitle>
            <CardDescription>In interview stage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.interview}</p>
          </CardContent>
        </Card>
        
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-600">Offers</CardTitle>
            <CardDescription>Received offers</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.offer}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="list">Applications List</TabsTrigger>
              <TabsTrigger value="add">Add New</TabsTrigger>
            </TabsList>
            <TabsContent value="list">
              {isLoading ? (
                <div className="text-center py-8">Loading applications...</div>
              ) : (
                <ApplicationsList 
                  applications={applications} 
                  onUpdateApplication={handleUpdateApplication}
                  onDeleteApplication={handleDeleteApplication}
                />
              )}
            </TabsContent>
            <TabsContent value="add">
              <AddApplicationForm onAddApplication={handleAddApplication} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Distribution by status</CardDescription>
            </CardHeader>
            <CardContent>
              <StatusChart applications={applications} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
