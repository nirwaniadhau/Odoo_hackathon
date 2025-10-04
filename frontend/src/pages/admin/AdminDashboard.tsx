import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, FileCheck, Clock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";


interface User {
  id: string;
  name: string;
  role: string;
  manager?: string;
  managerId?: string;
  email: string;
}


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    name: "",
    role: "",
    manager: "",
    managerId: "",
    email: ""
  });

  const token = localStorage.getItem("token") || "";

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/employees`, {
        method: "GET", // GET request to fetch all employees
        headers: { Authorization: `Bearer ${token}` }, // attach token
      });
      const data = await res.json();
      if (res.ok) {
        const mappedUsers: User[] = data.users.map((u: any) => ({
          id: u._id,
          name: u.username,
          role: u.role,
          manager: u.manager?.username || "",
          managerId: u.manager?._id || "",
          email: u.email
        }));
        setUsers(mappedUsers);
      } else {
        toast.error(data.msg || "Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };



  useEffect(() => {
    fetchUsers();
  }, []);

  const managers = users.filter(u => u.role === "Manager");

  // Add new user
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Name and email are required");
      return;
    }
    if (!newUser.role) {
      toast.error("Please select a role");
      return;
    }
    if (newUser.role === "Employee" && !newUser.managerId) {
      toast.error("Please assign a manager for employees");
      return;
    }

    try {
      const payload = {
        username: newUser.name,
        email: newUser.email,
        role: newUser.role,
        manager_id: newUser.role === "Employee" ? newUser.managerId : null,
      };

      const res = await fetch(`${API_BASE}/auth/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });


      const data = await res.json();

      if (res.ok) {
        toast.success(data.msg);
        fetchUsers(); // refresh the list
        setNewUser({ name: "", role: "", manager: "", managerId: "", email: "" });
      } else {
        toast.error(data.msg || "Error creating user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };


  // Delete user
  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/delete-employee/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.msg);
        fetchUsers();
      } else {
        toast.error(data.msg || "Error deleting user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // Send password email
  const handleSendPassword = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/resend-password/${id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.msg);
      } else {
        toast.error(data.msg || "Error sending password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Odoo Expense Management</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin/approval-rules")}>
              Approval Rules
            </Button>
            <Button variant="outline" onClick={() => navigate("/admin/analytics")}>
              Analytics
            </Button>
            <Button variant="outline" onClick={() => navigate("/login")}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{users.length}</div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Approval Rules</CardTitle>
              <FileCheck className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">3</div>
            </CardContent>
          </Card>
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12</div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-border">
          <Button variant="ghost" className="border-b-2 border-primary text-primary">
            <Users className="w-4 h-4 mr-2" />
            User Management
          </Button>
          <Button variant="ghost" onClick={() => navigate("/admin/approval-rules")}>
            <FileCheck className="w-4 h-4 mr-2" />
            Approval Rules
          </Button>
        </div>

        {/* User Management Section */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Manager</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Add New User Row */}
                  <TableRow className="bg-muted/30">
                    <TableCell>
                      <Input
                        placeholder="Enter name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                        className="bg-background"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={newUser.role}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, role: value, manager: "", managerId: "" })
                        }
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border z-50">
                          <SelectItem value="Employee">Employee</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {newUser.role === "Employee" ? (
                        <Select
                          value={newUser.manager}
                          onValueChange={(value) => {
                            const selectedManager = managers.find((m) => m.name === value);
                            setNewUser({
                              ...newUser,
                              manager: value,
                              managerId: selectedManager?.id || "",
                            });
                          }}
                        >
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Assign manager" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border z-50">
                            {managers.map((manager) => (
                              <SelectItem key={manager.id} value={manager.name}>
                                {manager.name} ({manager.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        placeholder="Enter email"
                        type="email"
                        value={newUser.email}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        className="bg-background"
                      />
                    </TableCell>
                    <TableCell>
                      <Button onClick={handleAddUser} size="sm" className="w-full">
                        Add User
                      </Button>
                    </TableCell>
                  </TableRow>

                  {/* Existing Users */}
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>{user.manager || "-"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleSendPassword(user.id)}>
                            Send Password
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
