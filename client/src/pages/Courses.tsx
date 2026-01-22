import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { VideoCarousel } from "@/components/ui/video-carousel";
import { PAGE_VIDEO_SETS } from "@/lib/videoAssets";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Search, 
  Clock, 
  BookOpen,
  Star,
  Users,
  Filter,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Play,
  TrendingUp
} from "lucide-react";

// Mock courses data for demo
const MOCK_COURSES = [
  {
    id: 1,
    title: "Digital Marketing Fundamentals",
    slug: "digital-marketing-fundamentals",
    shortDescription: "Master the essentials of digital marketing including SEO, social media, and content strategy.",
    category: "Marketing",
    skillLevel: "beginner",
    estimatedHours: 8,
    totalModules: 6,
    status: "published",
    demandScore: 92,
    tags: ["SEO", "Social Media", "Content Marketing"],
    enrolledCount: 1247,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Entrepreneurship 101",
    slug: "entrepreneurship-101",
    shortDescription: "Learn how to start and grow your own business from idea to execution.",
    category: "Business",
    skillLevel: "beginner",
    estimatedHours: 12,
    totalModules: 8,
    status: "published",
    demandScore: 95,
    tags: ["Business Planning", "Startup", "Leadership"],
    enrolledCount: 2103,
    rating: 4.9,
  },
  {
    id: 3,
    title: "AI Literacy for Business",
    slug: "ai-literacy-business",
    shortDescription: "Understand how AI can transform your business and learn practical applications.",
    category: "Technology",
    skillLevel: "intermediate",
    estimatedHours: 6,
    totalModules: 5,
    status: "published",
    demandScore: 88,
    tags: ["AI", "Automation", "Innovation"],
    enrolledCount: 892,
    rating: 4.7,
  },
  {
    id: 4,
    title: "Financial Management for Entrepreneurs",
    slug: "financial-management-entrepreneurs",
    shortDescription: "Master budgeting, cash flow management, and financial planning for your business.",
    category: "Finance",
    skillLevel: "intermediate",
    estimatedHours: 10,
    totalModules: 7,
    status: "published",
    demandScore: 85,
    tags: ["Budgeting", "Cash Flow", "Accounting"],
    enrolledCount: 756,
    rating: 4.6,
  },
  {
    id: 5,
    title: "E-commerce Mastery",
    slug: "ecommerce-mastery",
    shortDescription: "Build and scale your online store with proven strategies and tools.",
    category: "E-commerce",
    skillLevel: "intermediate",
    estimatedHours: 15,
    totalModules: 10,
    status: "published",
    demandScore: 90,
    tags: ["Shopify", "Amazon", "Dropshipping"],
    enrolledCount: 1534,
    rating: 4.8,
  },
  {
    id: 6,
    title: "Personal Branding & LinkedIn",
    slug: "personal-branding-linkedin",
    shortDescription: "Build a powerful personal brand and leverage LinkedIn for career growth.",
    category: "Marketing",
    skillLevel: "beginner",
    estimatedHours: 5,
    totalModules: 4,
    status: "published",
    demandScore: 82,
    tags: ["LinkedIn", "Networking", "Personal Brand"],
    enrolledCount: 2341,
    rating: 4.7,
  },
  {
    id: 7,
    title: "Project Management Essentials",
    slug: "project-management-essentials",
    shortDescription: "Learn project management methodologies and tools to deliver successful projects.",
    category: "Business",
    skillLevel: "beginner",
    estimatedHours: 8,
    totalModules: 6,
    status: "published",
    demandScore: 78,
    tags: ["Agile", "Scrum", "Planning"],
    enrolledCount: 987,
    rating: 4.5,
  },
  {
    id: 8,
    title: "Advanced Social Media Strategy",
    slug: "advanced-social-media-strategy",
    shortDescription: "Take your social media marketing to the next level with advanced tactics.",
    category: "Marketing",
    skillLevel: "advanced",
    estimatedHours: 10,
    totalModules: 8,
    status: "published",
    demandScore: 86,
    tags: ["Instagram", "TikTok", "Ads"],
    enrolledCount: 654,
    rating: 4.8,
  },
  {
    id: 9,
    title: "Business Communication Skills",
    slug: "business-communication-skills",
    shortDescription: "Master professional communication for presentations, negotiations, and networking.",
    category: "Business",
    skillLevel: "beginner",
    estimatedHours: 6,
    totalModules: 5,
    status: "published",
    demandScore: 80,
    tags: ["Public Speaking", "Writing", "Negotiation"],
    enrolledCount: 1123,
    rating: 4.6,
  },
  {
    id: 10,
    title: "Web Design for Non-Designers",
    slug: "web-design-non-designers",
    shortDescription: "Create beautiful websites without coding using modern no-code tools.",
    category: "Technology",
    skillLevel: "beginner",
    estimatedHours: 8,
    totalModules: 6,
    status: "published",
    demandScore: 84,
    tags: ["Canva", "Wix", "WordPress"],
    enrolledCount: 876,
    rating: 4.7,
  },
  {
    id: 11,
    title: "Customer Service Excellence",
    slug: "customer-service-excellence",
    shortDescription: "Build customer loyalty through exceptional service and support strategies.",
    category: "Business",
    skillLevel: "beginner",
    estimatedHours: 5,
    totalModules: 4,
    status: "published",
    demandScore: 75,
    tags: ["Support", "CRM", "Retention"],
    enrolledCount: 543,
    rating: 4.5,
  },
  {
    id: 12,
    title: "Data Analytics Fundamentals",
    slug: "data-analytics-fundamentals",
    shortDescription: "Learn to analyze data and make data-driven business decisions.",
    category: "Technology",
    skillLevel: "intermediate",
    estimatedHours: 12,
    totalModules: 8,
    status: "published",
    demandScore: 89,
    tags: ["Excel", "Google Analytics", "Visualization"],
    enrolledCount: 765,
    rating: 4.6,
  },
];

