import { integer, pgEnum, pgTable, text, timestamp, varchar, numeric, boolean, jsonb, serial } from "drizzle-orm/pg-core";

// ============================================================================
// ENUMS
// ============================================================================

export const userRoleEnum = pgEnum("role", ["user", "admin", "sme", "employer", "sponsor"]);
export const displacementReasonEnum = pgEnum("displacement_reason", [
  "layoff", "automation", "industry_shift", "company_closure", 
  "relocation", "health", "caregiving", "other"
]);
export const skillLevelEnum = pgEnum("skill_level", ["beginner", "intermediate", "advanced", "expert"]);
export const courseStatusEnum = pgEnum("course_status", ["draft", "pending_review", "approved", "published", "archived"]);
export const enrollmentStatusEnum = pgEnum("enrollment_status", ["enrolled", "in_progress", "completed", "dropped"]);
export const businessStatusEnum = pgEnum("business_status", ["idea", "planning", "launched", "growing", "scaled"]);
export const pitchStatusEnum = pgEnum("pitch_status", ["draft", "submitted", "under_review", "selected", "funded", "rejected"]);
export const forumCategoryEnum = pgEnum("forum_category", ["general", "courses", "business", "networking", "support", "success_stories"]);
export const scholarshipStatusEnum = pgEnum("scholarship_status", ["open", "closed", "awarded"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "approved", "rejected", "waitlisted"]);

// ============================================================================
// CORE USER TABLES
// ============================================================================

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  pictureUrl: varchar("picture_url", { length: 500 }),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  // Demographics
  age: integer("age"),
  location: varchar("location", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }).default("USA"),
  displacementReason: displacementReasonEnum("displacement_reason"),
  displacementDate: timestamp("displacement_date"),
  previousIndustry: varchar("previous_industry", { length: 255 }),
  previousRole: varchar("previous_role", { length: 255 }),
  yearsExperience: integer("years_experience"),
  // Skills and Goals
  skills: jsonb("skills").$type<string[]>(),
  interests: jsonb("interests").$type<string[]>(),
  businessGoals: jsonb("business_goals").$type<string[]>(),
  unmetNeeds: jsonb("unmet_needs").$type<string[]>(),
  // Financial
  capitalAvailable: numeric("capital_available", { precision: 12, scale: 2 }),
  monthlyIncomeGoal: numeric("monthly_income_goal", { precision: 10, scale: 2 }),
  // Resume/Bio
  resumeUrl: varchar("resume_url", { length: 500 }),
  bio: text("bio"),
  linkedinUrl: varchar("linkedin_url", { length: 500 }),
  // Vector embedding for matching (stored as JSON array of floats)
  profileEmbedding: jsonb("profile_embedding").$type<number[]>(),
  // Gamification
  totalPoints: integer("total_points").default(0),
  level: integer("level").default(1),
  badges: jsonb("badges").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

