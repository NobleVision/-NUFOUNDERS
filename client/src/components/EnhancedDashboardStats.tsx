import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoCarousel } from "@/components/ui/video-carousel";
import { PAGE_VIDEO_SETS, getContextualVideos } from "@/lib/videoAssets";
import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  GraduationCap,
  Briefcase,
  Users,
  Trophy,
  Star,
  Target,
  Zap,
  Award,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  MessageSquare,
  FileText
} from "lucide-react";

interface DashboardStats {
  learning: {
    totalEnrolled: number;
    completed: number;
    inProgress: number;
    totalHours: number;
    certificates: number;
  };
  business: {
    totalIdeas: number;
    inPlanning: number;
    launched: number;
    pitchesSubmitted: number;
    avgScore: number;
  };
  community: {
    postsCreated: number;
    repliesGiven: number;
    groupsJoined: number;
    eventsAttended: number;
    connectionsCount: number;
  };
  achievements: {
    badges: { id: string; name: string; icon: string; earnedAt: Date }[];
    milestones: { type: string; title: string; achievedAt: Date }[];
    totalPoints: number;
    level: number;
  };
}

interface EnhancedDashboardStatsProps {
  stats?: DashboardStats;
  userName?: string;
}

// Mock stats for demo
const MOCK_STATS: DashboardStats = {
  learning: {
    totalEnrolled: 5,
    completed: 3,
    inProgress: 2,
    totalHours: 24,
    certificates: 3,
  },
  business: {
    totalIdeas: 2,
    inPlanning: 1,
    launched: 0,
    pitchesSubmitted: 0,
    avgScore: 81,
  },
  community: {
    postsCreated: 4,
    repliesGiven: 12,
    groupsJoined: 3,
    eventsAttended: 2,
    connectionsCount: 15,
  },
  achievements: {
    badges: [
      { id: "quick_learner", name: "Quick Learner", icon: "⚡", earnedAt: new Date(Date.now() - 86400000 * 5) },
      { id: "community_star", name: "Community Star", icon: "⭐", earnedAt: new Date(Date.now() - 86400000 * 3) },
      { id: "first_course", name: "First Course Complete", icon: "🎓", earnedAt: new Date(Date.now() - 86400000 * 7) },
    ],
    milestones: [
      { type: "course", title: "Completed Digital Marketing 101", achievedAt: new Date(Date.now() - 86400000 * 2) },
      { type: "community", title: "Joined Women in Tech group", achievedAt: new Date(Date.now() - 86400000 * 4) },
      { type: "business", title: "Created first business idea", achievedAt: new Date(Date.now() - 86400000 * 6) },
    ],
    totalPoints: 1250,
    level: 4,
  },
};

// Calculate progress percentages
const calculateProgress = (current: number, target: number) => Math.min((current / target) * 100, 100);

// Badge definitions
const AVAILABLE_BADGES = [
  { id: "quick_learner", name: "Quick Learner", description: "Complete 3 courses", icon: "⚡", target: 3 },
  { id: "community_star", name: "Community Star", description: "Make 10 posts", icon: "⭐", target: 10 },
  { id: "business_starter", name: "Business Starter", description: "Create a business idea", icon: "💡", target: 1 },
  { id: "pitch_ready", name: "Pitch Ready", description: "Submit a pitch", icon: "🎯", target: 1 },
  { id: "networker", name: "Networker", description: "Join 5 groups", icon: "🤝", target: 5 },
  { id: "mentor_mentee", name: "Mentor Connection", description: "Connect with a mentor", icon: "🌟", target: 1 },
];

