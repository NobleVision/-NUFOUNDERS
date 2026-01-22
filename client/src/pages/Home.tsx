import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VideoCarousel, useVideoList } from "@/components/ui/video-carousel";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  GraduationCap, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Award, 
  Heart,
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles,
  Target,
  Rocket
} from "lucide-react";

// Animation variants for reusable effects
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleOnHover = {
  whileHover: { scale: 1.02, y: -4 },
  whileTap: { scale: 0.98 },
  transition: { type: "spring", stiffness: 400, damping: 17 }
};

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { scrollYProgress } = useScroll();
  const heroVideos = useVideoList("/videos");

  const stats = [
    { label: "Women Empowered", value: "2,500+", icon: Users },
    { label: "Courses Available", value: "25+", icon: GraduationCap },
    { label: "Businesses Launched", value: "450+", icon: Briefcase },
    { label: "Funding Secured", value: "$2.5M+", icon: TrendingUp },
  ];

  const features = [
    {
      icon: GraduationCap,
      title: "AI-Powered Training",
      description: "Personalized learning paths with 25+ courses in digital marketing, entrepreneurship, AI literacy, and more.",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Briefcase,
      title: "Business Formation",
      description: "AI-generated business ideas scored for market demand, skills match, and capital requirements.",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: Users,
      title: "Community Network",
      description: "Connect with peers, mentors, and employers through forums, events, and group matching.",
      color: "bg-secondary/10 text-secondary-foreground",
    },
    {
      icon: Award,
      title: "Pitch Competitions",
      description: "Quarterly competitions with funding opportunities and investor access for your business.",
      color: "bg-chart-3/10 text-chart-3",
    },
    {
      icon: Heart,
      title: "Scholarships",
      description: "Access corporate-sponsored scholarships and funding opportunities tailored to your needs.",
      color: "bg-destructive/10 text-destructive",
    },
    {
      icon: Target,
      title: "Employer Portal",
      description: "Get discovered by employers actively seeking trained, motivated professionals.",
      color: "bg-chart-5/10 text-chart-5",
    },
  ];

  const testimonials = [
    {
      name: "Keisha Williams",
      role: "Founder, KW Digital Solutions",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop",
      quote: "NuFounders gave me the skills and confidence to launch my own digital marketing agency. The AI-powered courses were exactly what I needed.",
    },
    {
      name: "Tamara Johnson",
      role: "E-commerce Entrepreneur",
      image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=100&h=100&fit=crop",
      quote: "After being laid off, I found NuFounders. Within 6 months, I launched my online store and secured $50K in funding through their pitch competition.",
    },
    {
      name: "Destiny Carter",
      role: "Tech Consultant",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
      quote: "The community here is incredible. I found my business partner, my first clients, and lifelong friends all through NuFounders.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">NuFounders</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">Courses</Link>
            <Link href="/business" className="text-muted-foreground hover:text-foreground transition-colors">Business</Link>
            <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">Community</Link>
            <Link href="/scholarships" className="text-muted-foreground hover:text-foreground transition-colors">Scholarships</Link>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button variant="ghost">Sign In</Button>
                </a>
                <a href={getLoginUrl()}>
                  <Button>Get Started</Button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Video Background */}
      <VideoCarousel
        videos={heroVideos}
        interval={10000}
        className="min-h-screen"
      >
        <section className="pt-32 pb-20 px-4 min-h-screen flex items-center">
          <div className="container relative">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Star className="w-3 h-3 mr-1" />
                  Empowering Displaced Black Women Since 2024
                </Badge>
              </motion.div>
              
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <span className="bg-gradient-to-r from-white via-white to-primary-foreground bg-clip-text">
                  Your New Beginning
                </span>
                <br />
                <motion.span
                  className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Starts Here
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                AI-powered training, business formation support, and a thriving community to help you build the career and business of your dreams.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <motion.a 
                  href={isAuthenticated ? "/dashboard" : getLoginUrl()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30">
                    Start Your Journey
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.a>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/courses">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                      Explore Courses
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Floating Stats Preview */}
              <motion.div
                className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {[
                  { value: "2,500+", label: "Women Empowered" },
                  { value: "25+", label: "Courses" },
                  { value: "450+", label: "Businesses" },
                  { value: "$2.5M+", label: "Funding" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 + i * 0.1 }}
                  >
                    <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <span className="text-white/60 text-sm">Scroll to explore</span>
            <motion.div
              className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div
                className="w-1.5 h-3 bg-white/60 rounded-full"
                animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </section>
      </VideoCarousel>

      {/* Stats Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From personalized training to funding opportunities, we provide comprehensive support for your journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4">How It Works</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Your Path to Success</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Complete Onboarding", desc: "Tell us about your background, skills, and goals" },
              { step: "02", title: "Get Personalized Plan", desc: "AI analyzes your profile and recommends courses" },
              { step: "03", title: "Learn & Build", desc: "Complete training and develop your business idea" },
              { step: "04", title: "Launch & Grow", desc: "Pitch for funding and connect with opportunities" },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4">Success Stories</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Hear From Our Community</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container text-center">
          <Rocket className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Transform Your Future?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of women who have found their path to success through NuFounders.
          </p>
          <a href={isAuthenticated ? "/dashboard" : getLoginUrl()}>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/50 border-t border-border">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">NuFounders</span>
              </div>
              <p className="text-muted-foreground">
                Empowering displaced Black women through AI-powered training and entrepreneurship support.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/courses" className="hover:text-foreground">Courses</Link></li>
                <li><Link href="/business" className="hover:text-foreground">Business Formation</Link></li>
                <li><Link href="/community" className="hover:text-foreground">Community</Link></li>
                <li><Link href="/events" className="hover:text-foreground">Events</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/scholarships" className="hover:text-foreground">Scholarships</Link></li>
                <li><a href="#" className="hover:text-foreground">Success Stories</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>hello@nufounders.com</li>
                <li>1-800-NUFOUND</li>
                <li>Atlanta, GA</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2026 NuFounders. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Service</a>
              <a href="#" className="hover:text-foreground">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
