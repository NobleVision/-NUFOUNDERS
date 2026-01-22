import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TTSPlayer } from "@/components/ui/tts-player";
import { parsePDF, isPDFError } from "@/lib/pdfParser";
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
  Linkedin,
  Briefcase,
  Award,
  Loader2,
  File,
  X,
  Zap,
  Users,
  Search
} from "lucide-react";

interface ResumeAnalysis {
  summary: string;
  atsScore: number;
  strengths: string[];
  improvements: string[];
  keywordSuggestions: string[];
  linkedInTips: string[];
  industryFit: {
    industry: string;
    score: number;
    recommendation: string;
  }[];
}

const TARGET_INDUSTRIES = [
  { value: "technology", label: "Technology / IT" },
  { value: "marketing", label: "Marketing / Digital" },
  { value: "finance", label: "Finance / Accounting" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "ecommerce", label: "E-commerce / Retail" },
  { value: "consulting", label: "Consulting" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
  { value: "nonprofit", label: "Non-profit" },
  { value: "other", label: "Other" },
];

export function ResumeOptimizer() {
  const [resumeText, setResumeText] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");
  const [targetIndustry, setTargetIndustry] = useState("technology");
  const [targetRole, setTargetRole] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeMutation = trpc.document.analyze.useMutation({
    onSuccess: (data) => {
      // Transform document analysis to resume-specific format
      const resumeAnalysis: ResumeAnalysis = {
        summary: data.summary,
        atsScore: data.scores.overall,
        strengths: data.strengths,
        improvements: data.weaknesses,
        keywordSuggestions: data.suggestions.slice(0, 5),
        linkedInTips: [
          "Add a professional headline that includes your target role and key skills",
          "Write a compelling About section that tells your career story",
          "Request recommendations from colleagues and supervisors",
          "Join industry-relevant groups and engage with content",
          "Use a professional photo with good lighting and a clean background",
        ],
        industryFit: [
          {
            industry: TARGET_INDUSTRIES.find(i => i.value === targetIndustry)?.label || targetIndustry,
            score: data.scores.marketPotential,
            recommendation: data.suggestions[0] || "Consider highlighting transferable skills",
          },
        ],
      };
      setAnalysis(resumeAnalysis);
      setIsAnalyzing(false);
      toast.success("Resume analysis complete!");
    },
    onError: (error) => {
      console.error("Analysis failed:", error);
      useMockAnalysis();
    },
  });

  const useMockAnalysis = useCallback(() => {
    const mockAnalysis: ResumeAnalysis = {
      summary: "Your resume demonstrates strong foundational skills and relevant experience. With some targeted improvements to keyword optimization and formatting, you can significantly increase your visibility to recruiters and ATS systems.",
      atsScore: 72,
      strengths: [
        "Clear chronological work history with quantifiable achievements",
        "Relevant skills section that aligns with target industry",
        "Professional formatting that is easy to scan",
        "Strong action verbs used throughout experience section",
      ],
      improvements: [
        "Add more industry-specific keywords to improve ATS matching",
        "Include metrics and quantifiable results for each role",
        "Add a professional summary at the top highlighting your value proposition",
        "Consider adding relevant certifications or continuing education",
        "Optimize section headers for ATS compatibility",
      ],
      keywordSuggestions: [
        "project management",
        "data analysis",
        "stakeholder communication",
        "strategic planning",
        "cross-functional collaboration",
        "process improvement",
        "budget management",
      ],
      linkedInTips: [
        "Add a professional headline: '[Target Role] | [Key Skill] | [Industry]'",
        "Write a compelling About section (2-3 paragraphs) telling your career story",
        "Request at least 3 recommendations from supervisors or colleagues",
        "Add relevant skills and get endorsements from connections",
        "Join 5-10 industry groups and engage with content weekly",
        "Use a professional headshot with good lighting",
        "Add media, projects, or publications to showcase your work",
      ],
      industryFit: [
        {
          industry: "Technology",
          score: 78,
          recommendation: "Strong fit - emphasize technical skills and data-driven achievements",
        },
        {
          industry: "Marketing",
          score: 72,
          recommendation: "Good fit - highlight communication skills and campaign results",
        },
        {
          industry: "Consulting",
          score: 68,
          recommendation: "Moderate fit - add more client-facing experience examples",
        },
      ],
    };
    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
    toast.success("Resume analysis complete! (Demo mode)");
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsParsing(true);
    setUploadedFile(file);
    
    const result = await parsePDF(file);
    
    if (isPDFError(result)) {
      toast.error(result.error, { description: result.details });
      setUploadedFile(null);
      setIsParsing(false);
      return;
    }
    
    setResumeText(result.text);
    toast.success(`Resume parsed successfully`, {
      description: `Extracted ${result.pageCount} page${result.pageCount > 1 ? 's' : ''} of content`,
    });
    setIsParsing(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const clearUploadedFile = useCallback(() => {
    setUploadedFile(null);
    setResumeText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!resumeText.trim()) {
      toast.error("Please upload or paste your resume content");
      return;
    }

    if (resumeText.length < 100) {
      toast.error("Resume content seems too short. Please provide more details.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      await analyzeMutation.mutateAsync({
        documentText: resumeText,
        documentType: "resume",
        businessContext: `Target industry: ${targetIndustry}. Target role: ${targetRole || 'Not specified'}. LinkedIn: ${linkedInUrl || 'Not provided'}`,
      });
    } catch {
      // Error handled in onError callback
    }
  }, [resumeText, targetIndustry, targetRole, linkedInUrl, analyzeMutation]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" />
            Resume & LinkedIn Optimizer
          </CardTitle>
          <CardDescription>
            Get AI-powered suggestions to improve your resume and LinkedIn profile for better job matches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetIndustry">Target Industry</Label>
              <Select value={targetIndustry} onValueChange={setTargetIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target industry" />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_INDUSTRIES.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role (Optional)</Label>
              <Input
                id="targetRole"
                placeholder="e.g., Marketing Manager, Software Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedInUrl">LinkedIn Profile URL (Optional)</Label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="linkedInUrl"
                placeholder="https://linkedin.com/in/yourprofile"
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* File Upload Zone */}
          <div className="space-y-2">
            <Label>Upload Resume (PDF)</Label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                transition-all duration-200
                ${isDragOver ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                ${isParsing ? 'pointer-events-none opacity-60' : ''}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileInputChange}
                className="hidden"
              />
              
              {isParsing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Parsing resume...</p>
                </div>
              ) : uploadedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <File className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={(e) => { e.stopPropagation(); clearUploadedFile(); }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Drop your resume here or click to browse</p>
                    <p className="text-xs text-muted-foreground">PDF format, up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or paste resume text</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resumeText">Resume Content</Label>
            <Textarea
              id="resumeText"
              placeholder="Paste your resume content here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{resumeText.length.toLocaleString()} characters</p>
            <Button onClick={handleAnalyze} disabled={isAnalyzing || !resumeText.trim()} size="lg">
              {isAnalyzing ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</>
              ) : (
                <><Sparkles className="w-4 h-4 mr-2" />Optimize Resume</>
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
            {/* ATS Score Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted/20" />
                        <circle
                          cx="48" cy="48" r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${analysis.atsScore * 2.51} 251`}
                          className={getScoreColor(analysis.atsScore).replace('text-', 'text-')}
                          style={{ stroke: analysis.atsScore >= 80 ? '#16a34a' : analysis.atsScore >= 60 ? '#ca8a04' : '#dc2626' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${getScoreColor(analysis.atsScore)}`}>{analysis.atsScore}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">ATS Compatibility Score</h3>
                      <p className="text-muted-foreground">How well your resume matches applicant tracking systems</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Target className="w-3 h-3" />
                      {TARGET_INDUSTRIES.find(i => i.value === targetIndustry)?.label}
                    </Badge>
                    {targetRole && (
                      <Badge variant="outline" className="gap-1">
                        <Briefcase className="w-3 h-3" />
                        {targetRole}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary with TTS */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
                <TTSPlayer text={analysis.summary} label="Listen to Summary" voice="onyx" />
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Tabs defaultValue="strengths" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="strengths" className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />Strengths
                </TabsTrigger>
                <TabsTrigger value="improvements" className="flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />Improve
                </TabsTrigger>
                <TabsTrigger value="keywords" className="flex items-center gap-1">
                  <Search className="w-4 h-4" />Keywords
                </TabsTrigger>
                <TabsTrigger value="linkedin" className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />LinkedIn
                </TabsTrigger>
              </TabsList>

              <TabsContent value="strengths">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />Resume Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.strengths.map((strength, idx) => (
                        <motion.li key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex items-start gap-3">
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
                      <Lightbulb className="w-5 h-5" />Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.improvements.map((item, idx) => (
                        <motion.li key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900">
                          <Zap className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="keywords">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary flex items-center gap-2">
                      <Search className="w-5 h-5" />Suggested Keywords
                    </CardTitle>
                    <CardDescription>Add these keywords to improve ATS matching</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywordSuggestions.map((keyword, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                          <Badge variant="secondary" className="text-sm py-1 px-3">{keyword}</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="linkedin">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-[#0077b5] flex items-center gap-2">
                      <Linkedin className="w-5 h-5" />LinkedIn Optimization Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {analysis.linkedInTips.map((tip, idx) => (
                        <motion.li key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-[#0077b5]/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-[#0077b5]">{idx + 1}</span>
                          </div>
                          <span>{tip}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Industry Fit */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />Industry Fit Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.industryFit.map((fit, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{fit.industry}</h4>
                        <Badge className={fit.score >= 70 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                          {fit.score}% Match
                        </Badge>
                      </div>
                      <Progress value={fit.score} className="h-2 mb-2" />
                      <p className="text-sm text-muted-foreground">{fit.recommendation}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ResumeOptimizer;
