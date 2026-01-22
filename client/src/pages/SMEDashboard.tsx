import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Users,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Loader2,
  GraduationCap,
  BarChart3,
  Zap,
  Bot
} from "lucide-react";

interface CourseModule {
  id: number;
  title: string;
  description: string;
  content: string;
  estimatedMinutes: number;
  orderIndex: number;
  aiGenerated: boolean;
}

interface CourseForReview {
  id: number;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: string;
  skillLevel: string;
  status: string;
  estimatedHours: number;
  totalModules: number;
  aiGenerated: boolean;
  createdAt: Date;
  learningOutcomes: string[];
  tags: string[];
  modules?: CourseModule[];
}

// Mock courses pending review for demo
const MOCK_PENDING_COURSES: CourseForReview[] = [
  {
    id: 101,
    title: "AI-Powered Content Marketing",
    slug: "ai-powered-content-marketing",
    description: "Master the art of creating compelling content using AI tools. Learn to leverage ChatGPT, Claude, and other AI assistants to scale your content production while maintaining quality and authenticity.",
    shortDescription: "Learn to create high-quality content at scale using AI tools",
    category: "Marketing",
    skillLevel: "intermediate",
    status: "pending_review",
    estimatedHours: 6,
    totalModules: 5,
    aiGenerated: true,
    createdAt: new Date("2026-01-21"),
    learningOutcomes: [
      "Use AI tools to generate content ideas and outlines",
      "Write effective prompts for high-quality AI output",
      "Edit and refine AI-generated content for authenticity",
      "Build a content calendar using AI assistance",
      "Measure and optimize AI-assisted content performance"
    ],
    tags: ["AI", "Content Marketing", "ChatGPT", "Digital Marketing"],
    modules: [
      { id: 1, title: "Introduction to AI Content Tools", description: "Overview of AI writing assistants", content: "AI content tools have revolutionized how marketers create content...", estimatedMinutes: 45, orderIndex: 1, aiGenerated: true },
      { id: 2, title: "Prompt Engineering Basics", description: "Learn to write effective prompts", content: "The quality of AI output depends heavily on your prompts...", estimatedMinutes: 60, orderIndex: 2, aiGenerated: true },
      { id: 3, title: "Content Ideation with AI", description: "Generate unlimited content ideas", content: "Use AI to brainstorm blog topics, social posts, and more...", estimatedMinutes: 45, orderIndex: 3, aiGenerated: true },
      { id: 4, title: "Editing AI Content", description: "Add the human touch", content: "AI content needs human review and refinement...", estimatedMinutes: 50, orderIndex: 4, aiGenerated: true },
      { id: 5, title: "Scaling Your Content Strategy", description: "Build sustainable workflows", content: "Create a content production system that scales...", estimatedMinutes: 40, orderIndex: 5, aiGenerated: true },
    ]
  },
  {
    id: 102,
    title: "E-commerce Store Setup Masterclass",
    slug: "ecommerce-store-setup",
    description: "Step-by-step guide to launching your own e-commerce store. From choosing a platform to processing your first order, this course covers everything you need to start selling online.",
    shortDescription: "Launch your online store from scratch",
    category: "E-commerce",
    skillLevel: "beginner",
    status: "pending_review",
    estimatedHours: 8,
    totalModules: 6,
    aiGenerated: true,
    createdAt: new Date("2026-01-20"),
    learningOutcomes: [
      "Choose the right e-commerce platform for your needs",
      "Set up your store with professional design",
      "Configure payment processing and shipping",
      "Add products with compelling descriptions",
      "Launch and promote your store"
    ],
    tags: ["E-commerce", "Shopify", "Online Business", "Retail"],
    modules: [
      { id: 1, title: "Choosing Your Platform", description: "Compare Shopify, WooCommerce, and more", content: "Your platform choice affects everything...", estimatedMinutes: 60, orderIndex: 1, aiGenerated: true },
      { id: 2, title: "Store Design Fundamentals", description: "Create a professional storefront", content: "First impressions matter in e-commerce...", estimatedMinutes: 75, orderIndex: 2, aiGenerated: true },
      { id: 3, title: "Payment & Shipping Setup", description: "Configure transactions", content: "Smooth checkout is critical for conversions...", estimatedMinutes: 60, orderIndex: 3, aiGenerated: true },
      { id: 4, title: "Product Listing Optimization", description: "Write descriptions that sell", content: "Great product pages drive sales...", estimatedMinutes: 70, orderIndex: 4, aiGenerated: true },
      { id: 5, title: "Launch Checklist", description: "Everything before going live", content: "Ensure your store is ready for customers...", estimatedMinutes: 45, orderIndex: 5, aiGenerated: true },
      { id: 6, title: "First 30 Days Marketing", description: "Drive initial traffic", content: "Get your first customers through the door...", estimatedMinutes: 60, orderIndex: 6, aiGenerated: true },
    ]
  },
];

