import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

// ============================================================================
// ENUMS
// ============================================================================

export const userRoleEnum = mysqlEnum("role", ["user", "admin", "sme", "employer", "sponsor"]);
export const displacementReasonEnum = mysqlEnum("displacementReason", [
  "layoff", "automation", "industry_shift", "company_closure", 
  "relocation", "health", "caregiving", "other"
]);
export const skillLevelEnum = mysqlEnum("skillLevel", ["beginner", "intermediate", "advanced", "expert"]);
export const courseStatusEnum = mysqlEnum("courseStatus", ["draft", "pending_review", "approved", "published", "archived"]);
export const enrollmentStatusEnum = mysqlEnum("enrollmentStatus", ["enrolled", "in_progress", "completed", "dropped"]);
export const businessStatusEnum = mysqlEnum("businessStatus", ["idea", "planning", "launched", "growing", "scaled"]);
export const pitchStatusEnum = mysqlEnum("pitchStatus", ["draft", "submitted", "under_review", "selected", "funded", "rejected"]);
export const forumCategoryEnum = mysqlEnum("forumCategory", ["general", "courses", "business", "networking", "support", "success_stories"]);
export const scholarshipStatusEnum = mysqlEnum("scholarshipStatus", ["open", "closed", "awarded"]);
export const applicationStatusEnum = mysqlEnum("applicationStatus", ["pending", "approved", "rejected", "waitlisted"]);

