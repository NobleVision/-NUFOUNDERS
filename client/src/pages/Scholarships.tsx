import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";
import { 
  Award, 
  DollarSign,
  Calendar,
  Users,
  Building2,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Clock,
  Target,
  FileText
} from "lucide-react";

// Mock scholarships data
const MOCK_SCHOLARSHIPS = [
  {
    id: 1,
    title: "NuFounders Launch Grant",
    description: "Seed funding for NuFounders members ready to launch their first business. Covers initial startup costs and first 3 months of operations.",
    sponsor: "NuFounders Foundation",
    amount: 10000,
    deadline: new Date("2026-02-28"),
    totalSlots: 20,
    filledSlots: 12,
    requirements: ["Complete at least 3 courses", "Have a business plan", "Be a member for 30+ days"],
    status: "open",
    category: "Business Launch",
  },
  {
    id: 2,
    title: "Tech Skills Scholarship",
    description: "Full scholarship covering all technology-focused courses on the platform plus mentorship from industry professionals.",
    sponsor: "Google.org",
    amount: 5000,
    deadline: new Date("2026-03-15"),
    totalSlots: 50,
    filledSlots: 34,
    requirements: ["Interest in technology", "Complete onboarding", "Submit application essay"],
    status: "open",
    category: "Education",
  },
  {
    id: 3,
    title: "Single Mom Entrepreneur Fund",
    description: "Special funding program for single mothers looking to start or grow their business while balancing family responsibilities.",
    sponsor: "Wells Fargo",
    amount: 15000,
    deadline: new Date("2026-04-01"),
    totalSlots: 15,
    filledSlots: 8,
    requirements: ["Single parent status", "Business plan submission", "Interview required"],
    status: "open",
    category: "Business Launch",
  },
  {
    id: 4,
    title: "Marketing Mastery Grant",
    description: "Funding for marketing courses and tools to help you build your brand and reach customers effectively.",
    sponsor: "Meta",
    amount: 3000,
    deadline: new Date("2026-02-15"),
    totalSlots: 100,
    filledSlots: 78,
    requirements: ["Complete Digital Marketing 101", "Active business or business plan"],
    status: "open",
    category: "Education",
  },
  {
    id: 5,
    title: "E-commerce Accelerator",
    description: "Comprehensive package including funding, mentorship, and tools to launch your online store.",
    sponsor: "Shopify",
    amount: 7500,
    deadline: new Date("2026-03-30"),
    totalSlots: 25,
    filledSlots: 10,
    requirements: ["E-commerce business idea", "Complete E-commerce Mastery course", "Product sourcing plan"],
    status: "open",
    category: "Business Launch",
  },
  {
    id: 6,
    title: "Community Leader Award",
    description: "Recognition and funding for members who actively contribute to the NuFounders community.",
    sponsor: "NuFounders Foundation",
    amount: 2500,
    deadline: new Date("2026-05-01"),
    totalSlots: 10,
    filledSlots: 0,
    requirements: ["Active community participation", "Helped at least 5 other members", "Nominated by peers"],
    status: "upcoming",
    category: "Recognition",
  },
];

// Mock corporate sponsors
const MOCK_SPONSORS = [
  { name: "Google.org", logo: "G", contribution: 500000 },
  { name: "Meta", logo: "M", contribution: 350000 },
  { name: "Wells Fargo", logo: "WF", contribution: 750000 },
  { name: "Shopify", logo: "S", contribution: 200000 },
  { name: "Microsoft", logo: "MS", contribution: 400000 },
  { name: "Amazon", logo: "A", contribution: 300000 },
];

export default function Scholarships() {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const CATEGORIES = ["All", "Business Launch", "Education", "Recognition"];

  const filteredScholarships = MOCK_SCHOLARSHIPS.filter(s => {
    if (selectedCategory === "All") return true;
    return s.category === selectedCategory;
  });

  const getDaysRemaining = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (status: string, deadline: Date) => {
    const daysLeft = getDaysRemaining(deadline);
    if (status === 'upcoming') return <Badge variant="secondary">Coming Soon</Badge>;
    if (daysLeft <= 7) return <Badge className="bg-red-100 text-red-700">Closing Soon</Badge>;
    return <Badge className="bg-green-100 text-green-700">Open</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">NuFounders</span>
              </div>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Scholarships & Funding</h1>
          <p className="text-lg text-muted-foreground">
            Access funding opportunities from our corporate sponsors
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary">$2.5M+</div>
              <p className="text-sm text-muted-foreground">Total Funding Available</p>
            </CardContent>
          </Card>
          <Card className="bg-accent/5">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-accent">{MOCK_SCHOLARSHIPS.length}</div>
              <p className="text-sm text-muted-foreground">Active Programs</p>
            </CardContent>
          </Card>
          <Card className="bg-chart-3/5">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-chart-3">{MOCK_SPONSORS.length}</div>
              <p className="text-sm text-muted-foreground">Corporate Sponsors</p>
            </CardContent>
          </Card>
          <Card className="bg-chart-5/5">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-chart-5">450+</div>
              <p className="text-sm text-muted-foreground">Women Funded</p>
            </CardContent>
          </Card>
        </div>

        {/* Sponsors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Our Corporate Sponsors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {MOCK_SPONSORS.map((sponsor, index) => (
                <div key={index} className="text-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                    {sponsor.logo}
                  </div>
                  <p className="text-sm font-medium">{sponsor.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {CATEGORIES.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Scholarships Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="secondary">{scholarship.category}</Badge>
                  {getStatusBadge(scholarship.status, scholarship.deadline)}
                </div>
                <CardTitle className="text-xl">{scholarship.title}</CardTitle>
                <CardDescription>{scholarship.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5">
                  <div>
                    <p className="text-sm text-muted-foreground">Award Amount</p>
                    <p className="text-2xl font-bold text-primary">${scholarship.amount.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Sponsor</p>
                    <p className="font-medium">{scholarship.sponsor}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Spots Available
                    </span>
                    <span>{scholarship.totalSlots - scholarship.filledSlots} of {scholarship.totalSlots}</span>
                  </div>
                  <Progress 
                    value={(scholarship.filledSlots / scholarship.totalSlots) * 100} 
                    className="h-2" 
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Deadline: {scholarship.deadline.toLocaleDateString()}</span>
                  {getDaysRemaining(scholarship.deadline) > 0 && (
                    <Badge variant="outline" className="ml-auto">
                      {getDaysRemaining(scholarship.deadline)} days left
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Requirements:</p>
                  <ul className="space-y-1">
                    {scholarship.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  disabled={scholarship.status !== 'open' || !isAuthenticated}
                >
                  {scholarship.status === 'upcoming' ? 'Notify Me' : 'Apply Now'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
