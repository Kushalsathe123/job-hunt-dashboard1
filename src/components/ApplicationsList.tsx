
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { JobApplication, updateApplication, deleteApplication } from "@/services/api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash, ExternalLink, Filter } from "lucide-react";

interface ApplicationsListProps {
  applications: JobApplication[];
  onUpdateApplication: (application: JobApplication) => void;
  onDeleteApplication: (id: string) => void;
}

const ApplicationsList = ({ applications, onUpdateApplication, onDeleteApplication }: ApplicationsListProps) => {
  const [filteredStatus, setFilteredStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Application being edited
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  
  // List filtering and sorting logic
  const filteredApplications = applications
    .filter((app) => {
      // Filter by status
      if (filteredStatus && filteredStatus !== "all" && app.status !== filteredStatus) {
        return false;
      }
      
      // Search by company or role
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          app.company.toLowerCase().includes(term) ||
          app.role.toLowerCase().includes(term)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort logic
      switch (sortBy) {
        case "date-asc":
          return new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
        case "date-desc":
          return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
        case "company-asc":
          return a.company.localeCompare(b.company);
        case "company-desc":
          return b.company.localeCompare(a.company);
        default:
          return 0;
      }
    });

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id);
      onDeleteApplication(id);
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: "Applied" | "Interview" | "Offer" | "Rejected") => {
    const application = applications.find((app) => app._id === id);
    if (!application) return;

    try {
      const updatedApplication = { ...application, status: newStatus };
      const result = await updateApplication(updatedApplication);
      onUpdateApplication(result);
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApplication) return;

    try {
      const result = await updateApplication(editingApplication);
      onUpdateApplication(result);
      setEditingApplication(null);
    } catch (error) {
      console.error("Error updating application:", error);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Applied":
        return "status-applied";
      case "Interview":
        return "status-interview";
      case "Offer":
        return "status-offer";
      case "Rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 pb-4">
        <div className="flex-1">
          <Input
            placeholder="Search by company or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filteredStatus} onValueChange={setFilteredStatus}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Applied">Applied</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Offer">Offer</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Date (Newest)</SelectItem>
              <SelectItem value="date-asc">Date (Oldest)</SelectItem>
              <SelectItem value="company-asc">Company (A-Z)</SelectItem>
              <SelectItem value="company-desc">Company (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-500">No applications found. Try adjusting your filters.</p>
        </div>
      ) : (
        filteredApplications.map((application) => (
          <Card key={application._id} className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{application.company}</h3>
                  <p className="text-gray-600">{application.role}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusClass(application.status)}`}>
                      {application.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Applied: {new Date(application.applicationDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 self-end md:self-auto">
                  {application.link && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={application.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" onClick={() => setEditingApplication(application)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Application</DialogTitle>
                      </DialogHeader>
                      {editingApplication && (
                        <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-company">Company</Label>
                            <Input
                              id="edit-company"
                              value={editingApplication.company}
                              onChange={(e) =>
                                setEditingApplication({
                                  ...editingApplication,
                                  company: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-role">Role</Label>
                            <Input
                              id="edit-role"
                              value={editingApplication.role}
                              onChange={(e) =>
                                setEditingApplication({
                                  ...editingApplication,
                                  role: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-status">Status</Label>
                            <Select
                              value={editingApplication.status}
                              onValueChange={(value) =>
                                setEditingApplication({
                                  ...editingApplication,
                                  status: value as "Applied" | "Interview" | "Offer" | "Rejected",
                                })
                              }
                            >
                              <SelectTrigger id="edit-status">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Applied">Applied</SelectItem>
                                <SelectItem value="Interview">Interview</SelectItem>
                                <SelectItem value="Offer">Offer</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-date">Application Date</Label>
                            <Input
                              id="edit-date"
                              type="date"
                              value={editingApplication.applicationDate}
                              onChange={(e) =>
                                setEditingApplication({
                                  ...editingApplication,
                                  applicationDate: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-link">Link</Label>
                            <Input
                              id="edit-link"
                              value={editingApplication.link || ""}
                              onChange={(e) =>
                                setEditingApplication({
                                  ...editingApplication,
                                  link: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="flex justify-end pt-2">
                            <Button type="submit">Save Changes</Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Select 
                    value={application.status}
                    onValueChange={(value) => 
                      handleStatusChange(
                        application._id as string, 
                        value as "Applied" | "Interview" | "Offer" | "Rejected"
                      )
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Applied">Applied</SelectItem>
                      <SelectItem value="Interview">Interview</SelectItem>
                      <SelectItem value="Offer">Offer</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this job application? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(application._id as string)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ApplicationsList;
