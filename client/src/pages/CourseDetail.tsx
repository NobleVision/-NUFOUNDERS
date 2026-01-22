import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import { toast } from "sonner";
import { 
  ArrowLeft,
  Clock, 
  BookOpen,
  Star,
  Users,
  CheckCircle,
  Play,
  Lock,
  Award,
  Sparkles
} from "lucide-react";

// Mock course detail data
const MOCK_COURSE_DETAIL = {
  id: 1,
  title: "Digital Marketing Fundamentals",
  slug: "digital-marketing-fundamentals",
  description: `This comprehensive course covers everything you need to know about digital marketing in today's competitive landscape. You'll learn the fundamentals of SEO, social media marketing, content strategy, email marketing, and paid advertising.

Designed specifically for displaced workers and aspiring entrepreneurs, this course provides practical, actionable skills that you can immediately apply to grow your business or enhance your career prospects.

By the end of this course, you'll have a solid foundation in digital marketing and be ready to create and execute effective marketing campaigns for any business.`,
  shortDescription: "Master the essentials of digital marketing including SEO, social media, and content strategy.",
  category: "Marketing",
  skillLevel: "beginner",
  estimatedHours: 8,
  totalModules: 6,
  status: "published",
  demandScore: 92,
  tags: ["SEO", "Social Media", "Content Marketing", "Email Marketing", "Analytics"],
  enrolledCount: 1247,
  rating: 4.8,
  learningOutcomes: [
    "Understand the fundamentals of digital marketing",
    "Create effective SEO strategies for organic growth",
    "Build and manage social media campaigns",
    "Develop content marketing strategies",
    "Analyze marketing metrics and optimize campaigns",
    "Create email marketing funnels that convert"
  ],
  modules: [
    {
      id: 1,
      title: "Introduction to Digital Marketing",
      description: "Overview of the digital marketing landscape and key concepts",
      estimatedMinutes: 45,
      lessons: 4,
    },
    {
      id: 2,
      title: "Search Engine Optimization (SEO)",
      description: "Learn how to optimize your content for search engines",
      estimatedMinutes: 90,
      lessons: 6,
    },
    {
      id: 3,
      title: "Social Media Marketing",
      description: "Master social media platforms for business growth",
      estimatedMinutes: 75,
      lessons: 5,
    },
    {
      id: 4,
      title: "Content Marketing Strategy",
      description: "Create compelling content that attracts and converts",
      estimatedMinutes: 60,
      lessons: 4,
    },
    {
      id: 5,
      title: "Email Marketing Fundamentals",
      description: "Build email lists and create effective campaigns",
      estimatedMinutes: 60,
      lessons: 4,
    },
    {
      id: 6,
      title: "Analytics and Optimization",
      description: "Measure, analyze, and improve your marketing efforts",
      estimatedMinutes: 50,
      lessons: 3,
    },
  ],
  instructor: {
    name: "Dr. Michelle Roberts",
    title: "Digital Marketing Expert",
    bio: "15+ years of experience in digital marketing, former CMO at Fortune 500 company",
  }
};

export default function CourseDetail() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();

  const { data: enrollments } = trpc.course.getEnrollments.useQuery(undefined, { enabled: isAuthenticated });
  const enrollMutation = trpc.course.enroll.useMutation({
    onSuccess: () => {
      toast.success("Successfully enrolled in course!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to enroll");
    },
  });

  // Use mock data for demo
  const course = MOCK_COURSE_DETAIL;
  const isEnrolled = enrollments?.some(e => e.courseId === course.id);
  const enrollment = enrollments?.find(e => e.courseId === course.id);
  const progress = enrollment?.progress || 0;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/courses">
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
            <Link href="/courses">
              <Button variant="outline">Back to Courses</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge className={getLevelColor(course.skillLevel)}>
                  {course.skillLevel}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-secondary text-secondary" />
                  {course.rating}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-lg text-muted-foreground">{course.shortDescription}</p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-5 h-5" />
                <span>{course.estimatedHours} hours</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="w-5 h-5" />
                <span>{course.totalModules} modules</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5" />
                <span>{course.enrolledCount.toLocaleString()} enrolled</span>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  {course.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground mb-4">{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Outcomes */}
            <Card>
              <CardHeader>
                <CardTitle>What You'll Learn</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{outcome}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card>
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>
                  {course.totalModules} modules • {course.estimatedHours} hours total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((module, index) => (
                    <AccordionItem key={module.id} value={`module-${module.id}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{module.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {module.lessons} lessons • {module.estimatedMinutes} min
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-12 py-2">
                          <p className="text-muted-foreground">{module.description}</p>
                          {isEnrolled ? (
                            <Button variant="outline" size="sm" className="mt-4">
                              <Play className="w-4 h-4 mr-2" />
                              Start Module
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2 mt-4 text-muted-foreground">
                              <Lock className="w-4 h-4" />
                              <span className="text-sm">Enroll to access</span>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Instructor */}
            <Card>
              <CardHeader>
                <CardTitle>Your Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {course.instructor.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{course.instructor.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{course.instructor.title}</p>
                    <p className="text-muted-foreground">{course.instructor.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                {isEnrolled ? (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Your Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>
                    <Button className="w-full" size="lg">
                      <Play className="w-5 h-5 mr-2" />
                      Continue Learning
                    </Button>
                    <div className="text-center text-sm text-muted-foreground">
                      {progress >= 100 ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <Award className="w-5 h-5" />
                          Course Completed!
                        </div>
                      ) : (
                        `${Math.round((100 - progress) / 100 * course.estimatedHours)} hours remaining`
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">FREE</div>
                      <p className="text-sm text-muted-foreground">Full access to all content</p>
                    </div>
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => enrollMutation.mutate({ courseId: course.id })}
                      disabled={enrollMutation.isPending || !isAuthenticated}
                    >
                      {!isAuthenticated ? "Sign in to Enroll" : "Enroll Now"}
                    </Button>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Full lifetime access
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Certificate of completion
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Access on mobile and desktop
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        Community support
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-medium mb-3">Topics Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