// ============================================================================
// CORE USER TABLES
// ============================================================================

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum.default("user").notNull(),
  pictureUrl: varchar("pictureUrl", { length: 500 }),
  onboardingCompleted: boolean("onboardingCompleted").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const userProfiles = mysqlTable("userProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  // Demographics
  age: int("age"),
  location: varchar("location", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  country: varchar("country", { length: 100 }).default("USA"),
  displacementReason: displacementReasonEnum,
  displacementDate: timestamp("displacementDate"),
  previousIndustry: varchar("previousIndustry", { length: 255 }),
  previousRole: varchar("previousRole", { length: 255 }),
  yearsExperience: int("yearsExperience"),
  // Skills and Goals
  skills: json("skills").$type<string[]>(),
  interests: json("interests").$type<string[]>(),
  businessGoals: json("businessGoals").$type<string[]>(),
  unmetNeeds: json("unmetNeeds").$type<string[]>(),
  // Financial
  capitalAvailable: decimal("capitalAvailable", { precision: 12, scale: 2 }),
  monthlyIncomeGoal: decimal("monthlyIncomeGoal", { precision: 10, scale: 2 }),
  // Resume/Bio
  resumeUrl: varchar("resumeUrl", { length: 500 }),
  bio: text("bio"),
  linkedinUrl: varchar("linkedinUrl", { length: 500 }),
  // Vector embedding for matching (stored as JSON array of floats)
  profileEmbedding: json("profileEmbedding").$type<number[]>(),
  // Gamification
  totalPoints: int("totalPoints").default(0),
  level: int("level").default(1),
  badges: json("badges").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

// ============================================================================
// COURSE & LEARNING TABLES
// ============================================================================

export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 500 }),
  category: varchar("category", { length: 100 }),
  skillLevel: skillLevelEnum.default("beginner"),
  status: courseStatusEnum.default("draft"),
  // Content
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
  estimatedHours: int("estimatedHours").default(1),
  totalModules: int("totalModules").default(0),
  // AI Generation
  aiGenerated: boolean("aiGenerated").default(true),
  aiGenerationPrompt: text("aiGenerationPrompt"),
  smeReviewerId: int("smeReviewerId").references(() => users.id),
  smeReviewedAt: timestamp("smeReviewedAt"),
  smeNotes: text("smeNotes"),
  // Scoring
  demandScore: int("demandScore").default(50),
  relevanceScore: int("relevanceScore").default(50),
  // Metadata
  prerequisites: json("prerequisites").$type<number[]>(),
  tags: json("tags").$type<string[]>(),
  learningOutcomes: json("learningOutcomes").$type<string[]>(),
  // Embedding for recommendations
  courseEmbedding: json("courseEmbedding").$type<number[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export const courseModules = mysqlTable("courseModules", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull().references(() => courses.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content"),
  videoUrl: varchar("videoUrl", { length: 500 }),
  orderIndex: int("orderIndex").default(0),
  estimatedMinutes: int("estimatedMinutes").default(30),
  // AI Content
  aiGenerated: boolean("aiGenerated").default(true),
  smeApproved: boolean("smeApproved").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseModule = typeof courseModules.$inferSelect;
export type InsertCourseModule = typeof courseModules.$inferInsert;

export const courseEnrollments = mysqlTable("courseEnrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  courseId: int("courseId").notNull().references(() => courses.id),
  status: enrollmentStatusEnum.default("enrolled"),
  progress: int("progress").default(0), // 0-100 percentage
  currentModuleId: int("currentModuleId").references(() => courseModules.id),
  pointsEarned: int("pointsEarned").default(0),
  startedAt: timestamp("startedAt").defaultNow(),
  completedAt: timestamp("completedAt"),
  certificateUrl: varchar("certificateUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type InsertCourseEnrollment = typeof courseEnrollments.$inferInsert;

export const moduleProgress = mysqlTable("moduleProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  moduleId: int("moduleId").notNull().references(() => courseModules.id),
  completed: boolean("completed").default(false),
  timeSpentMinutes: int("timeSpentMinutes").default(0),
  quizScore: int("quizScore"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ModuleProgress = typeof moduleProgress.$inferSelect;
export type InsertModuleProgress = typeof moduleProgress.$inferInsert;

export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  courseId: int("courseId").notNull().references(() => courses.id),
  certificateNumber: varchar("certificateNumber", { length: 64 }).notNull().unique(),
  certificateUrl: varchar("certificateUrl", { length: 500 }),
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

// ============================================================================
// BUSINESS FORMATION TABLES
// ============================================================================

export const businessIdeas = mysqlTable("businessIdeas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  vertical: varchar("vertical", { length: 100 }),
  status: businessStatusEnum.default("idea"),
  // AI Generated Scores
  demandScore: int("demandScore").default(50),
  skillsMatchScore: int("skillsMatchScore").default(50),
  capitalRequirementScore: int("capitalRequirementScore").default(50),
  automationPotentialScore: int("automationPotentialScore").default(50),
  profitMarginScore: int("profitMarginScore").default(50),
  competitionScore: int("competitionScore").default(50),
  compositeScore: int("compositeScore").default(50),
  // Financial Projections
  estimatedStartupCost: decimal("estimatedStartupCost", { precision: 12, scale: 2 }),
  estimatedMonthlyRevenue: decimal("estimatedMonthlyRevenue", { precision: 12, scale: 2 }),
  estimatedMonthlyProfit: decimal("estimatedMonthlyProfit", { precision: 12, scale: 2 }),
  // Business Plan
  businessPlanUrl: varchar("businessPlanUrl", { length: 500 }),
  businessPlanContent: text("businessPlanContent"),
  // Related courses that led to this idea
  relatedCourseIds: json("relatedCourseIds").$type<number[]>(),
  // Embedding for matching
  ideaEmbedding: json("ideaEmbedding").$type<number[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BusinessIdea = typeof businessIdeas.$inferSelect;
export type InsertBusinessIdea = typeof businessIdeas.$inferInsert;

export const pitchCompetitions = mysqlTable("pitchCompetitions", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  quarter: varchar("quarter", { length: 10 }), // e.g., "Q1 2026"
  year: int("year"),
  prizePool: decimal("prizePool", { precision: 12, scale: 2 }),
  maxParticipants: int("maxParticipants").default(50),
  applicationDeadline: timestamp("applicationDeadline"),
  pitchDate: timestamp("pitchDate"),
  status: varchar("status", { length: 50 }).default("upcoming"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PitchCompetition = typeof pitchCompetitions.$inferSelect;
export type InsertPitchCompetition = typeof pitchCompetitions.$inferInsert;

export const pitchSubmissions = mysqlTable("pitchSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  competitionId: int("competitionId").notNull().references(() => pitchCompetitions.id),
  businessIdeaId: int("businessIdeaId").notNull().references(() => businessIdeas.id),
  status: pitchStatusEnum.default("draft"),
  pitchDeckUrl: varchar("pitchDeckUrl", { length: 500 }),
  videoUrl: varchar("videoUrl", { length: 500 }),
  executiveSummary: text("executiveSummary"),
  fundingRequested: decimal("fundingRequested", { precision: 12, scale: 2 }),
  fundingAwarded: decimal("fundingAwarded", { precision: 12, scale: 2 }),
  judgeNotes: text("judgeNotes"),
  score: int("score"),
  submittedAt: timestamp("submittedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PitchSubmission = typeof pitchSubmissions.$inferSelect;
export type InsertPitchSubmission = typeof pitchSubmissions.$inferInsert;

// ============================================================================
// COMMUNITY & NETWORKING TABLES
// ============================================================================

export const forumPosts = mysqlTable("forumPosts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  category: forumCategoryEnum.default("general"),
  isPinned: boolean("isPinned").default(false),
  isLocked: boolean("isLocked").default(false),
  viewCount: int("viewCount").default(0),
  likeCount: int("likeCount").default(0),
  replyCount: int("replyCount").default(0),
  // AI Moderation
  sentimentScore: decimal("sentimentScore", { precision: 5, scale: 4 }),
  flaggedForReview: boolean("flaggedForReview").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = typeof forumPosts.$inferInsert;

export const forumReplies = mysqlTable("forumReplies", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull().references(() => forumPosts.id),
  userId: int("userId").notNull().references(() => users.id),
  content: text("content"),
  likeCount: int("likeCount").default(0),
  sentimentScore: decimal("sentimentScore", { precision: 5, scale: 4 }),
  flaggedForReview: boolean("flaggedForReview").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ForumReply = typeof forumReplies.$inferSelect;
export type InsertForumReply = typeof forumReplies.$inferInsert;

export const peerGroups = mysqlTable("peerGroups", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  maxMembers: int("maxMembers").default(20),
  currentMembers: int("currentMembers").default(0),
  isPrivate: boolean("isPrivate").default(false),
  createdById: int("createdById").references(() => users.id),
  // Embedding for matching
  groupEmbedding: json("groupEmbedding").$type<number[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PeerGroup = typeof peerGroups.$inferSelect;
export type InsertPeerGroup = typeof peerGroups.$inferInsert;

export const peerGroupMembers = mysqlTable("peerGroupMembers", {
  id: int("id").autoincrement().primaryKey(),
  groupId: int("groupId").notNull().references(() => peerGroups.id),
  userId: int("userId").notNull().references(() => users.id),
  role: varchar("role", { length: 50 }).default("member"),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type PeerGroupMember = typeof peerGroupMembers.$inferSelect;
export type InsertPeerGroupMember = typeof peerGroupMembers.$inferInsert;

export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: varchar("eventType", { length: 50 }), // virtual, in-person, hybrid
  location: varchar("location", { length: 500 }),
  virtualLink: varchar("virtualLink", { length: 500 }),
  startTime: timestamp("startTime"),
  endTime: timestamp("endTime"),
  maxAttendees: int("maxAttendees"),
  currentAttendees: int("currentAttendees").default(0),
  hostId: int("hostId").references(() => users.id),
  isPublic: boolean("isPublic").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export const eventRegistrations = mysqlTable("eventRegistrations", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull().references(() => events.id),
  userId: int("userId").notNull().references(() => users.id),
  status: varchar("status", { length: 50 }).default("registered"),
  attendedAt: timestamp("attendedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventRegistration = typeof eventRegistrations.$inferSelect;
export type InsertEventRegistration = typeof eventRegistrations.$inferInsert;

// ============================================================================
// SCHOLARSHIP & EMPLOYER TABLES
// ============================================================================

export const scholarships = mysqlTable("scholarships", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sponsorId: int("sponsorId").references(() => users.id),
  sponsorName: varchar("sponsorName", { length: 255 }),
  sponsorLogo: varchar("sponsorLogo", { length: 500 }),
  amount: decimal("amount", { precision: 12, scale: 2 }),
  totalSlots: int("totalSlots").default(10),
  remainingSlots: int("remainingSlots").default(10),
  eligibilityCriteria: json("eligibilityCriteria").$type<Record<string, unknown>>(),
  applicationDeadline: timestamp("applicationDeadline"),
  status: scholarshipStatusEnum.default("open"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Scholarship = typeof scholarships.$inferSelect;
export type InsertScholarship = typeof scholarships.$inferInsert;

export const scholarshipApplications = mysqlTable("scholarshipApplications", {
  id: int("id").autoincrement().primaryKey(),
  scholarshipId: int("scholarshipId").notNull().references(() => scholarships.id),
  userId: int("userId").notNull().references(() => users.id),
  status: applicationStatusEnum.default("pending"),
  applicationEssay: text("applicationEssay"),
  reviewNotes: text("reviewNotes"),
  reviewedById: int("reviewedById").references(() => users.id),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ScholarshipApplication = typeof scholarshipApplications.$inferSelect;
export type InsertScholarshipApplication = typeof scholarshipApplications.$inferInsert;

export const employerProfiles = mysqlTable("employerProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  companyLogo: varchar("companyLogo", { length: 500 }),
  industry: varchar("industry", { length: 100 }),
  companySize: varchar("companySize", { length: 50 }),
  website: varchar("website", { length: 500 }),
  description: text("description"),
  hiringInterests: json("hiringInterests").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EmployerProfile = typeof employerProfiles.$inferSelect;
export type InsertEmployerProfile = typeof employerProfiles.$inferInsert;

export const employerCandidateViews = mysqlTable("employerCandidateViews", {
  id: int("id").autoincrement().primaryKey(),
  employerId: int("employerId").notNull().references(() => users.id),
  candidateId: int("candidateId").notNull().references(() => users.id),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
  notes: text("notes"),
  interested: boolean("interested").default(false),
});

export type EmployerCandidateView = typeof employerCandidateViews.$inferSelect;
export type InsertEmployerCandidateView = typeof employerCandidateViews.$inferInsert;

// ============================================================================
// SURVEY & ANALYTICS TABLES
// ============================================================================

export const surveys = mysqlTable("surveys", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  createdById: int("createdById").references(() => users.id),
  isActive: boolean("isActive").default(true),
  questions: json("questions").$type<Array<{
    id: string;
    type: string;
    question: string;
    options?: string[];
    required?: boolean;
  }>>(),
  totalResponses: int("totalResponses").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Survey = typeof surveys.$inferSelect;
export type InsertSurvey = typeof surveys.$inferInsert;

export const surveyResponses = mysqlTable("surveyResponses", {
  id: int("id").autoincrement().primaryKey(),
  surveyId: int("surveyId").notNull().references(() => surveys.id),
  userId: int("userId").references(() => users.id),
  responses: json("responses").$type<Record<string, unknown>>(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SurveyResponse = typeof surveyResponses.$inferSelect;
export type InsertSurveyResponse = typeof surveyResponses.$inferInsert;

export const platformAnalytics = mysqlTable("platformAnalytics", {
  id: int("id").autoincrement().primaryKey(),
  date: timestamp("date").notNull(),
  metricType: varchar("metricType", { length: 100 }).notNull(),
  metricValue: decimal("metricValue", { precision: 14, scale: 4 }),
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PlatformAnalytics = typeof platformAnalytics.$inferSelect;
export type InsertPlatformAnalytics = typeof platformAnalytics.$inferInsert;

// ============================================================================
// NOTIFICATION & ACTIVITY TABLES
// ============================================================================

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  link: varchar("link", { length: 500 }),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

export const activityLogs = mysqlTable("activityLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 50 }),
  entityId: int("entityId"),
  metadata: json("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = typeof activityLogs.$inferInsert;
