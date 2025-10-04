import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NewExpense = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    expenseDate: "",
    category: "",
    paidBy: "",
    currency: "USD",
    amount: "",
    remarks: "",
  });

  const [receipt, setReceipt] = useState<File | null>(null);

  // const currencies = ["USD", "EUR", "GBP", "INR", "JPY"];
  const [currencies, setCurrencies] = useState<string[]>([]);

  const categories = ["Food", "Transport", "Accommodation", "Office Supplies", "Miscellaneous"];

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=currencies")
      .then((res) => res.json())
      .then((data) => {
        const uniqueCurrencies = new Set<string>();
        data.forEach((country: any) => {
          if (country.currencies) {
            Object.keys(country.currencies).forEach((curr) => uniqueCurrencies.add(curr));
          }
        });
        setCurrencies(Array.from(uniqueCurrencies).sort());
      })
      .catch((err) => console.error("Error fetching currencies:", err));
  }, []);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
      toast.info("OCR processing receipt...");
      // Simulate OCR extraction
      setTimeout(() => {
        setFormData({
          ...formData,
          amount: "567",
          description: "Restaurant Bill",
        });
        toast.success("Receipt details extracted via OCR");
      }, 1500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Expense submitted for approval");
    navigate("/employee");
  };

  const handleDraft = () => {
    toast.info("Expense saved as draft");
    navigate("/employee");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/employee")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">New Expense</h1>
            <p className="text-sm text-muted-foreground">Create a new expense claim</p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Expense Details</CardTitle>
              <div className="flex gap-2 items-center text-sm">
                <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium">Draft</span>
                <span className="text-muted-foreground">→</span>
                <span className="px-3 py-1 rounded-full bg-warning/10 text-warning font-medium">Waiting Approval</span>
                <span className="text-muted-foreground">→</span>
                <span className="px-3 py-1 rounded-full bg-success/10 text-success font-medium">Approved</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Receipt Upload */}
              <div className="space-y-2">
                <Label>Attach Receipt</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    id="receipt"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="receipt" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {receipt ? receipt.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      OCR will auto-extract amount and details
                    </p>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expenseDate">Expense Date</Label>
                  <Input
                    id="expenseDate"
                    type="date"
                    value={formData.expenseDate}
                    onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paidBy">Paid by</Label>
                  <Select value={formData.paidBy} onValueChange={(value) => setFormData({ ...formData, paidBy: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payer" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      <SelectItem value="self">Self</SelectItem>
                      <SelectItem value="company">Company Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="currency">Total amount in currency selection</Label>
                  <div className="flex gap-2">
                    <Combobox
                      options={currencies.map((curr) => ({ value: curr, label: curr }))}
                      value={formData.currency}
                      onValueChange={(value) => setFormData({ ...formData, currency: value })}
                    />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="567"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Employee can submit expense in any currency (currency in which he spent the money in receipt)
                  </p>
                </div> */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Total amount in currency selection</Label>
                    <div className="flex gap-2">
                      {/* Fixed-width currency box */}
                      <div className="flex-none w-24">
                        <Combobox
                          options={currencies.map((curr) => ({ value: curr, label: curr }))}
                          value={formData.currency}
                          onValueChange={(value) => setFormData({ ...formData, currency: value })}
                          placeholder="Currency"
                        />
                      </div>

                      {/* Amount box takes the remaining space, with min width */}
                      <Input
                        id="amount"
                        type="number"
                        placeholder="567"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                        className="flex-1 min-w-[100px]" // add min width here
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Employee can submit expense in any currency (currency in which he spent the money in receipt)
                    </p>
                  </div>
                </div>


                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    placeholder="Add any remarks"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              {/* Approval History */}
              <div className="border border-border rounded-lg p-4 bg-muted/30">
                <h3 className="font-semibold mb-3 text-foreground">Approval History</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="font-medium text-muted-foreground">Approver</div>
                    <div className="font-medium text-muted-foreground">Status</div>
                    <div className="font-medium text-muted-foreground">Time</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm py-2 border-t border-border">
                    <div>Sarah</div>
                    <div className="text-success">Approved</div>
                    <div className="text-muted-foreground">12:49 4th Oct, 2025</div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                In manager's approval dashboard, the amount should get auto-converted to base currency of the company with real-time today's currency conversion rates.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDraft}
                  className="flex-1"
                >
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Submit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground text-center mt-4">
          Once submitted the record should become readonly for employee and the submit button should be invisible and state should be pending approval. Also, there should be a log history visible that which user approved/rejected your request at what time.
        </p>
      </div>
    </div>
  );
};

export default NewExpense;