export function EnhancedDashboardStats({ stats = MOCK_STATS, userName = "Founder" }: EnhancedDashboardStatsProps) {
  const contextualVideos = getContextualVideos({
    hasCompletedOnboarding: true,
    coursesCompleted: stats.learning.completed,
    hasBusinessIdea: stats.business.totalIdeas > 0,
    hasPitched: stats.business.pitchesSubmitted > 0,
  });

  // Calculate journey progress (weighted average)
  const journeyProgress = Math.round(
    (calculateProgress(stats.learning.completed, 5) * 0.3) +
    (calculateProgress(stats.business.totalIdeas, 2) * 0.25) +
    (calculateProgress(stats.business.pitchesSubmitted, 1) * 0.25) +
    (calculateProgress(stats.community.groupsJoined, 3) * 0.2)
  );

  return (
    <div className="space-y-6">
      {/* Hero Section with Video Background */}
      <VideoCarousel
        videos={contextualVideos.length > 0 ? contextualVideos : PAGE_VIDEO_SETS.dashboard}
        interval={15000}
        className="h-48 md:h-56 rounded-xl overflow-hidden"
      >
        <div className="h-full flex items-center">
          <div className="container px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-3 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Trophy className="w-3 h-3 mr-1" />
                Level {stats.achievements.level} • {stats.achievements.totalPoints} points
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                Welcome back, {userName}!
              </h1>
              <p className="text-white/90 drop-shadow-md">
                You're {journeyProgress}% through your founder journey
              </p>
              <Progress value={journeyProgress} className="h-2 mt-3 max-w-md bg-white/20" />
            </motion.div>
          </div>
        </div>
      </VideoCarousel>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Courses Completed</p>
                  <p className="text-3xl font-bold text-primary">{stats.learning.completed}</p>
                  <p className="text-xs text-muted-foreground">{stats.learning.inProgress} in progress</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Business Ideas</p>
                  <p className="text-3xl font-bold text-accent">{stats.business.totalIdeas}</p>
                  <p className="text-xs text-muted-foreground">Avg score: {stats.business.avgScore}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Community</p>
                  <p className="text-3xl font-bold text-chart-3">{stats.community.connectionsCount}</p>
                  <p className="text-xs text-muted-foreground">{stats.community.groupsJoined} groups joined</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-chart-3/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-chart-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Badges Earned</p>
                  <p className="text-3xl font-bold text-secondary">{stats.achievements.badges.length}</p>
                  <p className="text-xs text-muted-foreground">{AVAILABLE_BADGES.length - stats.achievements.badges.length} more to unlock</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Progress Tabs */}
      <Tabs defaultValue="journey" className="space-y-4">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="journey" className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            Journey
          </TabsTrigger>
          <TabsTrigger value="learning" className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            Learning
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            Badges
          </TabsTrigger>
        </TabsList>

        {/* Journey Tab */}
        <TabsContent value="journey">
          <Card>
            <CardHeader>
              <CardTitle>Your Founder Journey</CardTitle>
              <CardDescription>Track your progress from learner to launched founder</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Journey Milestones */}
                <div className="relative">
                  {[
                    { step: 1, title: "Complete Onboarding", status: "completed", icon: CheckCircle },
                    { step: 2, title: "Finish First Course", status: stats.learning.completed > 0 ? "completed" : "current", icon: GraduationCap },
                    { step: 3, title: "Create Business Idea", status: stats.business.totalIdeas > 0 ? "completed" : stats.learning.completed > 0 ? "current" : "pending", icon: Briefcase },
                    { step: 4, title: "Join Community", status: stats.community.groupsJoined > 0 ? "completed" : "pending", icon: Users },
                    { step: 5, title: "Submit Pitch", status: stats.business.pitchesSubmitted > 0 ? "completed" : "pending", icon: Target },
                    { step: 6, title: "Get Funded", status: "pending", icon: Trophy },
                  ].map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-4 mb-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        milestone.status === "completed" ? "bg-green-100 text-green-600" :
                        milestone.status === "current" ? "bg-primary/20 text-primary animate-pulse" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        <milestone.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${milestone.status === "completed" ? "text-green-600" : milestone.status === "current" ? "text-primary" : "text-muted-foreground"}`}>
                          {milestone.title}
                        </p>
                      </div>
                      {milestone.status === "completed" && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {milestone.status === "current" && (
                        <Badge variant="outline" className="animate-pulse">Current</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Tab */}
        <TabsContent value="learning">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>{stats.learning.totalHours} hours of learning completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Courses Completed</span>
                    <span className="text-sm text-muted-foreground">{stats.learning.completed}/10</span>
                  </div>
                  <Progress value={calculateProgress(stats.learning.completed, 10)} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Certificates Earned</span>
                    <span className="text-sm text-muted-foreground">{stats.learning.certificates}</span>
                  </div>
                  <Progress value={calculateProgress(stats.learning.certificates, 10)} />
                </div>
                <div className="flex flex-col justify-center">
                  <Link href="/courses">
                    <Button className="w-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Continue Learning
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Formation</CardTitle>
              <CardDescription>Your entrepreneurship progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-3xl font-bold text-primary">{stats.business.totalIdeas}</p>
                  <p className="text-sm text-muted-foreground">Ideas Created</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-3xl font-bold text-accent">{stats.business.inPlanning}</p>
                  <p className="text-sm text-muted-foreground">In Planning</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-3xl font-bold text-chart-3">{stats.business.pitchesSubmitted}</p>
                  <p className="text-sm text-muted-foreground">Pitches Submitted</p>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <Link href="/business" className="flex-1">
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    View Ideas
                  </Button>
                </Link>
                <Link href="/business" className="flex-1">
                  <Button className="w-full">
                    <Zap className="w-4 h-4 mr-2" />
                    Create New Idea
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Badges & Achievements</CardTitle>
              <CardDescription>Unlock badges as you progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {AVAILABLE_BADGES.map((badge) => {
                  const earned = stats.achievements.badges.some(b => b.id === badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-lg border text-center ${
                        earned ? "bg-secondary/10 border-secondary/30" : "bg-muted/30 border-border opacity-60"
                      }`}
                    >
                      <div className="text-3xl mb-2">{badge.icon}</div>
                      <p className="font-medium text-sm">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                      {earned && (
                        <Badge className="mt-2 bg-secondary/20 text-secondary">Earned</Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.achievements.milestones.map((milestone, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  milestone.type === "course" ? "bg-primary/10" :
                  milestone.type === "business" ? "bg-accent/10" :
                  "bg-chart-3/10"
                }`}>
                  {milestone.type === "course" && <GraduationCap className="w-5 h-5 text-primary" />}
                  {milestone.type === "business" && <Briefcase className="w-5 h-5 text-accent" />}
                  {milestone.type === "community" && <Users className="w-5 h-5 text-chart-3" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{milestone.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {milestone.achievedAt.toLocaleDateString()}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EnhancedDashboardStats;
