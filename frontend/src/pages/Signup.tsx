// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Building2 } from "lucide-react";
// import { toast } from "sonner";

// import { Combobox } from "@/components/ui/combobox";



// const Signup = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     country: "",
//   });

//   // Mock countries data - in production, fetch from REST Countries API
//   // const countries = [
//   //   { code: "US", name: "United States", currency: "USD" },
//   //   { code: "GB", name: "United Kingdom", currency: "GBP" },
//   //   { code: "IN", name: "India", currency: "INR" },
//   //   { code: "DE", name: "Germany", currency: "EUR" },
//   //   { code: "JP", name: "Japan", currency: "JPY" },
//   // ];

//   const [countries, setCountries] = useState<{ code: string; name: string; currency: string }[]>([]);

//   useEffect(() => {
//     fetch("https://restcountries.com/v3.1/all?fields=name,currencies,cca2")
//       .then((res) => res.json())
//       .then((data) => {
//         const mapped = data.map((c: any) => {
//           const currencyCode = c.currencies ? Object.keys(c.currencies)[0] : "N/A";
//           return {
//             code: c.cca2,
//             name: c.name.common,
//             currency: currencyCode,
//           };
//         });
//         // sort alphabetically
//         mapped.sort((a: any, b: any) => a.name.localeCompare(b.name));
//         setCountries(mapped);
//       })
//       .catch((err) => console.error(err));
//   }, []);


//  // ...existing code...
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (formData.password !== formData.confirmPassword) {
//     toast.error("Passwords do not match");
//     return;
//   }

//   const selectedCountry = countries.find(c => c.code === formData.country);

//   try {
//     const response = await fetch("http://localhost:3000/api/auth/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         country: selectedCountry?.name,
//         currency: selectedCountry?.currency,
//       }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       toast.success("Signup successful! Please login.");
//       navigate("/login");
//     } else {
//       toast.error(data.message || "Signup failed");
//     }
//   } catch (error) {
//     toast.error("Network error");
//   }
// };
// // ...existing code...
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4">
//       <Card className="w-full max-w-md shadow-xl border-primary/20">
//         <CardHeader className="space-y-3 text-center">
//           <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
//             <Building2 className="w-8 h-8 text-primary" />
//           </div>
//           <CardTitle className="text-2xl font-bold text-foreground">Admin Signup</CardTitle>
//           <CardDescription className="text-muted-foreground">
//             Create your company account
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Name</Label>
//               <Input
//                 id="name"
//                 placeholder="Enter your name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Create a password"
//                 value={formData.password}
//                 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="confirmPassword">Confirm Password</Label>
//               <Input
//                 id="confirmPassword"
//                 type="password"
//                 placeholder="Confirm your password"
//                 value={formData.confirmPassword}
//                 onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="country">Country Selection</Label>
//               {/* <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select your country" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-popover">
//                   {countries.map((country) => (
//                     <SelectItem key={country.code} value={country.code}>
//                       {country.name} ({country.currency})
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select> */}
//               <Combobox
//                 options={countries.map((country) => ({
//                   value: country.code,
//                   label: `${country.name} [${country.currency}]`,
//                 }))}
//                 value={formData.country}
//                 onValueChange={(value) => setFormData({ ...formData, country: value })}
//                 placeholder="Select or type your country"
//               />


//               <p className="text-xs text-muted-foreground">
//                 Your company's base currency will be set based on the selected country
//               </p>
//             </div>

//             <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
//               Signup
//             </Button>

//             <p className="text-center text-sm text-muted-foreground">
//               Already have an account?{" "}
//               <Button variant="link" className="p-0 h-auto text-primary" onClick={() => navigate("/login")}>
//                 Login
//               </Button>
//             </p>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Signup;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";

interface Country {
  code: string;
  name: string;
  currency: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
  });
  const [countries, setCountries] = useState<Country[]>([]);

  // Fetch countries
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,currencies,cca2")
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((c: any) => {
          const currencyCode = c.currencies ? Object.keys(c.currencies)[0] : "N/A";
          return {
            code: c.cca2,
            name: c.name.common,
            currency: currencyCode,
          };
        });
        mapped.sort((a: Country, b: Country) => a.name.localeCompare(b.name));
        setCountries(mapped);
      })
      .catch((err) => console.error("Countries fetch error:", err));
  }, []);

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const selectedCountry = countries.find((c) => c.code === formData.country);

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name, // backend maps this to username
          email: formData.email,
          password: formData.password,
          country: selectedCountry?.name,
          currency: selectedCountry?.currency,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Signup successful! Please login.");
        navigate("/login");
      } else {
        toast.error(data.msg || data.message || "Signup failed");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Admin Signup</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create your company account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country Selection</Label>
              <Combobox
                options={countries.map((country) => ({
                  value: country.code,
                  label: `${country.name} [${country.currency}]`,
                }))}
                value={formData.country}
                onValueChange={(value) => setFormData({ ...formData, country: value })}
                placeholder="Select or type your country"
              />
              <p className="text-xs text-muted-foreground">
                Your company's base currency will be set based on the selected country
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
              Signup
            </Button>

            {/* Login link */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto text-primary" onClick={() => navigate("/login")}>
                Login
              </Button>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
