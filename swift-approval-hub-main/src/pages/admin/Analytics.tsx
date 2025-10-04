import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, FileText, TrendingUp, Users, CheckCircle, Clock, DollarSign, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const Analytics = () => {
  const navigate = useNavigate();

  // Sample data - in production, this would come from your backend
  const expensesByCategory = [
    { name: "Food", value: 45000, color: "hsl(var(--primary))" },
    { name: "Travel", value: 78000, color: "hsl(var(--success))" },
    { name: "Supplies", value: 23000, color: "hsl(var(--warning))" },
    { name: "Equipment", value: 56000, color: "hsl(var(--accent-foreground))" },
    { name: "Others", value: 18000, color: "hsl(var(--muted-foreground))" },
  ];

  const monthlyTrends = [
    { month: "Jan", submitted: 65000, approved: 58000, rejected: 7000 },
    { month: "Feb", submitted: 72000, approved: 68000, rejected: 4000 },
    { month: "Mar", submitted: 85000, approved: 78000, rejected: 7000 },
    { month: "Apr", submitted: 95000, approved: 88000, rejected: 7000 },
    { month: "May", submitted: 88000, approved: 82000, rejected: 6000 },
    { month: "Jun", submitted: 92000, approved: 87000, rejected: 5000 },
  ];

  const topEmployees = [
    { name: "Sarah Johnson", amount: 45000 },
    { name: "Mike Chen", amount: 38000 },
    { name: "Emily Davis", amount: 32000 },
    { name: "Alex Kumar", amount: 28000 },
    { name: "Lisa Wang", amount: 25000 },
  ];

  const totalExpenses = 220000;
  const totalApproved = 168000;
  const totalPending = 32000;
  const totalRejected = 20000;
  const reimbursementDone = 145000;
  const reimbursementPending = 23000;
  const avgApprovalTime = "2.3 days";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Analytics Dashboard</h1>
              <p className="text-sm text-muted-foreground">Company-wide expense insights</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/admin")}>
              Back to Admin
            </Button>
            <Button variant="outline" onClick={() => navigate("/login")}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹{totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">All submitted requests</p>
            </CardContent>
          </Card>

          <Card className="border-success/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₹{totalApproved.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{((totalApproved/totalExpenses)*100).toFixed(1)}% approval rate</p>
            </CardContent>
          </Card>

          <Card className="border-warning/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">₹{totalPending.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Avg Approval Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{avgApprovalTime}</div>
              <p className="text-xs text-muted-foreground mt-1">Average processing time</p>
            </CardContent>
          </Card>
        </div>

        {/* Reimbursement Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reimbursement Done</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₹{reimbursementDone.toLocaleString()}</div>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div className="bg-success h-2 rounded-full" style={{ width: `${(reimbursementDone/(reimbursementDone + reimbursementPending))*100}%` }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Reimbursement Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">₹{reimbursementPending.toLocaleString()}</div>
              <div className="mt-2 w-full bg-muted rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: `${(reimbursementPending/(reimbursementDone + reimbursementPending))*100}%` }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Expenses by Category */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="hsl(var(--primary))"
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-foreground">Monthly Expense Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="submitted" stroke="hsl(var(--primary))" strokeWidth={2} />
                  <Line type="monotone" dataKey="approved" stroke="hsl(var(--success))" strokeWidth={2} />
                  <Line type="monotone" dataKey="rejected" stroke="hsl(var(--destructive))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Employees by Spend */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Employees by Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topEmployees}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)"
                  }} 
                />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