const CATEGORIES = ["All", "Marketing", "Business", "Technology", "Finance", "E-commerce"];
const SKILL_LEVELS = ["All Levels", "beginner", "intermediate", "advanced"];

export default function Courses() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");

  const { data: enrollments } = trpc.course.getEnrollments.useQuery(undefined, { enabled: isAuthenticated });
  const enrollMutation = trpc.course.enroll.useMutation({
    onSuccess: () => {
      toast.success("Successfully enrolled in course!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to enroll");
    },
  });

  const filteredCourses = MOCK_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All Levels" || course.skillLevel === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const isEnrolled = (courseId: number) => {
    return enrollments?.some(e => e.courseId === courseId);
  };

  const getEnrollmentProgress = (courseId: number) => {
    const enrollment = enrollments?.find(e => e.courseId === courseId);
    return enrollment?.progress || 0;
  };

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
        videos={PAGE_VIDEO_SETS.courses}
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
                <TrendingUp className="w-3 h-3 mr-1" />
                25+ AI-Powered Courses
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Build Skills That Matter
              </h1>
              <p className="text-lg text-white/90 drop-shadow-md">
                Personalized learning paths designed specifically for entrepreneurs and career changers
              </p>
            </motion.div>
          </div>
        </div>
      </VideoCarousel>

      <div className="container py-8">

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search courses..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Skill Level" />
            </SelectTrigger>
            <SelectContent>
              {SKILL_LEVELS.map(level => (
                <SelectItem key={level} value={level}>
                  {level === "All Levels" ? level : level.charAt(0).toUpperCase() + level.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="text-muted-foreground mb-6">
          Showing {filteredCourses.length} of {MOCK_COURSES.length} courses
        </p>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary">{course.category}</Badge>
                  <Badge className={getLevelColor(course.skillLevel)}>
                    {course.skillLevel}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-2">{course.shortDescription}</CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {course.estimatedHours}h
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {course.totalModules} modules
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {course.enrolledCount.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    {course.rating}
                  </div>
                </div>

                {isEnrolled(course.id) && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{getEnrollmentProgress(course.id)}%</span>
                    </div>
                    <Progress value={getEnrollmentProgress(course.id)} className="h-2" />
                  </div>
                )}
              </CardContent>
              
              <CardFooter>
                {isEnrolled(course.id) ? (
                  <Link href={`/courses/${course.slug}`} className="w-full">
                    <Button className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    className="w-full"
                    onClick={() => enrollMutation.mutate({ courseId: course.id })}
                    disabled={enrollMutation.isPending || !isAuthenticated}
                  >
                    {!isAuthenticated ? "Sign in to Enroll" : "Enroll Now"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <GraduationCap className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
