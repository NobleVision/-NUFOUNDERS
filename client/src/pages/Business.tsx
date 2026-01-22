import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VideoCarousel } from "@/components/ui/video-carousel";
import { PAGE_VIDEO_SETS } from "@/lib/videoAssets";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  Briefcase, 
  Plus,
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Zap,
  Award,
  ArrowLeft,
  Sparkles,
  Lightbulb,
  FileText,
  Calendar,
  Trophy,
  ChevronRight,
  BarChart3,
  Rocket,
  FileSearch,
  Brain
} from "lucide-react";
import { DocumentAnalyzer } from "@/components/DocumentAnalyzer";
import { BusinessBrainstormer } from "@/components/BusinessBrainstormer";

// Mock business ideas for demo
const MOCK_IDEAS = [
  {
    id: 1,
    title: "Virtual Event Planning Service",
    description: "Full-service virtual and hybrid event planning for corporate clients and small businesses.",
    vertical: "Event Planning",
    status: "planning",
    demandScore: 85,
    skillsMatchScore: 92,
    capitalRequirementScore: 78,
    automationPotentialScore: 65,
    profitMarginScore: 80,
    competitionScore: 70,
    compositeScore: 82,
    estimatedStartupCost: 5000,
    estimatedMonthlyRevenue: 8000,
  },
  {
    id: 2,
    title: "Social Media Management Agency",
    description: "Done-for-you social media management for small businesses and personal brands.",
    vertical: "Marketing",
    status: "idea",
    demandScore: 90,
    skillsMatchScore: 88,
    capitalRequirementScore: 90,
    automationPotentialScore: 75,
    profitMarginScore: 85,
    competitionScore: 55,
    compositeScore: 81,
    estimatedStartupCost: 2000,
    estimatedMonthlyRevenue: 6000,
  },
];

// Mock pitch competitions
const MOCK_COMPETITIONS = [
  {
    id: 1,
    title: "Q1 2026 NuFounders Pitch Competition",
    description: "Quarterly pitch competition for NuFounders members with $100,000 in total prizes.",
    quarter: "Q1 2026",
    prizePool: 100000,
    maxParticipants: 50,
    applicationDeadline: new Date("2026-02-15"),
    pitchDate: new Date("2026-03-01"),
    status: "open",
    currentParticipants: 23,
  },
  {
    id: 2,
    title: "Women in Tech Startup Challenge",
    description: "Special competition focused on technology-driven business ideas.",
    quarter: "Q2 2026",
    prizePool: 75000,
    maxParticipants: 30,
    applicationDeadline: new Date("2026-05-01"),
    pitchDate: new Date("2026-05-15"),
    status: "upcoming",
    currentParticipants: 0,
  },
];

