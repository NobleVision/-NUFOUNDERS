import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { 
  User, 
  Briefcase, 
  Target, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Heart,
  Rocket
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Personal Info", icon: User, description: "Tell us about yourself" },
  { id: 2, title: "Background", icon: Briefcase, description: "Your work experience" },
  { id: 3, title: "Skills & Interests", icon: GraduationCap, description: "What you know and love" },
  { id: 4, title: "Goals", icon: Target, description: "Where you want to go" },
  { id: 5, title: "Complete", icon: CheckCircle, description: "You're all set!" },
];

const SKILLS = [
  "Marketing", "Sales", "Customer Service", "Project Management", "Data Analysis",
  "Social Media", "Content Writing", "Graphic Design", "Web Development", "Accounting",
  "HR Management", "Event Planning", "Public Speaking", "Leadership", "Negotiation",
  "Microsoft Office", "Google Workspace", "CRM Systems", "E-commerce", "Photography"
];

const INTERESTS = [
  "Digital Marketing", "E-commerce", "Consulting", "Coaching", "Event Planning",
  "Food & Beverage", "Fashion & Beauty", "Health & Wellness", "Education", "Technology",
  "Real Estate", "Finance", "Non-profit", "Creative Arts", "Home Services"
];

const BUSINESS_GOALS = [
  "Start my own business", "Freelance/Consulting", "Find new employment",
  "Transition to tech", "Build passive income", "Grow existing business",
  "Learn new skills", "Network with others", "Access funding"
];

const UNMET_NEEDS = [
  "Business funding", "Technical skills", "Marketing knowledge", "Legal guidance",
  "Accounting help", "Mentorship", "Networking opportunities", "Childcare support",
  "Transportation", "Healthcare", "Housing stability", "Mental health support"
];

