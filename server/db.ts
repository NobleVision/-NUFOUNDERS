import { eq, and, desc, asc, sql, like, or, gte, lte, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { 
  InsertUser, users, 
  userProfiles, InsertUserProfile, UserProfile,
  courses, InsertCourse, Course,
  courseModules, InsertCourseModule, CourseModule,
  courseEnrollments, InsertCourseEnrollment, CourseEnrollment,
  moduleProgress, InsertModuleProgress,
  certificates, InsertCertificate,
  businessIdeas, InsertBusinessIdea, BusinessIdea,
  pitchCompetitions, InsertPitchCompetition, PitchCompetition,
  pitchSubmissions, InsertPitchSubmission,
  forumPosts, InsertForumPost, ForumPost,
  forumReplies, InsertForumReply,
  peerGroups, InsertPeerGroup, PeerGroup,
  peerGroupMembers, InsertPeerGroupMember,
  events, InsertEvent, Event,
  eventRegistrations, InsertEventRegistration,
  scholarships, InsertScholarship, Scholarship,
  scholarshipApplications, InsertScholarshipApplication,
  employerProfiles, InsertEmployerProfile,
  employerCandidateViews,
  surveys, InsertSurvey,
  surveyResponses, InsertSurveyResponse,
  platformAnalytics, InsertPlatformAnalytics,
  notifications, InsertNotification,
  activityLogs, InsertActivityLog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const queryClient = neon(process.env.DATABASE_URL);
      _db = drizzle(queryClient);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER QUERIES
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "pictureUrl"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).limit(limit).offset(offset).orderBy(desc(users.createdAt));
}

export async function updateUserOnboarding(userId: number, completed: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ onboardingCompleted: completed }).where(eq(users.id, userId));
}

// ============================================================================
// USER PROFILE QUERIES
// ============================================================================

export async function upsertUserProfile(profile: InsertUserProfile) {
  const db = await getDb();
  if (!db) return;
  
  const existing = await db.select().from(userProfiles).where(eq(userProfiles.userId, profile.userId)).limit(1);
  
  if (existing.length > 0) {
    await db.update(userProfiles).set(profile).where(eq(userProfiles.userId, profile.userId));
  } else {
    await db.insert(userProfiles).values(profile);
  }
}

export async function getUserProfile(userId: number): Promise<UserProfile | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserPoints(userId: number, points: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(userProfiles)
    .set({ totalPoints: sql`${userProfiles.totalPoints} + ${points}` })
    .where(eq(userProfiles.userId, userId));
}

// ============================================================================
// COURSE QUERIES
// ============================================================================

export async function createCourse(course: InsertCourse) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(courses).values(course);
  return result[0].insertId;
}

export async function getCourseById(id: number): Promise<Course | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllCourses(filters?: { 
  status?: string; 
  category?: string; 
  skillLevel?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(courses);
  const conditions = [];
  
  if (filters?.status) {
    conditions.push(eq(courses.status, filters.status as any));
  }
  if (filters?.category) {
    conditions.push(eq(courses.category, filters.category));
  }
  if (filters?.skillLevel) {
    conditions.push(eq(courses.skillLevel, filters.skillLevel as any));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return query.limit(filters?.limit || 50).offset(filters?.offset || 0).orderBy(desc(courses.createdAt));
}

export async function updateCourse(id: number, data: Partial<InsertCourse>) {
  const db = await getDb();
  if (!db) return;
  await db.update(courses).set(data).where(eq(courses.id, id));
}

// ============================================================================
// COURSE MODULE QUERIES
// ============================================================================

export async function createCourseModule(module: InsertCourseModule) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(courseModules).values(module);
  return result[0].insertId;
}

export async function getCourseModules(courseId: number): Promise<CourseModule[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseModules).where(eq(courseModules.courseId, courseId)).orderBy(asc(courseModules.orderIndex));
}

export async function updateCourseModule(id: number, data: Partial<InsertCourseModule>) {
  const db = await getDb();
  if (!db) return;
  await db.update(courseModules).set(data).where(eq(courseModules.id, id));
}

// ============================================================================
// ENROLLMENT QUERIES
// ============================================================================

