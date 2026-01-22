import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoCarousel } from "@/components/ui/video-carousel";
import { PAGE_VIDEO_SETS } from "@/lib/videoAssets";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  Users, 
  MessageSquare,
  Heart,
  Search,
  Plus,
  ArrowLeft,
  Sparkles,
  UserPlus,
  Globe,
  Briefcase,
  GraduationCap,
  MapPin,
  Clock,
  TrendingUp,
  HandHeart
} from "lucide-react";

// Mock forum posts
const MOCK_POSTS = [
  {
    id: 1,
    title: "How I landed my first client in 30 days",
    content: "After completing the Digital Marketing course, I immediately started applying what I learned. Here's my step-by-step process...",
    author: { name: "Keisha Williams", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop" },
    category: "Success Stories",
    likes: 47,
    replies: 23,
    createdAt: new Date("2026-01-20"),
  },
  {
    id: 2,
    title: "Best resources for learning e-commerce?",
    content: "I'm looking to start an online store but feeling overwhelmed. What courses or resources would you recommend?",
    author: { name: "Tamara Johnson", avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=100&h=100&fit=crop" },
    category: "Questions",
    likes: 12,
    replies: 18,
    createdAt: new Date("2026-01-19"),
  },
  {
    id: 3,
    title: "Networking event in Atlanta - Jan 28th",
    content: "Organizing an in-person meetup for NuFounders members in the Atlanta area. Let's connect and share our journeys!",
    author: { name: "Destiny Carter", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop" },
    category: "Events",
    likes: 89,
    replies: 45,
    createdAt: new Date("2026-01-18"),
  },
  {
    id: 4,
    title: "Tips for the pitch competition",
    content: "For those preparing for the Q1 pitch competition, here are some tips from a previous winner...",
    author: { name: "Michelle Roberts", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop" },
    category: "Tips & Advice",
    likes: 156,
    replies: 67,
    createdAt: new Date("2026-01-17"),
  },
];

// Mock peer groups
const MOCK_GROUPS = [
  {
    id: 1,
    name: "Women in Tech",
    description: "Connect with fellow women building tech businesses and careers",
    members: 342,
    category: "Technology",
    isJoined: true,
  },
  {
    id: 2,
    name: "Atlanta Entrepreneurs",
    description: "Local networking group for Atlanta-based founders",
    members: 156,
    category: "Local",
    isJoined: false,
  },
  {
    id: 3,
    name: "E-commerce Builders",
    description: "Share tips, strategies, and wins in the e-commerce space",
    members: 278,
    category: "E-commerce",
    isJoined: true,
  },
  {
    id: 4,
    name: "Marketing Mavens",
    description: "Digital marketing strategies and best practices",
    members: 421,
    category: "Marketing",
    isJoined: false,
  },
];

// Mock members for networking
const MOCK_MEMBERS = [
  {
    id: 1,
    name: "Keisha Williams",
    title: "Digital Marketing Consultant",
    location: "Atlanta, GA",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop",
    skills: ["SEO", "Social Media", "Content Marketing"],
    matchScore: 92,
  },
  {
    id: 2,
    name: "Tamara Johnson",
    title: "E-commerce Entrepreneur",
    location: "Houston, TX",
    avatar: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=100&h=100&fit=crop",
    skills: ["E-commerce", "Product Sourcing", "Amazon FBA"],
    matchScore: 87,
  },
  {
    id: 3,
    name: "Destiny Carter",
    title: "Tech Consultant",
    location: "Chicago, IL",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
    skills: ["AI/ML", "Data Analytics", "Consulting"],
    matchScore: 85,
  },
  {
    id: 4,
    name: "Michelle Roberts",
    title: "Business Coach",
    location: "New York, NY",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
    skills: ["Business Strategy", "Leadership", "Public Speaking"],
    matchScore: 81,
  },
];

export default function Community() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const CATEGORIES = ["All", "Success Stories", "Questions", "Tips & Advice", "Events", "Introductions"];

  const filteredPosts = MOCK_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        videos={PAGE_VIDEO_SETS.community}
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
                <HandHeart className="w-3 h-3 mr-1" />
                Sisterhood & Support
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Connect & Grow Together
              </h1>
              <p className="text-lg text-white/90 drop-shadow-md">
                Join a community of 2,500+ women entrepreneurs supporting each other
              </p>
            </motion.div>
          </div>
        </div>
      </VideoCarousel>

      <div className="container py-8">

        <Tabs defaultValue="forum" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="forum">Forum</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>

          {/* Forum Tab */}
          <TabsContent value="forum" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Search discussions..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
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
            </div>

            {/* New Post Button */}
            <div className="flex justify-end">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Start Discussion
              </Button>
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={post.author.avatar} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                            <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                            <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{post.author.name}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.createdAt.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {post.replies}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Groups Tab */}
          <TabsContent value="groups" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {MOCK_GROUPS.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">{group.category}</Badge>
                      {group.isJoined && (
                        <Badge className="bg-green-100 text-green-700">Joined</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{group.name}</CardTitle>
                    <CardDescription>{group.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{group.members} members</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={group.isJoined ? "outline" : "default"}
                    >
                      {group.isJoined ? "View Group" : "Join Group"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Network Tab */}
          <TabsContent value="network" className="space-y-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI-Powered Matching</h3>
                    <p className="text-sm text-muted-foreground">
                      We use vector similarity to find members with complementary skills and goals
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {MOCK_MEMBERS.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.title}</p>
                          </div>
                          <Badge className="bg-primary/10 text-primary">
                            {member.matchScore}% match
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                          <MapPin className="w-4 h-4" />
                          {member.location}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {member.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button variant="outline" className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button className="flex-1">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
