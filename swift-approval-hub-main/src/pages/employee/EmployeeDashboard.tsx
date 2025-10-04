import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Upload, Clock, CheckCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  
  const expenses = [
    {
      id: 1,
      employee: "Sarah",
      description: "Restaurant Bill",
      date: "4th Oct, 2025",
      category: "Food",
      paidBy: "Sarah",
      remarks: "None",
      amount: "5000 rs",
      status: "Draft",
    },
    {
      id: 2,
      employee: "Sarah",
      description: "Taxi Fare",
      date: "3rd Oct, 2025",
      category: "Transport",
      paidBy: "Sarah",
      remarks: "Airport",
      amount: "1200 rs",
      status: "Submitted",
    },
  ];

  const stats = [
    { label: "To Submit", value: "5467 rs", icon: FileText, color: "text-muted-foreground" },
    { label: "Waiting Approval", value: "33674 rs", icon: Clock, color: "text-warning" },
    { label: "Approved", value: "500 rs", icon: CheckCircle, color: "text-success" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Employee Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your expenses</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/login")}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Expenses Table */}
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">My Expenses</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/employee/upload-receipt")}>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
              <Button onClick={() => navigate("/employee/new-expense")} className="bg-primary hover:bg-primary-hover text-primary-foreground">
                <FileText className="w-4 h-4 mr-2" />
                New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Employee</TableHead>
                    <TableHead className="font-semibold">Description</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Paid By</TableHead>
                    <TableHead className="font-semibold">Remarks</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id} className="cursor-pointer hover:bg-muted/30" onClick={() => navigate(`/employee/expense/${expense.id}`)}>
                      <TableCell className="font-medium">{expense.employee}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell className="text-muted-foreground">{expense.date}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell className="text-muted-foreground">{expense.paidBy}</TableCell>
                      <TableCell className="text-muted-foreground">{expense.remarks}</TableCell>
                      <TableCell className="font-semibold">{expense.amount}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          expense.status === "Draft" 
                            ? "bg-muted text-muted-foreground" 
                            : "bg-warning/10 text-warning"
                        }`}>
                          {expense.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground text-center">
          The expenses which are still at draft state and are not finally approved by manager are still visible to the employee and the submit button will be invisible and state will be pending approval.
        </p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