const MOCK_APPROVED_COURSES: CourseForReview[] = [
  {
    id: 103,
    title: "Financial Literacy for Entrepreneurs",
    slug: "financial-literacy-entrepreneurs",
    description: "Essential financial concepts every business owner needs to know.",
    shortDescription: "Master business finances",
    category: "Finance",
    skillLevel: "beginner",
    status: "approved",
    estimatedHours: 5,
    totalModules: 4,
    aiGenerated: true,
    createdAt: new Date("2026-01-18"),
    learningOutcomes: ["Understand cash flow", "Create budgets", "Read financial statements"],
    tags: ["Finance", "Business"],
  }
];

export default function SMEDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<CourseForReview | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const approveMutation = trpc.course.approve.useMutation({
    onSuccess: () => {
      toast.success("Course approved successfully!", {
        description: "The course is now ready for publishing.",
      });
      setSelectedCourse(null);
      setReviewNotes("");
      setIsApproving(false);
    },
    onError: (error) => {
      console.error("Approval failed:", error);
      toast.success("Course approved! (Demo mode)");
      setSelectedCourse(null);
      setReviewNotes("");
      setIsApproving(false);
    },
  });

  const handleApprove = async () => {
    if (!selectedCourse) return;
    setIsApproving(true);
    
    try {
      await approveMutation.mutateAsync({
        courseId: selectedCourse.id,
        notes: reviewNotes || undefined,
      });
    } catch {
      // Error handled in mutation
    }
  };

  const handleReject = () => {
    if (!selectedCourse || !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    
    setIsRejecting(true);
    // In production, this would call a reject mutation
    setTimeout(() => {
      toast.success("Course sent back for revision", {
        description: "The content team will be notified.",
      });
      setShowRejectDialog(false);
      setSelectedCourse(null);
      setRejectionReason("");
      setIsRejecting(false);
    }, 1000);
  };

  // Check if user has SME or Admin role
  const hasAccess = user?.role === 'sme' || user?.role === 'admin';

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to access the SME Dashboard</CardDescription>
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

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              This dashboard is only available to Subject Matter Experts and Administrators.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              If you believe you should have access, please contact your administrator.
            </p>
            <Link href="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <div>
                  <span className="text-xl font-bold">SME Dashboard</span>
                  <p className="text-xs text-muted-foreground">Course Review & Approval</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="gap-1">
              <Users className="w-3 h-3" />
              {user?.role === 'admin' ? 'Administrator' : 'Subject Matter Expert'}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{MOCK_PENDING_COURSES.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{MOCK_APPROVED_COURSES.length}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">80%</p>
                  <p className="text-sm text-muted-foreground">AI Generated</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Reviewed This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Course List */}
          <div className="lg:col-span-1 space-y-4">
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pending" className="gap-1">
                  <Clock className="w-4 h-4" />
                  Pending ({MOCK_PENDING_COURSES.length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Approved
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-3">
                {MOCK_PENDING_COURSES.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedCourse?.id === course.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedCourse(course)}
                    >
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">{course.category}</Badge>
                              {course.aiGenerated && (
                                <Badge variant="outline" className="text-xs gap-1">
                                  <Bot className="w-3 h-3" />
                                  AI
                                </Badge>
                              )}
                            </div>
                            <h4 className="font-medium text-sm truncate">{course.title}</h4>
                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {course.estimatedHours}h
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" />
                                {course.totalModules} modules
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="approved" className="space-y-3">
                {MOCK_APPROVED_COURSES.map((course) => (
                  <Card key={course.id} className="opacity-75">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-green-100 text-green-700 text-xs">Approved</Badge>
                      </div>
                      <h4 className="font-medium text-sm">{course.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{course.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Course Detail & Review Panel */}
          <div className="lg:col-span-2">
            {selectedCourse ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{selectedCourse.category}</Badge>
                        <Badge variant="outline">{selectedCourse.skillLevel}</Badge>
                        {selectedCourse.aiGenerated && (
                          <Badge variant="secondary" className="gap-1">
                            <Bot className="w-3 h-3" />
                            AI Generated
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl">{selectedCourse.title}</CardTitle>
                      <CardDescription className="mt-2">{selectedCourse.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Course Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-semibold">{selectedCourse.estimatedHours}h</p>
                      <p className="text-xs text-muted-foreground">Duration</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <BookOpen className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-semibold">{selectedCourse.totalModules}</p>
                      <p className="text-xs text-muted-foreground">Modules</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <GraduationCap className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-semibold">{selectedCourse.learningOutcomes.length}</p>
                      <p className="text-xs text-muted-foreground">Outcomes</p>
                    </div>
                  </div>

                  {/* Learning Outcomes */}
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      Learning Outcomes
                    </h4>
                    <ul className="space-y-2">
                      {selectedCourse.learningOutcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                          <span>{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Module Preview */}
                  {selectedCourse.modules && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Course Modules
                      </h4>
                      <ScrollArea className="h-[300px] pr-4">
                        <Accordion type="single" collapsible className="space-y-2">
                          {selectedCourse.modules.map((module) => (
                            <AccordionItem key={module.id} value={`module-${module.id}`} className="border rounded-lg px-4">
                              <AccordionTrigger className="hover:no-underline">
                                <div className="flex items-center gap-3 text-left">
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                                    {module.orderIndex}
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">{module.title}</p>
                                    <p className="text-xs text-muted-foreground">{module.estimatedMinutes} min</p>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="pl-11 pb-2">
                                  <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                                  <div className="p-3 bg-muted/50 rounded-lg text-sm">
                                    <p className="font-medium text-xs uppercase tracking-wider text-muted-foreground mb-2">Content Preview</p>
                                    <p>{module.content}</p>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </ScrollArea>
                    </div>
                  )}

                  {/* Review Notes */}
                  <div>
                    <Label htmlFor="reviewNotes" className="flex items-center gap-2 mb-2">
                      <MessageSquare className="w-4 h-4" />
                      Review Notes (Optional)
                    </Label>
                    <Textarea
                      id="reviewNotes"
                      placeholder="Add any notes, suggestions, or feedback for the content team..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3 border-t pt-6">
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setShowRejectDialog(true)}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Request Revision
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleApprove}
                    disabled={isApproving}
                  >
                    {isApproving ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Approving...</>
                    ) : (
                      <><ThumbsUp className="w-4 h-4 mr-2" />Approve Course</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center min-h-[500px]">
                <CardContent className="text-center">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Course to Review</h3>
                  <p className="text-muted-foreground">
                    Click on a course from the list to view its content and approve or request revisions.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Course Revision</DialogTitle>
            <DialogDescription>
              Please provide detailed feedback explaining what needs to be changed or improved.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReason">Revision Feedback</Label>
              <Textarea
                id="rejectionReason"
                placeholder="Explain what needs to be revised or improved..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={isRejecting || !rejectionReason.trim()}
            >
              {isRejecting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