// ============================================================================
// COURSE & LEARNING TABLES
// ============================================================================

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("short_description", { length: 500 }),
  category: varchar("category", { length: 100 }),
  skillLevel: skillLevelEnum("skill_level").default("beginner"),
  status: courseStatusEnum("status").default("draft"),
  // Content
  thumbnailUrl: varchar("thumbnail_url", { length: 500 }),
  estimatedHours: integer("estimated_hours").default(1),
  totalModules: integer("total_modules").default(0),
  // AI Generation
  aiGenerated: boolean("ai_generated").default(true),
  aiGenerationPrompt: text("ai_generation_prompt"),
  smeReviewerId: integer("sme_reviewer_id").references(() => users.id),
  smeReviewedAt: timestamp("sme_reviewed_at"),
  smeNotes: text("sme_notes"),
  // Scoring
  demandScore: integer("demand_score").default(50),
  relevanceScore: integer("relevance_score").default(50),
  // Metadata
  prerequisites: jsonb("prerequisites").$type<number[]>(),
  tags: jsonb("tags").$type<string[]>(),
  learningOutcomes: jsonb("learning_outcomes").$type<string[]>(),
  // Embedding for recommendations
  courseEmbedding: jsonb("course_embedding").$type<number[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export const courseModules = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content"),
  videoUrl: varchar("video_url", { length: 500 }),
  orderIndex: integer("order_index").default(0),
  estimatedMinutes: integer("estimated_minutes").default(30),
  // AI Content
  aiGenerated: boolean("ai_generated").default(true),
  smeApproved: boolean("sme_approved").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CourseModule = typeof courseModules.$inferSelect;
export type InsertCourseModule = typeof courseModules.$inferInsert;

export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  status: enrollmentStatusEnum("status").default("enrolled"),
  progress: integer("progress").default(0), // 0-100 percentage
  currentModuleId: integer("current_module_id").references(() => courseModules.id),
  pointsEarned: integer("points_earned").default(0),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  certificateUrl: varchar("certificate_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type InsertCourseEnrollment = typeof courseEnrollments.$inferInsert;

export const moduleProgress = pgTable("module_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  moduleId: integer("module_id").notNull().references(() => courseModules.id),
  completed: boolean("completed").default(false),
  timeSpentMinutes: integer("time_spent_minutes").default(0),
  quizScore: integer("quiz_score"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ModuleProgress = typeof moduleProgress.$inferSelect;
export type InsertModuleProgress = typeof moduleProgress.$inferInsert;

export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  certificateNumber: varchar("certificate_number", { length: 64 }).notNull().unique(),
  certificateUrl: varchar("certificate_url", { length: 500 }),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

// ============================================================================
// BUSINESS FORMATION TABLES
// ============================================================================

export const businessIdeas = pgTable("business_ideas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  vertical: varchar("vertical", { length: 100 }),
  status: businessStatusEnum("status").default("idea"),
  // AI Generated Scores
  demandScore: integer("demand_score").default(50),
  skillsMatchScore: integer("skills_match_score").default(50),
  capitalRequirementScore: integer("capital_requirement_score").default(50),
  automationPotentialScore: integer("automation_potential_score").default(50),
  profitMarginScore: integer("profit_margin_score").default(50),
  competitionScore: integer("competition_score").default(50),
  compositeScore: integer("composite_score").default(50),
  // Financial Projections
  estimatedStartupCost: numeric("estimated_startup_cost", { precision: 12, scale: 2 }),
  estimatedMonthlyRevenue: numeric("estimated_monthly_revenue", { precision: 12, scale: 2 }),
  estimatedMonthlyProfit: numeric("estimated_monthly_profit", { precision: 12, scale: 2 }),
  // Business Plan
  businessPlanUrl: varchar("business_plan_url", { length: 500 }),
  businessPlanContent: text("business_plan_content"),
  // Related courses that led to this idea
  relatedCourseIds: jsonb("related_course_ids").$type<number[]>(),
  // Embedding for matching
  ideaEmbedding: jsonb("idea_embedding").$type<number[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type BusinessIdea = typeof businessIdeas.$inferSelect;
export type InsertBusinessIdea = typeof businessIdeas.$inferInsert;

export const pitchCompetitions = pgTable("pitch_competitions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  quarter: varchar("quarter", { length: 10 }), // e.g., "Q1 2026"
  year: integer("year"),
  prizePool: numeric("prize_pool", { precision: 12, scale: 2 }),
  maxParticipants: integer("max_participants").default(50),
  applicationDeadline: timestamp("application_deadline"),
  pitchDate: timestamp("pitch_date"),
  status: varchar("status", { length: 50 }).default("upcoming"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PitchCompetition = typeof pitchCompetitions.$inferSelect;
export type InsertPitchCompetition = typeof pitchCompetitions.$inferInsert;

export const pitchSubmissions = pgTable("pitch_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  competitionId: integer("competition_id").notNull().references(() => pitchCompetitions.id),
  businessIdeaId: integer("business_idea_id").notNull().references(() => businessIdeas.id),
  status: pitchStatusEnum("status").default("draft"),
  pitchDeckUrl: varchar("pitch_deck_url", { length: 500 }),
  videoUrl: varchar("video_url", { length: 500 }),
  executiveSummary: text("executive_summary"),
  fundingRequested: numeric("funding_requested", { precision: 12, scale: 2 }),
  fundingAwarded: numeric("funding_awarded", { precision: 12, scale: 2 }),
  judgeNotes: text("judge_notes"),
  score: integer("score"),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PitchSubmission = typeof pitchSubmissions.$inferSelect;
export type InsertPitchSubmission = typeof pitchSubmissions.$inferInsert;

// ============================================================================
// COMMUNITY & NETWORKING TABLES
// ============================================================================

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  category: forumCategoryEnum("category").default("general"),
  isPinned: boolean("is_pinned").default(false),
  isLocked: boolean("is_locked").default(false),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  replyCount: integer("reply_count").default(0),
  // AI Moderation
  sentimentScore: numeric("sentiment_score", { precision: 5, scale: 4 }),
  flaggedForReview: boolean("flagged_for_review").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = typeof forumPosts.$inferInsert;

export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => forumPosts.id),
  userId: integer("user_id").notNull().references(() => users.id),
  content: text("content"),
  likeCount: integer("like_count").default(0),
  sentimentScore: numeric("sentiment_score", { precision: 5, scale: 4 }),
  flaggedForReview: boolean("flagged_for_review").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = typeof forumReplies.$inferInsert;

export const peerGroups = pgTable("peer_groups", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  maxMembers: integer("max_members").default(20),
  currentMembers: integer("current_members").default(0),
  isPrivate: boolean("is_private").default(false),
  createdById: integer("created_by_id").references(() => users.id),
  // Embedding for matching
  groupEmbedding: jsonb("group_embedding").$type<number[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PeerGroup = typeof peerGroups.$inferSelect;
export type InsertPeerGroup = typeof peerGroups.$inferInsert;

export const peerGroupMembers = pgTable("peer_group_members", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").notNull().references(() => peerGroups.id),
  userId: integer("user_id").notNull().references(() => users.id),
  role: varchar("role", { length: 50 }).default("member"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

export type PeerGroupMember = typeof peerGroupMembers.$inferSelect;
export type InsertPeerGroupMember = typeof peerGroupMembers.$inferInsert;

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: varchar("event_type", { length: 50 }), // virtual, in-person, hybrid
  location: varchar("location", { length: 500 }),
  virtualLink: varchar("virtual_link", { length: 500 }),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  maxAttendees: integer("max_attendees"),
  currentAttendees: integer("current_attendees").default(0),
  hostId: integer("host_id").references(() => users.id),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export const eventRegistrations = pgTable("event_registrations", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull().references(() => events.id),
  userId: integer("user_id").notNull().references(() => users.id),
  status: varchar("status", { length: 50 }).default("registered"),
  attendedAt: timestamp("attended_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = typeof eventRegistrations.$inferInsert;

// ============================================================================
// SCHOLARSHIP & EMPLOYER TABLES
// ============================================================================

export const scholarships = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sponsorId: integer("sponsor_id").references(() => users.id),
  sponsorName: varchar("sponsor_name", { length: 255 }),
  sponsorLogo: varchar("sponsor_logo", { length: 500 }),
  amount: numeric("amount", { precision: 12, scale: 2 }),
  totalSlots: integer("total_slots").default(10),
  remainingSlots: integer("remaining_slots").default(10),
  eligibilityCriteria: jsonb("eligibility_criteria").$type<Record<string, unknown>>(),
  applicationDeadline: timestamp("application_deadline"),
  status: scholarshipStatusEnum("status").default("open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Scholarship = typeof scholarships.$inferSelect;
export type InsertScholarship = typeof scholarships.$inferInsert;

export const scholarshipApplications = pgTable("scholarship_applications", {
  id: serial("id").primaryKey(),
  scholarshipId: integer("scholarship_id").notNull().references(() => scholarships.id),
  userId: integer("user_id").notNull().references(() => users.id),
  status: applicationStatusEnum("status").default("pending"),
  applicationEssay: text("application_essay"),
  reviewNotes: text("review_notes"),
  reviewedById: integer("reviewed_by_id").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ScholarshipApplication = typeof scholarshipApplications.$inferSelect;
export type InsertScholarshipApplication = typeof scholarshipApplications.$inferInsert;

export const employerProfiles = pgTable("employer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  companyLogo: varchar("company_logo", { length: 500 }),
  industry: varchar("industry", { length: 100 }),
  companySize: varchar("company_size", { length: 50 }),
  website: varchar("website", { length: 500 }),
  description: text("description"),
  hiringInterests: jsonb("hiring_interests").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type EmployerProfile = typeof employerProfiles.$inferSelect;
export type InsertEmployerProfile = typeof employerProfiles.$inferInsert;

export const employerCandidateViews = pgTable("employer_candidate_views", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").notNull().references(() => users.id),
  candidateId: integer("candidate_id").notNull().references(() => users.id),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
  notes: text("notes"),
  interested: boolean("interested").default(false),
});

export type EmployerCandidateView = typeof employerCandidateViews.$inferSelect;
export type InsertEmployerCandidateView = typeof employerCandidateViews.$inferInsert;

// ============================================================================
// SURVEY & ANALYTICS TABLES
// ============================================================================

export const surveys = pgTable("surveys", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  createdById: integer("created_by_id").references(() => users.id),
  isActive: boolean("is_active").default(true),
  questions: jsonb("questions").$type<Array<{
    id: string;
    type: string;
    question: string;
    options?: string[];
    required?: boolean;
  }>>(),
  totalResponses: integer("total_responses").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Survey = typeof surveys.$inferSelect;
export type InsertSurvey = typeof surveys.$inferInsert;

export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  surveyId: integer("survey_id").notNull().references(() => surveys.id),
  userId: integer("user_id").references(() => users.id),
  responses: jsonb("responses").$type<Record<string, unknown>>(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type InsertSurveyResponse = typeof surveyResponses.$inferInsert;

export const platformAnalytics = pgTable("platform_analytics", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  metricType: varchar("metric_type", { length: 100 }).notNull(),
  metricValue: numeric("metric_value", { precision: 14, scale: 4 }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PlatformAnalytics = typeof platformAnalytics.$inferSelect;
export type InsertPlatformAnalytics = typeof platformAnalytics.$inferInsert;

// ============================================================================
// NOTIFICATION & ACTIVITY TABLES
// ============================================================================

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  link: varchar("link", { length: 500 }),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }),
  entityId: integer("entity_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;
