import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { 
  GraduationCap, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Award, 
  Calendar,
  ArrowRight,
  BookOpen,
  Target,
  Sparkles,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  Trophy,
  Zap,
  Star,
  Clock
} from "lucide-react";

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const { data: profile } = trpc.profile.get.useQuery(undefined, { enabled: isAuthenticated });
  const { data: enrollments } = trpc.course.getEnrollments.useQuery(undefined, { enabled: isAuthenticated });
  const { data: businessIdeas } = trpc.business.listIdeas.useQuery(undefined, { enabled: isAuthenticated });
  const { data: notifications } = trpc.notification.list.useQuery({ limit: 5 }, { enabled: isAuthenticated });

  useEffect(() => {
    if (isAuthenticated && user && !user.onboardingCompleted) {
      setLocation("/onboarding");
    }
  }, [isAuthenticated, user, setLocation]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Welcome to NuFounders</CardTitle>
            <CardDescription>Please sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedCourses = enrollments?.filter(e => e.status === 'completed').length || 0;
  const inProgressCourses = enrollments?.filter(e => e.status === 'in_progress').length || 0;
  const totalPoints = profile?.totalPoints || 0;
  const level = profile?.level || 1;

  const quickActions = [
    { icon: BookOpen, label: "Browse Courses", href: "/courses", color: "bg-primary/10 text-primary" },
    { icon: Briefcase, label: "Business Ideas", href: "/business", color: "bg-accent/10 text-accent" },
    { icon: Users, label: "Community", href: "/community", color: "bg-chart-3/10 text-chart-3" },
    { icon: Calendar, label: "Events", href: "/events", color: "bg-chart-5/10 text-chart-5" },
  ];

  const recentActivity = [
    { type: "course", title: "Started Digital Marketing 101", time: "2 hours ago" },
    { type: "achievement", title: "Earned 'Quick Learner' badge", time: "1 day ago" },
    { type: "community", title: "Joined 'Women in Tech' group", time: "2 days ago" },
  ];

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
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start bg-sidebar-accent">
              <Target className="w-4 h-4 mr-3" />
              Dashboard
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="ghost" className="w-full justify-start">
              <GraduationCap className="w-4 h-4 mr-3" />
              Courses
            </Button>
          </Link>
          <Link href="/business">
            <Button variant="ghost" className="w-full justify-start">
              <Briefcase className="w-4 h-4 mr-3" />
              Business
            </Button>
          </Link>
          <Link href="/community">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="w-4 h-4 mr-3" />
              Community
            </Button>
          </Link>
          <Link href="/events">
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-3" />
              Events
            </Button>
          </Link>
          <Link href="/scholarships">
            <Button variant="ghost" className="w-full justify-start">
              <Award className="w-4 h-4 mr-3" />
              Scholarships
            </Button>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <Link href="/profile">
            <Button variant="ghost" className="w-full justify-start mb-2">
              <Settings className="w-4 h-4 mr-3" />
              Settings
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
              <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'Founder'}!</h1>
              <p className="text-muted-foreground">Let's continue building your future</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notifications && notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                    <p className="text-3xl font-bold text-primary">{totalPoints}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Level</p>
                    <p className="text-3xl font-bold text-accent">{level}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-accent" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Courses Completed</p>
                    <p className="text-3xl font-bold text-chart-3">{completedCourses}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-chart-3/20 flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-chart-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-chart-5/10 to-chart-5/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Business Ideas</p>
                    <p className="text-3xl font-bold text-chart-5">{businessIdeas?.length || 0}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-chart-5/20 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-chart-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-secondary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <div className="p-4 rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                      <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <p className="font-medium">{action.label}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Current Courses */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Courses</CardTitle>
                  <CardDescription>{inProgressCourses} in progress</CardDescription>
                </div>
                <Link href="/courses">
                  <Button variant="ghost" size="sm">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {enrollments && enrollments.length > 0 ? (
                  <div className="space-y-4">
                    {enrollments.slice(0, 3).map((enrollment, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Course #{enrollment.courseId}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={enrollment.progress} className="h-2 flex-1" />
                            <span className="text-sm text-muted-foreground">{enrollment.progress}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No courses yet</p>
                    <Link href="/courses">
                      <Button>Browse Courses</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {activity.type === 'course' && <BookOpen className="w-5 h-5 text-primary" />}
                        {activity.type === 'achievement' && <Trophy className="w-5 h-5 text-secondary" />}
                        {activity.type === 'community' && <Users className="w-5 h-5 text-chart-3" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Courses */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Based on your profile and goals</CardDescription>
              </div>
              <Link href="/courses">
                <Button variant="outline" size="sm">
                  See All <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: "Digital Marketing Fundamentals", category: "Marketing", hours: 8, level: "Beginner" },
                  { title: "Entrepreneurship 101", category: "Business", hours: 12, level: "Beginner" },
                  { title: "AI Literacy for Business", category: "Technology", hours: 6, level: "Intermediate" },
                ].map((course, index) => (
                  <div key={index} className="p-4 rounded-xl border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                    <Badge variant="secondary" className="mb-3">{course.category}</Badge>
                    <h4 className="font-semibold mb-2">{course.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.hours}h
                      </span>
                      <span>{course.level}</span>
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
