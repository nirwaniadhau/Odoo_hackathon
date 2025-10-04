import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Users, CheckSquare, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Expense Management",
      description: "Submit and track expenses with OCR receipt scanning",
    },
    {
      icon: Users,
      title: "Multi-Role Support",
      description: "Admin, Manager, and Employee dashboards",
    },
    {
      icon: CheckSquare,
      title: "Approval Workflows",
      description: "Configurable multi-level approval rules",
    },
    {
      icon: TrendingUp,
      title: "Multi-Currency",
      description: "Support for global currencies with real-time conversion",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-8 shadow-lg">
            <FileText className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Expense Approval
            <span className="block text-primary mt-2">Made Simple</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Streamline your expense management with intelligent OCR, multi-currency support, 
            and flexible approval workflows. Built for Odoo.
          </p>

          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-6 text-lg shadow-lg"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="px-8 py-6 text-lg border-primary/30"
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Role Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/20 bg-gradient-to-br from-card to-accent/5">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Admin</h3>
              <p className="text-muted-foreground mb-4">
                Manage users, configure approval rules, and oversee all expenses
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• User management</li>
                <li>• Approval rule configuration</li>
                <li>• Company settings</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-card to-accent/5">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                <CheckSquare className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Manager</h3>
              <p className="text-muted-foreground mb-4">
                Review and approve team expenses with currency conversion
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Approval dashboard</li>
                <li>• Currency conversion</li>
                <li>• Approval history</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-card to-accent/5">
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Employee</h3>
              <p className="text-muted-foreground mb-4">
                Submit expenses with OCR and track approval status
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• OCR receipt scanning</li>
                <li>• Multi-currency support</li>
                <li>• Status tracking</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