export async function enrollInCourse(enrollment: InsertCourseEnrollment) {
  const db = await getDb();
  if (!db) return;
  await db.insert(courseEnrollments).values(enrollment);
}

export async function getUserEnrollments(userId: number): Promise<CourseEnrollment[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseEnrollments).where(eq(courseEnrollments.userId, userId)).orderBy(desc(courseEnrollments.createdAt));
}

export async function getEnrollment(userId: number, courseId: number): Promise<CourseEnrollment | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courseEnrollments)
    .where(and(eq(courseEnrollments.userId, userId), eq(courseEnrollments.courseId, courseId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateEnrollmentProgress(userId: number, courseId: number, progress: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(courseEnrollments)
    .set({ progress, status: progress >= 100 ? 'completed' : 'in_progress' })
    .where(and(eq(courseEnrollments.userId, userId), eq(courseEnrollments.courseId, courseId)));
}

// ============================================================================
// BUSINESS IDEA QUERIES
// ============================================================================

export async function createBusinessIdea(idea: InsertBusinessIdea) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(businessIdeas).values(idea);
  return result[0].insertId;
}

export async function getUserBusinessIdeas(userId: number): Promise<BusinessIdea[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(businessIdeas).where(eq(businessIdeas.userId, userId)).orderBy(desc(businessIdeas.createdAt));
}

export async function getBusinessIdeaById(id: number): Promise<BusinessIdea | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(businessIdeas).where(eq(businessIdeas.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateBusinessIdea(id: number, data: Partial<InsertBusinessIdea>) {
  const db = await getDb();
  if (!db) return;
  await db.update(businessIdeas).set(data).where(eq(businessIdeas.id, id));
}

// ============================================================================
// PITCH COMPETITION QUERIES
// ============================================================================

export async function createPitchCompetition(competition: InsertPitchCompetition) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(pitchCompetitions).values(competition);
  return result[0].insertId;
}

export async function getAllPitchCompetitions(): Promise<PitchCompetition[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(pitchCompetitions).orderBy(desc(pitchCompetitions.pitchDate));
}

export async function submitPitch(submission: InsertPitchSubmission) {
  const db = await getDb();
  if (!db) return;
  await db.insert(pitchSubmissions).values(submission);
}

// ============================================================================
// FORUM QUERIES
// ============================================================================

export async function createForumPost(post: InsertForumPost) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(forumPosts).values(post);
  return result[0].insertId;
}

export async function getForumPosts(filters?: { category?: string; limit?: number; offset?: number }): Promise<ForumPost[]> {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(forumPosts);
  if (filters?.category) {
    query = query.where(eq(forumPosts.category, filters.category as any)) as any;
  }
  
  return query.limit(filters?.limit || 20).offset(filters?.offset || 0).orderBy(desc(forumPosts.createdAt));
}

export async function getForumPostById(id: number): Promise<ForumPost | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(forumPosts).where(eq(forumPosts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createForumReply(reply: InsertForumReply) {
  const db = await getDb();
  if (!db) return;
  await db.insert(forumReplies).values(reply);
  await db.update(forumPosts)
    .set({ replyCount: sql`${forumPosts.replyCount} + 1` })
    .where(eq(forumPosts.id, reply.postId));
}

export async function getPostReplies(postId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(forumReplies).where(eq(forumReplies.postId, postId)).orderBy(asc(forumReplies.createdAt));
}

// ============================================================================
// PEER GROUP QUERIES
// ============================================================================

export async function createPeerGroup(group: InsertPeerGroup) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(peerGroups).values(group);
  return result[0].insertId;
}

export async function getAllPeerGroups(): Promise<PeerGroup[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(peerGroups).orderBy(desc(peerGroups.createdAt));
}

export async function joinPeerGroup(membership: InsertPeerGroupMember) {
  const db = await getDb();
  if (!db) return;
  await db.insert(peerGroupMembers).values(membership);
  await db.update(peerGroups)
    .set({ currentMembers: sql`${peerGroups.currentMembers} + 1` })
    .where(eq(peerGroups.id, membership.groupId));
}

// ============================================================================
// EVENT QUERIES
// ============================================================================

export async function createEvent(event: InsertEvent) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(events).values(event);
  return result[0].insertId;
}

export async function getAllEvents(filters?: { upcoming?: boolean }): Promise<Event[]> {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(events);
  if (filters?.upcoming) {
    query = query.where(gte(events.startTime, new Date())) as any;
  }
  
  return query.orderBy(asc(events.startTime));
}

export async function registerForEvent(registration: InsertEventRegistration) {
  const db = await getDb();
  if (!db) return;
  await db.insert(eventRegistrations).values(registration);
  await db.update(events)
    .set({ currentAttendees: sql`${events.currentAttendees} + 1` })
    .where(eq(events.id, registration.eventId));
}

// ============================================================================
// SCHOLARSHIP QUERIES
// ============================================================================

export async function createScholarship(scholarship: InsertScholarship) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(scholarships).values(scholarship);
  return result[0].insertId;
}

export async function getAllScholarships(status?: string): Promise<Scholarship[]> {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(scholarships);
  if (status) {
    query = query.where(eq(scholarships.status, status as any)) as any;
  }
  
  return query.orderBy(desc(scholarships.createdAt));
}

export async function applyForScholarship(application: InsertScholarshipApplication) {
  const db = await getDb();
  if (!db) return;
  await db.insert(scholarshipApplications).values(application);
}

// ============================================================================
// EMPLOYER QUERIES
// ============================================================================

export async function createEmployerProfile(profile: InsertEmployerProfile) {
  const db = await getDb();
  if (!db) return;
  await db.insert(employerProfiles).values(profile);
}

export async function getEmployerProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(employerProfiles).where(eq(employerProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function logCandidateView(employerId: number, candidateId: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(employerCandidateViews).values({ employerId, candidateId });
}

// ============================================================================
// SURVEY QUERIES
// ============================================================================

export async function createSurvey(survey: InsertSurvey) {
  const db = await getDb();
  if (!db) return;
  const result = await db.insert(surveys).values(survey);
  return result[0].insertId;
}

export async function getAllSurveys() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(surveys).orderBy(desc(surveys.createdAt));
}

export async function submitSurveyResponse(response: InsertSurveyResponse) {
  const db = await getDb();
  if (!db) return;
  await db.insert(surveyResponses).values(response);
  await db.update(surveys)
    .set({ totalResponses: sql`${surveys.totalResponses} + 1` })
    .where(eq(surveys.id, response.surveyId));
}

// ============================================================================
// ANALYTICS QUERIES
// ============================================================================

export async function logAnalytics(analytics: InsertPlatformAnalytics) {
  const db = await getDb();
  if (!db) return;
  await db.insert(platformAnalytics).values(analytics);
}

export async function getAnalytics(metricType: string, startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(platformAnalytics)
    .where(and(
      eq(platformAnalytics.metricType, metricType),
      gte(platformAnalytics.date, startDate),
      lte(platformAnalytics.date, endDate)
    ))
    .orderBy(asc(platformAnalytics.date));
}

export async function getPlatformStats() {
  const db = await getDb();
  if (!db) return null;
  
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [courseCount] = await db.select({ count: sql<number>`count(*)` }).from(courses).where(eq(courses.status, 'published'));
  const [enrollmentCount] = await db.select({ count: sql<number>`count(*)` }).from(courseEnrollments);
  const [businessCount] = await db.select({ count: sql<number>`count(*)` }).from(businessIdeas);
  const [completedCount] = await db.select({ count: sql<number>`count(*)` }).from(courseEnrollments).where(eq(courseEnrollments.status, 'completed'));
  
  return {
    totalUsers: userCount?.count || 0,
    totalCourses: courseCount?.count || 0,
    totalEnrollments: enrollmentCount?.count || 0,
    totalBusinessIdeas: businessCount?.count || 0,
    completedCourses: completedCount?.count || 0,
  };
}

// ============================================================================
// NOTIFICATION QUERIES
// ============================================================================

export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values(notification);
}

export async function getUserNotifications(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationRead(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
}

// ============================================================================
// ACTIVITY LOG QUERIES
// ============================================================================

export async function logActivity(activity: InsertActivityLog) {
  const db = await getDb();
  if (!db) return;
  await db.insert(activityLogs).values(activity);
}

export async function getRecentActivity(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(activityLogs).orderBy(desc(activityLogs.createdAt)).limit(limit);
}
