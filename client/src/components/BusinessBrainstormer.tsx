import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Sparkles,
  DollarSign,
  Clock,
  Target,
  TrendingUp,
  Loader2,
  Plus,
  ChevronRight,
  Briefcase,
  Zap,
  ArrowRight
} from "lucide-react";

interface BrainstormIdea {
  title: string;
  description: string;
  whyItFits: string;
  estimatedStartupCost: string;
  potentialRevenue: string;
}

interface BrainstormResult {
  ideas: BrainstormIdea[];
  followUpQuestions: string[];
}

const TIME_OPTIONS = [
  { value: "part-time", label: "Part-time (10-20 hrs/week)" },
  { value: "full-time", label: "Full-time (40+ hrs/week)" },
  { value: "side-hustle", label: "Side hustle (5-10 hrs/week)" },
  { value: "flexible", label: "Flexible schedule" },
];

const SKILL_SUGGESTIONS = [
  "Marketing", "Sales", "Writing", "Design", "Technology", "Teaching",
  "Event Planning", "Consulting", "Customer Service", "Project Management",
  "Social Media", "Photography", "Cooking", "Crafts", "Finance"
];

export function BusinessBrainstormer() {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [capitalAvailable, setCapitalAvailable] = useState(5000);
  const [timeAvailable, setTimeAvailable] = useState("full-time");
  const [preferences, setPreferences] = useState("");
  const [result, setResult] = useState<BrainstormResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<BrainstormIdea | null>(null);

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addInterest = (interest: string) => {
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };

  const handleBrainstorm = useCallback(async () => {
    if (skills.length === 0 && interests.length === 0) {
      toast.error("Please add at least one skill or interest");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call for demo
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock result
    const mockResult: BrainstormResult = {
      ideas: [
        {
          title: "Virtual Event Coordination Service",
          description: "Help businesses and individuals plan and execute memorable virtual and hybrid events. Manage everything from platform selection to attendee engagement strategies.",
          whyItFits: "Your event planning and technology skills are perfect for this growing market. Post-pandemic, businesses still need help navigating virtual events effectively.",
          estimatedStartupCost: "$2,000 - $5,000",
          potentialRevenue: "$5,000 - $15,000/month"
        },
        {
          title: "Social Media Management Agency",
          description: "Offer done-for-you social media management for local businesses and personal brands. Create content calendars, manage engagement, and run targeted ad campaigns.",
          whyItFits: "With your marketing and social media skills, you can help small businesses that lack the time or expertise to maintain a consistent online presence.",
          estimatedStartupCost: "$1,000 - $3,000",
          potentialRevenue: "$3,000 - $10,000/month"
        },
        {
          title: "Online Course Creator & Coach",
          description: "Package your expertise into online courses and coaching programs. Use platforms like Teachable or Kajabi to reach students globally.",
          whyItFits: "Your teaching background combined with your subject expertise creates a perfect foundation for sharing knowledge at scale.",
          estimatedStartupCost: "$500 - $2,000",
          potentialRevenue: "$2,000 - $20,000/month"
        },
        {
          title: "E-commerce Personal Shopper",
          description: "Help busy professionals curate wardrobes or find specific products. Offer subscription boxes or one-time shopping services with personalized recommendations.",
          whyItFits: "Your eye for detail and customer service skills translate well into providing personalized shopping experiences.",
          estimatedStartupCost: "$1,500 - $4,000",
          potentialRevenue: "$4,000 - $12,000/month"
        }
      ],
      followUpQuestions: [
        "Do you have any industry-specific experience that could give you a competitive edge?",
        "Are you interested in working with businesses (B2B) or consumers (B2C)?",
        "Would you prefer a service-based or product-based business?",
        "Do you have an existing network you could leverage for your first clients?"
      ]
    };

    setResult(mockResult);
    setIsLoading(false);
    toast.success("Ideas generated! Review your personalized suggestions below.");
  }, [skills, interests]);

  const formatCapital = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value}`;
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-secondary" />
            Business Idea Brainstormer
          </CardTitle>
          <CardDescription>
            Tell us about yourself and we'll generate personalized business ideas that match your skills and resources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Skills */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Your Skills
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeSkill(skill)}
                >
                  {skill} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill(newSkill))}
              />
              <Button variant="outline" onClick={() => addSkill(newSkill)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 8).map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => addSkill(skill)}
                >
                  + {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Your Interests
            </Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => removeInterest(interest)}
                >
                  {interest} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add an interest..."
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest(newInterest))}
              />
              <Button variant="outline" onClick={() => addInterest(newInterest)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Capital & Time */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Available Capital: {formatCapital(capitalAvailable)}
              </Label>
              <Slider
                value={[capitalAvailable]}
                onValueChange={([value]) => setCapitalAvailable(value)}
                min={500}
                max={50000}
                step={500}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$500</span>
                <span>$50,000</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time Available
              </Label>
              <Select value={timeAvailable} onValueChange={setTimeAvailable}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <Label>Additional Preferences or Constraints (Optional)</Label>
            <Textarea
              placeholder="E.g., 'I want to work from home', 'I prefer B2B over B2C', 'I have access to a commercial kitchen'..."
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={handleBrainstorm}
            disabled={isLoading || (skills.length === 0 && interests.length === 0)}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Business Ideas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Ideas Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {result.ideas.map((idea, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedIdea?.title === idea.title
                        ? "ring-2 ring-primary border-primary"
                        : ""
                    }`}
                    onClick={() => setSelectedIdea(selectedIdea?.title === idea.title ? null : idea)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{idea.title}</CardTitle>
                        <Badge variant="outline" className="flex-shrink-0">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          #{idx + 1}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {idea.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 rounded bg-muted/50">
                          <p className="text-xs text-muted-foreground">Startup Cost</p>
                          <p className="font-medium">{idea.estimatedStartupCost}</p>
                        </div>
                        <div className="p-2 rounded bg-green-50 dark:bg-green-950">
                          <p className="text-xs text-muted-foreground">Revenue Potential</p>
                          <p className="font-medium text-green-600">{idea.potentialRevenue}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Selected Idea Detail */}
            <AnimatePresence>
              {selectedIdea && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        {selectedIdea.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Description</h4>
                        <p className="text-muted-foreground">{selectedIdea.description}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-primary">Why This Fits You</h4>
                        <p className="text-muted-foreground">{selectedIdea.whyItFits}</p>
                      </div>
                      <div className="flex gap-4">
                        <Button variant="outline" className="flex-1">
                          Learn More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button className="flex-1">
                          <Plus className="w-4 h-4 mr-2" />
                          Create This Idea
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Follow-up Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-secondary" />
                  Refine Your Results
                </CardTitle>
                <CardDescription>
                  Answer these questions to get more targeted suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.followUpQuestions.map((question, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-secondary">{idx + 1}</span>
                      </div>
                      <span className="text-sm">{question}</span>
                      <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BusinessBrainstormer;