export default function Business() {
  const { isAuthenticated } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: "", description: "", vertical: "" });

  const { data: businessIdeas } = trpc.business.listIdeas.useQuery(undefined, { enabled: isAuthenticated });
  const createIdeaMutation = trpc.business.createIdea.useMutation({
    onSuccess: (data) => {
      toast.success("Business idea created and scored!");
      setIsCreateDialogOpen(false);
      setNewIdea({ title: "", description: "", vertical: "" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create idea");
    },
  });

  const ideas = businessIdeas && businessIdeas.length > 0 ? businessIdeas : MOCK_IDEAS;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'idea': return <Badge variant="secondary">Idea</Badge>;
      case 'planning': return <Badge className="bg-blue-100 text-blue-700">Planning</Badge>;
      case 'launched': return <Badge className="bg-green-100 text-green-700">Launched</Badge>;
      case 'growing': return <Badge className="bg-purple-100 text-purple-700">Growing</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
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

      {/* Video Hero Section */}
      <VideoCarousel
        videos={PAGE_VIDEO_SETS.business}
        interval={12000}
        className="h-64 md:h-80"
      >
        <div className="h-full flex items-center">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Rocket className="w-3 h-3 mr-1" />
                AI-Powered Business Formation
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Turn Ideas Into Reality
              </h1>
              <p className="text-lg text-white/90 drop-shadow-md">
                Get AI-scored business ideas, generate plans, and pitch for funding
              </p>
            </motion.div>
          </div>
        </div>
      </VideoCarousel>

      <div className="container py-8">
        {/* Action Bar */}
        <div className="flex justify-end mb-8">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="mt-4 md:mt-0">
                <Plus className="w-5 h-5 mr-2" />
                New Business Idea
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Business Idea</DialogTitle>
                <DialogDescription>
                  Describe your business idea and our AI will analyze and score it.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Business Name/Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Virtual Event Planning Service"
                    value={newIdea.title}
                    onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vertical">Industry/Vertical</Label>
                  <Input 
                    id="vertical" 
                    placeholder="e.g., Event Planning, Marketing, Technology"
                    value={newIdea.vertical}
                    onChange={(e) => setNewIdea({ ...newIdea, vertical: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your business idea, target market, and value proposition..."
                    rows={4}
                    value={newIdea.description}
                    onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => createIdeaMutation.mutate(newIdea)}
                  disabled={createIdeaMutation.isPending || !newIdea.title || !newIdea.description}
                >
                  {createIdeaMutation.isPending ? "Analyzing..." : "Create & Analyze"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="ideas" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="ideas">My Ideas</TabsTrigger>
            <TabsTrigger value="brainstorm">
              <Brain className="w-4 h-4 mr-1" />
              Brainstorm
            </TabsTrigger>
            <TabsTrigger value="analyzer">
              <FileSearch className="w-4 h-4 mr-1" />
              Analyzer
            </TabsTrigger>
            <TabsTrigger value="competitions">Competitions</TabsTrigger>
          </TabsList>

          {/* Business Ideas Tab */}
          <TabsContent value="ideas" className="space-y-6">
            {ideas.length === 0 ? (
              <Card className="text-center py-16">
                <CardContent>
                  <Lightbulb className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No business ideas yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first business idea and get AI-powered analysis
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Idea
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6">
                {ideas.map((idea: any) => (
                  <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl">{idea.title}</CardTitle>
                          <CardDescription className="mt-1">{idea.vertical}</CardDescription>
                        </div>
                        {getStatusBadge(idea.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-muted-foreground line-clamp-2">{idea.description}</p>
                      
                      {/* Composite Score */}
                      <div className="p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Overall Score</span>
                          <span className={`text-2xl font-bold ${getScoreColor(idea.compositeScore)}`}>
                            {idea.compositeScore}/100
                          </span>
                        </div>
                        <Progress value={idea.compositeScore} className="h-3" />
                      </div>

                      {/* Score Breakdown */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            Demand
                          </span>
                          <span className={`font-medium ${getScoreColor(idea.demandScore)}`}>
                            {idea.demandScore}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            Skills Match
                          </span>
                          <span className={`font-medium ${getScoreColor(idea.skillsMatchScore)}`}>
                            {idea.skillsMatchScore}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            Capital Fit
                          </span>
                          <span className={`font-medium ${getScoreColor(idea.capitalRequirementScore)}`}>
                            {idea.capitalRequirementScore}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Zap className="w-4 h-4" />
                            Automation
                          </span>
                          <span className={`font-medium ${getScoreColor(idea.automationPotentialScore)}`}>
                            {idea.automationPotentialScore}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            Profit Margin
                          </span>
                          <span className={`font-medium ${getScoreColor(idea.profitMarginScore)}`}>
                            {idea.profitMarginScore}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Competition
                          </span>
                          <span className={`font-medium ${getScoreColor(idea.competitionScore)}`}>
                            {idea.competitionScore}
                          </span>
                        </div>
                      </div>

                      {/* Financial Projections */}
                      {idea.estimatedStartupCost && (
                        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-primary/5">
                          <div>
                            <p className="text-sm text-muted-foreground">Startup Cost</p>
                            <p className="text-lg font-semibold">${idea.estimatedStartupCost.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                            <p className="text-lg font-semibold text-green-600">
                              ${idea.estimatedMonthlyRevenue?.toLocaleString() || 'TBD'}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="gap-2">
                      <Button variant="outline" className="flex-1">
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Plan
                      </Button>
                      <Button className="flex-1">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Brainstorm Tab */}
          <TabsContent value="brainstorm" className="space-y-6">
            <BusinessBrainstormer />
          </TabsContent>

          {/* Document Analyzer Tab */}
          <TabsContent value="analyzer" className="space-y-6">
            <DocumentAnalyzer />
          </TabsContent>

          {/* Pitch Competitions Tab */}
          <TabsContent value="competitions" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {MOCK_COMPETITIONS.map((competition) => (
                <Card key={competition.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge 
                        className={competition.status === 'open' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'}
                      >
                        {competition.status === 'open' ? 'Open for Applications' : 'Coming Soon'}
                      </Badge>
                      <Trophy className="w-6 h-6 text-secondary" />
                    </div>
                    <CardTitle className="text-xl mt-2">{competition.title}</CardTitle>
                    <CardDescription>{competition.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Prize Pool</p>
                        <p className="text-xl font-bold text-primary">
                          ${competition.prizePool.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground">Spots Available</p>
                        <p className="text-xl font-bold">
                          {competition.maxParticipants - competition.currentParticipants}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Deadline: {competition.applicationDeadline.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Award className="w-4 h-4" />
                        <span>Pitch Date: {competition.pitchDate.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Applications</span>
                        <span>{competition.currentParticipants}/{competition.maxParticipants}</span>
                      </div>
                      <Progress 
                        value={(competition.currentParticipants / competition.maxParticipants) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      disabled={competition.status !== 'open' || !isAuthenticated}
                    >
                      {competition.status === 'open' ? 'Apply Now' : 'Notify Me'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* How It Works */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>How Pitch Competitions Work</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { step: "1", title: "Apply", desc: "Submit your business idea and pitch deck" },
                    { step: "2", title: "Review", desc: "Our panel reviews all applications" },
                    { step: "3", title: "Pitch", desc: "Selected founders present to investors" },
                    { step: "4", title: "Win", desc: "Winners receive funding and mentorship" },
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                        {item.step}
                      </div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
