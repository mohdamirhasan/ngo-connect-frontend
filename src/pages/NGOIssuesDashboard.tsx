import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowUpDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { FileWarning } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import apiUrl from "@/api/apiConfig";
import useUserInfo from "@/hooks/useUserInfo";

interface Issue {
  _id: string;
  title: string;
  desc: string;
  resolvedAt: Date;
  location: string;
  imagePath: string;
}

const NGOIssuesDashboard: React.FC = () => {
  const { token } = useAuth();
  const { isLoggedIn } = useUserInfo(token);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [userReports, setUserReports] = useState<Issue[]>([]);

  const [userType, setUserType] = useState<string | null>(null);
    const [user_id, setUser_id] = useState<string | null>(null);
    useEffect(() => {
      setUserType(localStorage.getItem('userType'));
      setUser_id(localStorage.getItem('user_id'));
    }, [isLoggedIn]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/report/fetch`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok) {
          setIssues(result);
        } else {
          console.error("Error: " + (result.message || "Failed to fetch reports"));
        }
      } catch (error) {
        console.error("An error occurred, please try again!" + error);
      }
    };

    const fetchUserReports = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/report/${user_id}/user`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (response.ok) {
          setUserReports(result);
        } else {
          console.error("Error: " + (result.message || "Failed to fetch reports"));
        }
      } catch (error) {
        console.error("An error occurred, please try again!" + error);
      }
    }
    if (token && userType === "ngo") {
      fetchReports();
    }
    else if (token && userType === "user") {
      fetchUserReports();
    }
  }, [userType, user_id, token]);

  const handleResolve = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/api/report/${id}/resolve`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      if (response.ok) {
        alert("Marked as resolved");
        setIssues((prevIssues) =>
          prevIssues.map((issue) =>
            issue._id === id ? { ...issue, resolved: true } : issue
          )
        );

        setSelectedIssue(null); // Close dialog after resolving
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("An error occurred, please try again!" + error);
    }
  };

  return userType === "ngo" ? (
    <div>
      <Navbar />
      <div className="flex-grow p-4 sm:p-6 max-w-5xl mx-auto mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead className="w-[10vw]">Status</TableHead>
                    <TableHead className="w-[10vw]">
                      <div className="flex items-center cursor-pointer">
                        Issue <ArrowUpDown size={16} className="ml-2" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[25vw]">Description</TableHead>
                    <TableHead className="w-[18vw]">Address</TableHead>
                    <TableHead className="w-[10vw]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((issue, index) => (
                    <TableRow key={issue._id}>
                      <TableCell className="text-left">{index + 1}</TableCell>
                      <TableCell className="text-left">
                        <Badge variant={!!issue.resolvedAt ? "secondary" : "destructive"}>
                          {!!issue.resolvedAt ? "Resolved" : "Not Resolved"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-left">{issue.title}</TableCell>
                      <TableCell className="text-left">{issue.desc}</TableCell>
                      <TableCell className="text-left">{issue.location}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button size="sm" onClick={() => setSelectedIssue(issue)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {issues.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        <div className="w-full flex flex-col justify-center items-center p-4">
                          <FileWarning size={48}/>
                          No requests found.
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issue Details Dialog */}
      <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
        <DialogContent className="max-w-lg p-4 sm:p-8">
          {selectedIssue && (
            <Card className="w-full">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-center p-3">
                  {selectedIssue.title}
                </DialogTitle>
                <DialogClose asChild />
              </DialogHeader>
              <CardContent className="flex flex-col items-center">
                {!!selectedIssue.imagePath && (
                  <img
                    src={`http://localhost:5001${selectedIssue.imagePath}`}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    alt="Issue"
                  />
                )}
                <p className="text-gray-700">{selectedIssue.desc}</p>
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Location:</strong> {selectedIssue.location}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button variant="outline" onClick={() => setSelectedIssue(null)} className="w-full">
                  Close
                </Button>
                {!selectedIssue.resolvedAt && (
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                    onClick={() => handleResolve(selectedIssue._id)}
                  >
                    Mark as Resolved
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  ) : (
    <div>
      <Navbar />
      <div className="flex-grow p-4 sm:p-6 max-w-5xl mx-auto mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead className="w-[10vw]">Status</TableHead>
                    <TableHead className="w-[10vw]">
                      <div className="flex items-center cursor-pointer">
                        Issue <ArrowUpDown size={16} className="ml-2" />
                      </div>
                    </TableHead>
                    <TableHead className="w-[25vw]">Description</TableHead>
                    <TableHead className="w-[18vw]">Address</TableHead>
                    <TableHead className="w-[10vw]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userReports.map((issue, index) => (
                    <TableRow key={issue._id}>
                      <TableCell className="text-left">{index + 1}</TableCell>
                      <TableCell className="text-left">
                        <Badge variant={!!issue.resolvedAt ? "secondary" : "destructive"}>
                          {!!issue.resolvedAt ? "Resolved" : "Not Resolved"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-left">{issue.title}</TableCell>
                      <TableCell className="text-left">{issue.desc}</TableCell>
                      <TableCell className="text-left">{issue.location}</TableCell>
                      <TableCell className="flex gap-2">
                        <Button size="sm" onClick={() => setSelectedIssue(issue)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {userReports.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        <div className="w-full flex flex-col justify-center items-center p-4">
                          <FileWarning size={48}/>
                          No requests found.
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issue Details Dialog */}
      <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
        <DialogContent className="max-w-lg p-4 sm:p-8">
          {selectedIssue && (
            <Card className="w-full">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-center p-3">
                  {selectedIssue.title}
                </DialogTitle>
                <DialogClose asChild />
              </DialogHeader>
              <CardContent className="flex flex-col items-center">
                {!!selectedIssue.imagePath && (
                  <img
                    src={`http://localhost:5001${selectedIssue.imagePath}`}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    alt="Issue"
                  />
                )}
                <p className="text-gray-700">{selectedIssue.desc}</p>
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Location:</strong> {selectedIssue.location}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button variant="outline" onClick={() => setSelectedIssue(null)} className="w-full">
                  Close
                </Button>
                {!selectedIssue.resolvedAt && (
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                    onClick={() => handleResolve(selectedIssue._id)}
                  >
                    Mark as Resolved
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
};

export default NGOIssuesDashboard;
