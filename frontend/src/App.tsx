import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ApprovalRules from "./pages/admin/ApprovalRules";
import Analytics from "./pages/admin/Analytics";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import NewExpense from "./pages/employee/NewExpense";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/approval-rules" element={<ApprovalRules />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/employee/new-expense" element={<NewExpense />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