export default function Onboarding() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    age: "",
    city: "",
    state: "",
    displacementReason: "",
    displacementDate: "",
    previousIndustry: "",
    previousRole: "",
    yearsExperience: "",
    skills: [] as string[],
    interests: [] as string[],
    businessGoals: [] as string[],
    unmetNeeds: [] as string[],
    capitalAvailable: "",
    monthlyIncomeGoal: "",
    bio: "",
    linkedinUrl: "",
  });

  const utils = trpc.useUtils();
  const upsertProfile = trpc.profile.upsert.useMutation();
  const completeOnboarding = trpc.profile.completeOnboarding.useMutation();

  const handleNext = async () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      await upsertProfile.mutateAsync({
        age: formData.age ? parseInt(formData.age) : undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        displacementReason: formData.displacementReason as any || undefined,
        previousIndustry: formData.previousIndustry || undefined,
        previousRole: formData.previousRole || undefined,
        yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience) : undefined,
        skills: formData.skills,
        interests: formData.interests,
        businessGoals: formData.businessGoals,
        unmetNeeds: formData.unmetNeeds,
        capitalAvailable: formData.capitalAvailable || undefined,
        monthlyIncomeGoal: formData.monthlyIncomeGoal || undefined,
        bio: formData.bio || undefined,
        linkedinUrl: formData.linkedinUrl || undefined,
      });
      
      await completeOnboarding.mutateAsync();
      await utils.auth.me.invalidate();
      toast.success("Profile completed! Welcome to NuFounders!");
      setLocation("/dashboard");
    } catch (error) {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const toggleArrayItem = (array: string[], item: string, setter: (items: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">NuFounders</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Welcome, {user?.name || "Future Founder"}!
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Progress */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step.id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'}
                `}>
                  {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`w-12 md:w-24 h-1 mx-2 rounded ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
              {(() => {
                const StepIcon = STEPS[currentStep - 1].icon;
                return <StepIcon className="w-8 h-8 text-primary" />;
              })()}
            </div>
            <CardTitle className="text-2xl">{STEPS[currentStep - 1].title}</CardTitle>
            <CardDescription className="text-lg">{STEPS[currentStep - 1].description}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city" 
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state" 
                      placeholder="Enter your state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn URL (optional)</Label>
                    <Input 
                      id="linkedin" 
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Tell us about yourself</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Share a bit about your background, passions, and what drives you..."
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Background */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>What led to your career transition?</Label>
                  <Select 
                    value={formData.displacementReason}
                    onValueChange={(value) => setFormData({ ...formData, displacementReason: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="layoff">Layoff / Downsizing</SelectItem>
                      <SelectItem value="automation">Job Automation</SelectItem>
                      <SelectItem value="industry_shift">Industry Changes</SelectItem>
                      <SelectItem value="company_closure">Company Closure</SelectItem>
                      <SelectItem value="relocation">Relocation</SelectItem>
                      <SelectItem value="health">Health Reasons</SelectItem>
                      <SelectItem value="caregiving">Caregiving Responsibilities</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="previousIndustry">Previous Industry</Label>
                    <Input 
                      id="previousIndustry" 
                      placeholder="e.g., Healthcare, Retail, Finance"
                      value={formData.previousIndustry}
                      onChange={(e) => setFormData({ ...formData, previousIndustry: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="previousRole">Previous Role</Label>
                    <Input 
                      id="previousRole" 
                      placeholder="e.g., Manager, Specialist, Coordinator"
                      value={formData.previousRole}
                      onChange={(e) => setFormData({ ...formData, previousRole: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Years of Experience</Label>
                  <Input 
                    id="yearsExperience" 
                    type="number"
                    placeholder="Total years of work experience"
                    value={formData.yearsExperience}
                    onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Skills & Interests */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Select your skills (choose all that apply)</Label>
                  <div className="flex flex-wrap gap-2">
                    {SKILLS.map((skill) => (
                      <Badge 
                        key={skill}
                        variant={formData.skills.includes(skill) ? "default" : "outline"}
                        className="cursor-pointer py-2 px-3"
                        onClick={() => toggleArrayItem(
                          formData.skills, 
                          skill, 
                          (items) => setFormData({ ...formData, skills: items })
                        )}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>What industries interest you?</Label>
                  <div className="flex flex-wrap gap-2">
                    {INTERESTS.map((interest) => (
                      <Badge 
                        key={interest}
                        variant={formData.interests.includes(interest) ? "default" : "outline"}
                        className="cursor-pointer py-2 px-3"
                        onClick={() => toggleArrayItem(
                          formData.interests, 
                          interest, 
                          (items) => setFormData({ ...formData, interests: items })
                        )}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Goals */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>What are your goals? (select all that apply)</Label>
                  <div className="flex flex-wrap gap-2">
                    {BUSINESS_GOALS.map((goal) => (
                      <Badge 
                        key={goal}
                        variant={formData.businessGoals.includes(goal) ? "default" : "outline"}
                        className="cursor-pointer py-2 px-3"
                        onClick={() => toggleArrayItem(
                          formData.businessGoals, 
                          goal, 
                          (items) => setFormData({ ...formData, businessGoals: items })
                        )}
                      >
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>What support do you need? (select all that apply)</Label>
                  <div className="flex flex-wrap gap-2">
                    {UNMET_NEEDS.map((need) => (
                      <Badge 
                        key={need}
                        variant={formData.unmetNeeds.includes(need) ? "default" : "outline"}
                        className="cursor-pointer py-2 px-3"
                        onClick={() => toggleArrayItem(
                          formData.unmetNeeds, 
                          need, 
                          (items) => setFormData({ ...formData, unmetNeeds: items })
                        )}
                      >
                        {need}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capital">Available Capital for Business</Label>
                    <Input 
                      id="capital" 
                      placeholder="e.g., 5000"
                      value={formData.capitalAvailable}
                      onChange={(e) => setFormData({ ...formData, capitalAvailable: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="incomeGoal">Monthly Income Goal</Label>
                    <Input 
                      id="incomeGoal" 
                      placeholder="e.g., 5000"
                      value={formData.monthlyIncomeGoal}
                      onChange={(e) => setFormData({ ...formData, monthlyIncomeGoal: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Complete */}
            {currentStep === 5 && (
              <div className="text-center space-y-6 py-8">
                <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <Rocket className="w-12 h-12 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">You're All Set!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your profile is complete. We'll use this information to personalize your learning path 
                    and connect you with the right opportunities.
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Personalized course recommendations
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    AI-powered business ideas
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Community matching
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-border">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              
              {currentStep < 5 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  disabled={upsertProfile.isPending || completeOnboarding.isPending}
                >
                  {upsertProfile.isPending ? "Saving..." : "Go to Dashboard"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
