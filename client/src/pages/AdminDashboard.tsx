import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { 
  Users, 
  GraduationCap,
  Briefcase,
  TrendingUp,
  DollarSign,
  Award,
  ArrowLeft,
  Sparkles,
  BarChart3,
  PieChart,
  Activity,
  UserCheck,
  BookOpen,
  Target,
  Calendar,
  Settings,
  LogOut
} from "lucide-react";

// Mock analytics data
const MOCK_ANALYTICS = {
  totalUsers: 2547,
  activeUsers: 1823,
  newUsersThisMonth: 234,
  userGrowthRate: 12.5,
  totalCourses: 25,
  courseCompletionRate: 67,
  avgCoursesPerUser: 3.2,
  totalBusinessIdeas: 892,
  businessesLaunched: 156,
  pitchCompetitionApplicants: 89,
  totalFundingDistributed: 1250000,
  scholarshipApplications: 342,
  communityPosts: 4521,
  eventsHosted: 48,
};

const MOCK_USER_DEMOGRAPHICS = [
  { category: "Age 18-25", count: 412, percentage: 16 },
  { category: "Age 26-35", count: 892, percentage: 35 },
  { category: "Age 36-45", count: 765, percentage: 30 },
  { category: "Age 46-55", count: 356, percentage: 14 },
  { category: "Age 55+", count: 122, percentage: 5 },
];

const MOCK_DISPLACEMENT_REASONS = [
  { reason: "Layoff/Downsizing", count: 892, percentage: 35 },
  { reason: "Industry Changes", count: 534, percentage: 21 },
  { reason: "Company Closure", count: 412, percentage: 16 },
  { reason: "Caregiving", count: 356, percentage: 14 },
  { reason: "Relocation", count: 203, percentage: 8 },
  { reason: "Other", count: 150, percentage: 6 },
];

const MOCK_TOP_COURSES = [
  { name: "Digital Marketing Fundamentals", enrollments: 1247, completionRate: 72 },
  { name: "Entrepreneurship 101", enrollments: 2103, completionRate: 68 },
  { name: "AI Literacy for Business", enrollments: 892, completionRate: 65 },
  { name: "E-commerce Mastery", enrollments: 1534, completionRate: 58 },
  { name: "Personal Branding & LinkedIn", enrollments: 2341, completionRate: 78 },
];

const MOCK_RECENT_USERS = [
  { name: "Keisha Williams", email: "keisha@email.com", joinDate: "2026-01-20", status: "active" },
  { name: "Tamara Johnson", email: "tamara@email.com", joinDate: "2026-01-19", status: "active" },
  { name: "Destiny Carter", email: "destiny@email.com", joinDate: "2026-01-18", status: "onboarding" },
  { name: "Michelle Roberts", email: "michelle@email.com", joinDate: "2026-01-17", status: "active" },
  { name: "Jasmine Brown", email: "jasmine@email.com", joinDate: "2026-01-16", status: "active" },
];

export default function AdminDashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect non-admin users
  useEffect(() => {
    if (isAuthenticated && user && user.role !== 'admin') {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, user, setLocation]);

  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this page</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border hidden lg:block">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">NuFounders</span>
          </Link>
        </div>
        
        <nav className="px-4 space-y-2">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase">Admin</div>
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start bg-sidebar-accent">
              <BarChart3 className="w-4 h-4 mr-3" />
              Analytics
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start">
            <Users className="w-4 h-4 mr-3" />
            Users
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <GraduationCap className="w-4 h-4 mr-3" />
            Courses
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Briefcase className="w-4 h-4 mr-3" />
            Businesses
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Award className="w-4 h-4 mr-3" />
            Scholarships
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Calendar className="w-4 h-4 mr-3" />
            Events
          </Button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start mb-2">
              <ArrowLeft className="w-4 h-4 mr-3" />
              User Dashboard
            </Button>
          </Link>
          <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => logout()}>
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Platform analytics and management</p>
            </div>
            <Badge className="bg-primary/10 text-primary">Admin</Badge>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold text-primary">{MOCK_ANALYTICS.totalUsers.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">+{MOCK_ANALYTICS.userGrowthRate}% this month</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Course Completion</p>
                    <p className="text-3xl font-bold text-accent">{MOCK_ANALYTICS.courseCompletionRate}%</p>
                    <p className="text-xs text-muted-foreground mt-1">{MOCK_ANALYTICS.totalCourses} courses</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Businesses Launched</p>
                    <p className="text-3xl font-bold text-chart-3">{MOCK_ANALYTICS.businessesLaunched}</p>
                    <p className="text-xs text-muted-foreground mt-1">{MOCK_ANALYTICS.totalBusinessIdeas} ideas</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-chart-3/20 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-chart-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-chart-5/10 to-chart-5/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Funding Distributed</p>
                    <p className="text-3xl font-bold text-chart-5">${(MOCK_ANALYTICS.totalFundingDistributed / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-muted-foreground mt-1">{MOCK_ANALYTICS.scholarshipApplications} applications</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-chart-5/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-chart-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* User Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  User Demographics
                </CardTitle>
                <CardDescription>Age distribution of platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_USER_DEMOGRAPHICS.map((demo, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{demo.category}</span>
                        <span className="font-medium">{demo.count.toLocaleString()} ({demo.percentage}%)</span>
                      </div>
                      <Progress value={demo.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Displacement Reasons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Displacement Reasons
                </CardTitle>
                <CardDescription>Why users joined the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_DISPLACEMENT_REASONS.map((reason, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>{reason.reason}</span>
                        <span className="font-medium">{reason.count.toLocaleString()} ({reason.percentage}%)</span>
                      </div>
                      <Progress value={reason.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Top Performing Courses
              </CardTitle>
              <CardDescription>Most popular courses by enrollment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_TOP_COURSES.map((course, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{course.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {course.enrollments.toLocaleString()} enrollments
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{course.completionRate}%</p>
                      <p className="text-sm text-muted-foreground">completion</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Recent Users
              </CardTitle>
              <CardDescription>Latest platform registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_RECENT_USERS.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1">{user.joinDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
