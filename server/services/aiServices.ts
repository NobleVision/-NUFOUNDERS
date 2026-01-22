import { invokeLLM } from "../_core/llm";

// ============================================================================
// COURSE GENERATION SERVICE
// ============================================================================

export interface GeneratedCourse {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedHours: number;
  learningOutcomes: string[];
  tags: string[];
  modules: GeneratedModule[];
}

export interface GeneratedModule {
  title: string;
  description: string;
  content: string;
  estimatedMinutes: number;
  orderIndex: number;
}

export async function generateCourse(params: {
  topic: string;
  targetAudience: string;
  skillLevel: string;
  focusAreas?: string[];
}): Promise<GeneratedCourse> {
  const prompt = `Generate a comprehensive training course for displaced workers, specifically targeting Black women seeking to upskill and build businesses.

Topic: ${params.topic}
Target Audience: ${params.targetAudience}
Skill Level: ${params.skillLevel}
Focus Areas: ${params.focusAreas?.join(', ') || 'General'}

Create a course with 5-8 modules that is practical, actionable, and empowering. The content should be culturally relevant and address the unique challenges faced by displaced Black women in the workforce.

Return a JSON object with this exact structure:
{
  "title": "Course Title",
  "description": "Detailed course description (2-3 paragraphs)",
  "shortDescription": "One sentence summary",
  "category": "Category name",
  "skillLevel": "beginner|intermediate|advanced|expert",
  "estimatedHours": number,
  "learningOutcomes": ["outcome1", "outcome2", ...],
  "tags": ["tag1", "tag2", ...],
  "modules": [
    {
      "title": "Module Title",
      "description": "Module description",
      "content": "Full module content with practical exercises and examples",
      "estimatedMinutes": number,
      "orderIndex": number
    }
  ]
}`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are an expert curriculum designer specializing in workforce development and entrepreneurship training for underrepresented communities. Generate practical, empowering educational content." },
        { role: "user", content: prompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "course_generation",
          strict: true,
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              shortDescription: { type: "string" },
              category: { type: "string" },
              skillLevel: { type: "string", enum: ["beginner", "intermediate", "advanced", "expert"] },
              estimatedHours: { type: "integer" },
              learningOutcomes: { type: "array", items: { type: "string" } },
              tags: { type: "array", items: { type: "string" } },
              modules: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    content: { type: "string" },
                    estimatedMinutes: { type: "integer" },
                    orderIndex: { type: "integer" }
                  },
                  required: ["title", "description", "content", "estimatedMinutes", "orderIndex"],
                  additionalProperties: false
                }
              }
            },
            required: ["title", "description", "shortDescription", "category", "skillLevel", "estimatedHours", "learningOutcomes", "tags", "modules"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') throw new Error("No content in response");
    
    return JSON.parse(content) as GeneratedCourse;
  } catch (error) {
    console.error("Course generation failed:", error);
    throw new Error(`Failed to generate course: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// BUSINESS IDEA SCORING SERVICE
// ============================================================================

export interface BusinessScores {
  demandScore: number;
  skillsMatchScore: number;
  capitalRequirementScore: number;
  automationPotentialScore: number;
  profitMarginScore: number;
  competitionScore: number;
  compositeScore: number;
  analysis: string;
  recommendations: string[];
}

export async function scoreBusinessIdea(params: {
  ideaTitle: string;
  ideaDescription: string;
  userSkills: string[];
  capitalAvailable: number;
  completedCourses: string[];
}): Promise<BusinessScores> {
  const prompt = `Analyze and score this business idea for a displaced Black woman entrepreneur:

Business Idea: ${params.ideaTitle}
Description: ${params.ideaDescription}
User's Skills: ${params.userSkills.join(', ')}
Available Capital: $${params.capitalAvailable}
Completed Training: ${params.completedCourses.join(', ')}

Score each factor from 0-100 and provide analysis:
- Demand Score: Market demand for this product/service
- Skills Match Score: How well user's skills align with requirements
- Capital Requirement Score: How feasible given available capital (higher = more feasible)
- Automation Potential Score: Ability to automate operations
- Profit Margin Score: Expected profit margins
- Competition Score: Market competition level (higher = less competition)

Calculate composite score using weights:
- Demand: 25%
- Skills Match: 20%
- Capital Requirement: 15%
- Automation: 15%
- Profit Margin: 15%
- Competition: 10%

Return JSON with scores and actionable recommendations.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a business analyst specializing in evaluating startup opportunities for entrepreneurs from underrepresented communities. Provide honest, constructive analysis." },
        { role: "user", content: prompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "business_scoring",
          strict: true,
          schema: {
            type: "object",
            properties: {
              demandScore: { type: "integer", minimum: 0, maximum: 100 },
              skillsMatchScore: { type: "integer", minimum: 0, maximum: 100 },
              capitalRequirementScore: { type: "integer", minimum: 0, maximum: 100 },
              automationPotentialScore: { type: "integer", minimum: 0, maximum: 100 },
              profitMarginScore: { type: "integer", minimum: 0, maximum: 100 },
              competitionScore: { type: "integer", minimum: 0, maximum: 100 },
              compositeScore: { type: "integer", minimum: 0, maximum: 100 },
              analysis: { type: "string" },
              recommendations: { type: "array", items: { type: "string" } }
            },
            required: ["demandScore", "skillsMatchScore", "capitalRequirementScore", "automationPotentialScore", "profitMarginScore", "competitionScore", "compositeScore", "analysis", "recommendations"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') throw new Error("No content in response");
    
    return JSON.parse(content) as BusinessScores;
  } catch (error) {
    console.error("Business scoring failed:", error);
    throw new Error(`Failed to score business idea: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// BUSINESS PLAN GENERATION SERVICE
// ============================================================================

export interface GeneratedBusinessPlan {
  executiveSummary: string;
  problemStatement: string;
  solution: string;
  targetMarket: string;
  competitiveAdvantage: string;
  revenueModel: string;
  marketingStrategy: string;
  operationalPlan: string;
  financialProjections: {
    startupCosts: number;
    monthlyExpenses: number;
    projectedRevenue: number;
    breakEvenMonths: number;
  };
  milestones: string[];
  risks: string[];
}

export async function generateBusinessPlan(params: {
  ideaTitle: string;
  ideaDescription: string;
  userBackground: string;
  capitalAvailable: number;
  targetMarket: string;
}): Promise<GeneratedBusinessPlan> {
  const prompt = `Create a comprehensive business plan for a displaced Black woman entrepreneur:

Business Idea: ${params.ideaTitle}
Description: ${params.ideaDescription}
Founder Background: ${params.userBackground}
Available Capital: $${params.capitalAvailable}
Target Market: ${params.targetMarket}

Generate a detailed, actionable business plan that is realistic and achievable. Focus on lean startup principles and bootstrapping strategies appropriate for the available capital.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a business plan consultant specializing in helping entrepreneurs from underrepresented communities launch successful ventures. Create practical, achievable plans." },
        { role: "user", content: prompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "business_plan",
          strict: true,
          schema: {
            type: "object",
            properties: {
              executiveSummary: { type: "string" },
              problemStatement: { type: "string" },
              solution: { type: "string" },
              targetMarket: { type: "string" },
              competitiveAdvantage: { type: "string" },
              revenueModel: { type: "string" },
              marketingStrategy: { type: "string" },
              operationalPlan: { type: "string" },
              financialProjections: {
                type: "object",
                properties: {
                  startupCosts: { type: "number" },
                  monthlyExpenses: { type: "number" },
                  projectedRevenue: { type: "number" },
                  breakEvenMonths: { type: "integer" }
                },
                required: ["startupCosts", "monthlyExpenses", "projectedRevenue", "breakEvenMonths"],
                additionalProperties: false
              },
              milestones: { type: "array", items: { type: "string" } },
              risks: { type: "array", items: { type: "string" } }
            },
            required: ["executiveSummary", "problemStatement", "solution", "targetMarket", "competitiveAdvantage", "revenueModel", "marketingStrategy", "operationalPlan", "financialProjections", "milestones", "risks"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') throw new Error("No content in response");
    
    return JSON.parse(content) as GeneratedBusinessPlan;
  } catch (error) {
    console.error("Business plan generation failed:", error);
    throw new Error(`Failed to generate business plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// PROFILE ANALYSIS SERVICE
// ============================================================================

export interface ProfileAnalysis {
  strengths: string[];
  areasForGrowth: string[];
  recommendedCourses: string[];
  businessIdeas: string[];
  careerPaths: string[];
  summary: string;
}

export async function analyzeUserProfile(params: {
  skills: string[];
  interests: string[];
  previousRole: string;
  previousIndustry: string;
  businessGoals: string[];
  displacementReason: string;
}): Promise<ProfileAnalysis> {
  const prompt = `Analyze this displaced worker's profile and provide personalized recommendations:

Previous Role: ${params.previousRole}
Previous Industry: ${params.previousIndustry}
Skills: ${params.skills.join(', ')}
Interests: ${params.interests.join(', ')}
Business Goals: ${params.businessGoals.join(', ')}
Displacement Reason: ${params.displacementReason}

Provide a supportive, empowering analysis that identifies transferable skills, growth opportunities, and potential business ideas that align with their background and goals.`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a career counselor specializing in workforce transition for displaced workers. Provide encouraging, actionable guidance." },
        { role: "user", content: prompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "profile_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              strengths: { type: "array", items: { type: "string" } },
              areasForGrowth: { type: "array", items: { type: "string" } },
              recommendedCourses: { type: "array", items: { type: "string" } },
              businessIdeas: { type: "array", items: { type: "string" } },
              careerPaths: { type: "array", items: { type: "string" } },
              summary: { type: "string" }
            },
            required: ["strengths", "areasForGrowth", "recommendedCourses", "businessIdeas", "careerPaths", "summary"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') throw new Error("No content in response");
    
    return JSON.parse(content) as ProfileAnalysis;
  } catch (error) {
    console.error("Profile analysis failed:", error);
    throw new Error(`Failed to analyze profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// CONTENT MODERATION SERVICE
// ============================================================================

export interface ModerationResult {
  isAppropriate: boolean;
  sentimentScore: number; // -1 to 1
  flaggedIssues: string[];
  suggestedAction: 'approve' | 'review' | 'reject';
}

export async function moderateContent(content: string): Promise<ModerationResult> {
  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a content moderator for a professional community platform. Evaluate content for appropriateness, sentiment, and community guidelines compliance." },
        { role: "user", content: `Moderate this content: "${content}"` }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "moderation_result",
          strict: true,
          schema: {
            type: "object",
            properties: {
              isAppropriate: { type: "boolean" },
              sentimentScore: { type: "number" },
              flaggedIssues: { type: "array", items: { type: "string" } },
              suggestedAction: { type: "string", enum: ["approve", "review", "reject"] }
            },
            required: ["isAppropriate", "sentimentScore", "flaggedIssues", "suggestedAction"],
            additionalProperties: false
          }
        }
      }
    });

    const responseContent = response.choices[0]?.message?.content;
    if (!responseContent || typeof responseContent !== 'string') throw new Error("No content in response");
    
    return JSON.parse(responseContent) as ModerationResult;
  } catch (error) {
    console.error("Content moderation failed:", error);
    // Default to review on error
    return {
      isAppropriate: true,
      sentimentScore: 0,
      flaggedIssues: [],
      suggestedAction: 'review'
    };
  }
}

// ============================================================================
// DOCUMENT ANALYSIS SERVICE
// ============================================================================

export interface DocumentAnalysisResult {
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

export async function analyzeBusinessDocument(params: {
  documentText: string;
  documentType: string;
  businessContext?: string;
  userBackground?: string;
}): Promise<DocumentAnalysisResult> {
  const documentTypeLabels: Record<string, string> = {
    business_plan: "Business Plan",
    pitch_deck: "Pitch Deck",
    financial_projection: "Financial Projection",
    marketing_plan: "Marketing Plan",
    resume: "Resume/CV",
    other: "Business Document",
  };

  const docTypeLabel = documentTypeLabels[params.documentType] || "Business Document";

  const prompt = `Analyze this ${docTypeLabel} for a displaced Black woman entrepreneur seeking to start or grow her business.

Document Content:
${params.documentText.substring(0, 15000)} ${params.documentText.length > 15000 ? '... [truncated]' : ''}

${params.businessContext ? `Business Context: ${params.businessContext}` : ''}
${params.userBackground ? `Founder Background: ${params.userBackground}` : ''}

Provide a comprehensive, supportive, and actionable analysis including:
1. Executive summary of the document (2-3 sentences)
2. Key strengths (what's working well, be encouraging)
3. Areas for improvement (constructive feedback)
4. Specific actionable suggestions for enhancement
5. Scores (0-100) for: clarity, feasibility, market potential, financial viability
6. Section-by-section feedback if applicable

Focus on being helpful, practical, and empowering. Consider the unique challenges and opportunities for underrepresented entrepreneurs.`;

  try {
    const response = await invokeLLM({
      messages: [
        { 
          role: "system", 
          content: "You are an expert business consultant specializing in helping entrepreneurs from underrepresented communities succeed. Provide thorough, encouraging, and actionable feedback on business documents. Be specific and practical in your suggestions." 
        },
        { role: "user", content: prompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "document_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              strengths: { type: "array", items: { type: "string" } },
              weaknesses: { type: "array", items: { type: "string" } },
              suggestions: { type: "array", items: { type: "string" } },
              scores: {
                type: "object",
                properties: {
                  clarity: { type: "integer" },
                  feasibility: { type: "integer" },
                  marketPotential: { type: "integer" },
                  financialViability: { type: "integer" },
                  overall: { type: "integer" }
                },
                required: ["clarity", "feasibility", "marketPotential", "financialViability", "overall"],
                additionalProperties: false
              },
              sections: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    feedback: { type: "string" },
                    score: { type: "integer" }
                  },
                  required: ["name", "feedback", "score"],
                  additionalProperties: false
                }
              }
            },
            required: ["summary", "strengths", "weaknesses", "suggestions", "scores", "sections"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') throw new Error("No content in response");
    
    return JSON.parse(content) as DocumentAnalysisResult;
  } catch (error) {
    console.error("Document analysis failed:", error);
    throw new Error(`Failed to analyze document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// PERSONALIZED RECOMMENDATIONS SERVICE
// ============================================================================

export interface PersonalizedRecommendations {
  recommendedCourses: { title: string; reason: string }[];
  nextSteps: string[];
  focusAreas: string[];
  encouragement: string;
}

export async function generatePersonalizedRecommendations(params: {
  skills: string[];
  interests: string[];
  completedCourses: string[];
  businessGoals: string[];
  currentProgress: {
    coursesCompleted: number;
    businessIdeas: number;
    pitchesSubmitted: number;
  };
}): Promise<PersonalizedRecommendations> {
  const prompt = `Generate personalized recommendations for a displaced Black woman entrepreneur:

Current Skills: ${params.skills.join(', ') || 'Not specified'}
Interests: ${params.interests.join(', ') || 'Not specified'}
Completed Courses: ${params.completedCourses.join(', ') || 'None yet'}
Business Goals: ${params.businessGoals.join(', ') || 'Not specified'}

Progress:
- Courses completed: ${params.currentProgress.coursesCompleted}
- Business ideas developed: ${params.currentProgress.businessIdeas}
- Pitches submitted: ${params.currentProgress.pitchesSubmitted}

Provide personalized, actionable recommendations that align with her goals and build on her existing progress. Be encouraging and specific.`;

  try {
    const response = await invokeLLM({
      messages: [
        { 
          role: "system", 
          content: "You are a supportive career and business coach specializing in helping entrepreneurs succeed. Provide personalized, actionable recommendations." 
        },
        { role: "user", content: prompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "recommendations",
          strict: true,
          schema: {
            type: "object",
            properties: {
              recommendedCourses: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    reason: { type: "string" }
                  },
                  required: ["title", "reason"],
                  additionalProperties: false
                }
              },
              nextSteps: { type: "array", items: { type: "string" } },
              focusAreas: { type: "array", items: { type: "string" } },
              encouragement: { type: "string" }
            },
            required: ["recommendedCourses", "nextSteps", "focusAreas", "encouragement"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') throw new Error("No content in response");
    
    return JSON.parse(content) as PersonalizedRecommendations;
  } catch (error) {
    console.error("Recommendations generation failed:", error);
    throw new Error(`Failed to generate recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ============================================================================
// BUSINESS IDEA BRAINSTORMER SERVICE
// ============================================================================

export interface BrainstormResult {
  ideas: {
    title: string;
    description: string;
    whyItFits: string;
    estimatedStartupCost: string;
    potentialRevenue: string;
  }[];
  followUpQuestions: string[];
}

export async function brainstormBusinessIdeas(params: {
  skills: string[];
  interests: string[];
  capitalAvailable: number;
  timeAvailable: string;
  preferences?: string;
}): Promise<BrainstormResult> {
  const prompt = `Generate business ideas for a displaced Black woman entrepreneur:

Skills: ${params.skills.join(', ') || 'General business skills'}
Interests: ${params.interests.join(', ') || 'Open to suggestions'}
Available Capital: $${params.capitalAvailable.toLocaleString()}
Time Available: ${params.timeAvailable || 'Full-time'}
${params.preferences ? `Preferences/Constraints: ${params.preferences}` : ''}

Generate 3-5 creative, practical business ideas that:
1. Align with her skills and interests
2. Are feasible with her available capital
3. Have good market potential
4. Can be started relatively quickly
5. Have paths to profitability

For each idea, explain why it's a good fit for her specifically.`;

  try {
    const response = await invokeLLM({
      messages: [
        { 
          role: "system", 
          content: "You are a creative business strategist who specializes in identifying viable business opportunities for entrepreneurs. Generate practical, innovative ideas tailored to the individual's unique circumstances." 
        },
        { role: "user", content: prompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "brainstorm",
          strict: true,
          schema: {
            type: "object",
            properties: {
              ideas: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    whyItFits: { type: "string" },
                    estimatedStartupCost: { type: "string" },
                    potentialRevenue: { type: "string" }
                  },
                  required: ["title", "description", "whyItFits", "estimatedStartupCost", "potentialRevenue"],
                  additionalProperties: false
                }
              },
              followUpQuestions: { type: "array", items: { type: "string" } }
            },
            required: ["ideas", "followUpQuestions"],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') throw new Error("No content in response");
    
    return JSON.parse(content) as BrainstormResult;
  } catch (error) {
    console.error("Brainstorm failed:", error);
    throw new Error(`Failed to brainstorm ideas: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
