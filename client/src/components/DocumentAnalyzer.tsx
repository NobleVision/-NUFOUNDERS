import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  Target,
  DollarSign,
  BarChart3,
  Loader2,
  ChevronRight,
  Award,
  Zap
} from "lucide-react";

interface DocumentAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  scores: {
    clarity: number;
    feasibility: number;
    marketPotential: number;
    financialViability: number;
    overall: number;
  };
  sections: {
    name: string;
    feedback: string;
    score: number;
  }[];
}

const DOCUMENT_TYPES = [
  { value: "business_plan", label: "Business Plan" },
  { value: "pitch_deck", label: "Pitch Deck" },
  { value: "financial_projection", label: "Financial Projections" },
  { value: "marketing_plan", label: "Marketing Plan" },
  { value: "resume", label: "Resume / CV" },
  { value: "other", label: "Other Document" },
];

export function DocumentAnalyzer() {
  const [documentText, setDocumentText] = useState("");
  const [documentType, setDocumentType] = useState("business_plan");
  const [businessContext, setBusinessContext] = useState("");
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock analysis for demo - replace with actual tRPC call when backend is ready
  const handleAnalyze = useCallback(async () => {
    if (!documentText.trim()) {
      toast.error("Please enter document content to analyze");
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call for demo
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock analysis result
    const mockAnalysis: DocumentAnalysis = {
      summary: "This business plan demonstrates a solid understanding of the target market and presents a compelling value proposition. The document shows strong potential but would benefit from more detailed financial projections and competitive analysis.",
      strengths: [
        "Clear and compelling problem statement that resonates with the target audience",
        "Well-defined target market with specific demographics and psychographics",
        "Innovative solution approach that differentiates from competitors",
        "Strong founder background and relevant industry experience",
        "Realistic timeline for initial launch and growth milestones"
      ],
      weaknesses: [
        "Financial projections lack detailed assumptions and sensitivity analysis",
        "Competitive landscape analysis could be more thorough",
        "Marketing strategy needs more specific tactics and budget allocation",
        "Risk mitigation strategies are not clearly outlined"
      ],
      suggestions: [
        "Add a detailed month-by-month financial projection for the first year",
        "Include a SWOT analysis to better position against competitors",
        "Develop specific customer acquisition strategies with cost estimates",
        "Create contingency plans for key risk scenarios",
        "Consider adding customer testimonials or letters of intent"
      ],
      scores: {
        clarity: 85,
        feasibility: 78,
        marketPotential: 82,
        financialViability: 70,
        overall: 79
      },
      sections: [
        { name: "Executive Summary", feedback: "Strong opening that captures attention. Consider adding key financial highlights.", score: 88 },
        { name: "Problem & Solution", feedback: "Well-articulated problem with clear solution. Add more customer validation data.", score: 85 },
        { name: "Market Analysis", feedback: "Good market sizing. Include more competitive differentiation.", score: 75 },
        { name: "Business Model", feedback: "Clear revenue streams. Add unit economics details.", score: 80 },
        { name: "Financial Projections", feedback: "Basic projections present. Need more detailed assumptions.", score: 65 }
      ]
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    toast.success("Document analysis complete!");
  }, [documentText]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Document Analyzer
          </CardTitle>
          <CardDescription>
            Upload or paste your business documents for AI-powered feedback and suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">Business Context (Optional)</Label>
              <Textarea
                id="context"
                placeholder="Brief description of your business or goals..."
                value={businessContext}
                onChange={(e) => setBusinessContext(e.target.value)}
                rows={1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">Document Content</Label>
            <Textarea
              id="document"
              placeholder="Paste your document content here... (business plan, pitch deck text, financial projections, etc.)"
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              rows={10}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {documentText.length.toLocaleString()} characters
            </p>
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !documentText.trim()}
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze Document
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Overall Score Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-20 h-20 rounded-2xl ${getScoreBgColor(analysis.scores.overall)} flex items-center justify-center`}>
                      <span className={`text-3xl font-bold ${getScoreColor(analysis.scores.overall)}`}>
                        {analysis.scores.overall}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Overall Score</h3>
                      <p className="text-muted-foreground">Based on clarity, feasibility, and market potential</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Clarity", score: analysis.scores.clarity, icon: Target },
                      { label: "Feasibility", score: analysis.scores.feasibility, icon: Zap },
                      { label: "Market", score: analysis.scores.marketPotential, icon: TrendingUp },
                      { label: "Financial", score: analysis.scores.financialViability, icon: DollarSign },
                    ].map((item, idx) => (
                      <div key={idx} className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                          {item.score}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                          <item.icon className="w-3 h-3" />
                          {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Tabs defaultValue="strengths" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="strengths" className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Strengths
                </TabsTrigger>
                <TabsTrigger value="improvements" className="flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Improvements
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" />
                  Suggestions
                </TabsTrigger>
                <TabsTrigger value="sections" className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4" />
                  Sections
                </TabsTrigger>
              </TabsList>

              <TabsContent value="strengths">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Key Strengths
                    </CardTitle>
                    <CardDescription>What's working well in your document</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.strengths.map((strength, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="improvements">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-yellow-600 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Areas for Improvement
                    </CardTitle>
                    <CardDescription>Opportunities to strengthen your document</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.weaknesses.map((weakness, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>{weakness}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="suggestions">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Actionable Suggestions
                    </CardTitle>
                    <CardDescription>Specific steps to improve your document</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.suggestions.map((suggestion, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-primary">{idx + 1}</span>
                          </div>
                          <span>{suggestion}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sections">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Section-by-Section Analysis
                    </CardTitle>
                    <CardDescription>Detailed feedback for each part of your document</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.sections.map((section, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-4 rounded-lg border border-border"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{section.name}</h4>
                            <Badge className={getScoreBgColor(section.score)}>
                              <span className={getScoreColor(section.score)}>{section.score}/100</span>
                            </Badge>
                          </div>
                          <Progress value={section.score} className="h-2 mb-2" />
                          <p className="text-sm text-muted-foreground">{section.feedback}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="flex-1">
                    <FileText className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Award className="w-4 h-4 mr-2" />
                    Get Expert Review
                  </Button>
                  <Button className="flex-1">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Apply to Pitch Competition
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DocumentAnalyzer;
