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
