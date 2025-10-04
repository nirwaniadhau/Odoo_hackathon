import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, LogOut, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [comment, setComment] = useState("");
  // 👇 Company base currency
  const BASE_CURRENCY = "USD";

  // const [approvals, setApprovals] = useState([
  //   {
  //     id: 1,
  //     subject: "none",
  //     requestOwner: "Sarah",
  //     category: "Food",
  //     requestStatus: "Approved",
  //     originalAmount: "567 $ (in INR)",
  //     convertedAmount: "49896",
  //   },
  // ]);

  // 👇 Convert all expenses automatically when component loads
  useEffect(() => {
    const updateConversions = async () => {
      const updated = await Promise.all(
        approvals.map(async (a) => {
          const converted = await convertCurrency(a.amount, a.currency, BASE_CURRENCY);
          return {
            ...a,
            convertedAmount: `${converted.toFixed(2)} ${BASE_CURRENCY}`,
            originalAmount: `${a.amount} ${a.currency}`,
          };
        })
      );
      setApprovals(updated);
    };

    updateConversions();
  }, []);


  // 👇 Function to convert currency using real-time API
  const convertCurrency = async (amount: number, from: string, to: string) => {
    try {
      const res = await axios.get(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
      // return res.data.result;
      return (res.data as any).result;

    } catch (error) {
      console.error("Currency conversion failed:", error);
      return amount; // fallback if API fails
    }
  };


  const [approvals, setApprovals] = useState([
    {
      id: 1,
      subject: "none",
      requestOwner: "Sarah",
      category: "Food",
      requestStatus: "Pending",
      amount: 567,          // raw amount
      currency: "INR",      // currency fetched from expense
      convertedAmount: "",  // will be auto-filled
      originalAmount: "",   // for UI display
    },
  ]);


  const handleApprove = (id: number) => {
    const approval = approvals.find(a => a.id === id);
    if (!approval) return;

    toast.success(`Expense approved successfully for ${approval.requestOwner}`);
    const updated = approvals.map(a =>
      a.id === id ? { ...a, requestStatus: "Approved" } : a
    );
    setApprovals(updated);
    setSelectedExpense(null);
    setComment("");
  };

  const handleReject = (id: number) => {
    if (!comment.trim()) {
      toast.error("Please add a comment for rejection");
      return;
    }

    const approval = approvals.find(a => a.id === id);
    if (!approval) return;

    toast.error(`Expense rejected for ${approval.requestOwner}`);
    const updated = approvals.map(a =>
      a.id === id ? { ...a, requestStatus: "Rejected", rejectionComment: comment } : a
    );
    setApprovals(updated);
    setSelectedExpense(null);
    setComment("");
  };

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
              <h1 className="text-xl font-bold text-foreground">Manager Dashboard</h1>
              <p className="text-sm text-muted-foreground">Review and approve expenses</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/login")}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Approvals to Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Approval Subject</TableHead>
                    <TableHead className="font-semibold">Request Owner</TableHead>
                    <TableHead className="font-semibold">Category</TableHead>
                    <TableHead className="font-semibold">Request Status</TableHead>
                    <TableHead className="font-semibold">Total Amount (in company's currency)</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell className="font-medium">{approval.subject}</TableCell>
                      <TableCell>{approval.requestOwner}</TableCell>
                      <TableCell>{approval.category}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${approval.requestStatus === "Approved"
                            ? "bg-success/10 text-success"
                            : approval.requestStatus === "Rejected"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-warning/10 text-warning"
                          }`}>
                          {approval.requestStatus}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">
                        <div className="flex flex-col">
                          <span>{approval.convertedAmount}</span>
                          <span className="text-xs text-muted-foreground">{approval.originalAmount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-success hover:bg-success/90 text-white"
                            onClick={() => handleApprove(approval.id)}
                            disabled={approval.requestStatus === "Approved" || approval.requestStatus === "Rejected"}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                            onClick={() => setSelectedExpense(approval)}
                            disabled={approval.requestStatus === "Approved" || approval.requestStatus === "Rejected"}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              Once the expense is approved/rejected by manager that record should become readonly, the status should get set in request status field and the buttons should become invisible.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rejection Dialog */}
      <Dialog open={!!selectedExpense} onOpenChange={() => setSelectedExpense(null)}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="text-foreground">Reject Expense</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Please provide a reason for rejecting this expense claim.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Request Owner:</span> {selectedExpense?.requestOwner}
              </p>
              <p className="text-sm">
                <span className="font-medium">Category:</span> {selectedExpense?.category}
              </p>
              <p className="text-sm">
                <span className="font-medium">Amount:</span> {selectedExpense?.convertedAmount}
              </p>
            </div>
            <Textarea
              placeholder="Enter rejection reason..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedExpense(null)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={() => handleReject(selectedExpense?.id)}
                className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                Confirm Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerDashboard;
