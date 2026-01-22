import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";
import { generateCourse, scoreBusinessIdea, generateBusinessPlan, analyzeUserProfile, moderateContent } from "./services/aiServices";
import { nanoid } from "nanoid";

// ============================================================================
// ADMIN PROCEDURE
// ============================================================================

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

const smeProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'sme' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'SME access required' });
  }
  return next({ ctx });
});

const employerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'employer' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Employer access required' });
  }
  return next({ ctx });
});

// ============================================================================
// AUTH ROUTER
// ============================================================================

const authRouter = router({
  me: publicProcedure.query(opts => opts.ctx.user),
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true } as const;
  }),
});

// ============================================================================
// PROFILE ROUTER
// ============================================================================

const profileRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    return db.getUserProfile(ctx.user.id);
  }),
  
  upsert: protectedProcedure
    .input(z.object({
      age: z.number().optional(),
      location: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      country: z.string().optional(),
      displacementReason: z.enum(['layoff', 'automation', 'industry_shift', 'company_closure', 'relocation', 'health', 'caregiving', 'other']).optional(),
      displacementDate: z.date().optional(),
      previousIndustry: z.string().optional(),
      previousRole: z.string().optional(),
      yearsExperience: z.number().optional(),
      skills: z.array(z.string()).optional(),
      interests: z.array(z.string()).optional(),
      businessGoals: z.array(z.string()).optional(),
      unmetNeeds: z.array(z.string()).optional(),
      capitalAvailable: z.string().optional(),
      monthlyIncomeGoal: z.string().optional(),
      bio: z.string().optional(),
      linkedinUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.upsertUserProfile({
        userId: ctx.user.id,
        ...input,
      });
      return { success: true };
    }),

  completeOnboarding: protectedProcedure.mutation(async ({ ctx }) => {
    await db.updateUserOnboarding(ctx.user.id, true);
    return { success: true };
  }),

  analyze: protectedProcedure.mutation(async ({ ctx }) => {
    const profile = await db.getUserProfile(ctx.user.id);
    if (!profile) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' });
    }
    
    return analyzeUserProfile({
      skills: profile.skills || [],
      interests: profile.interests || [],
      previousRole: profile.previousRole || '',
      previousIndustry: profile.previousIndustry || '',
      businessGoals: profile.businessGoals || [],
      displacementReason: profile.displacementReason || '',
    });
  }),
});

// ============================================================================
// COURSE ROUTER
// ============================================================================

const courseRouter = router({
  list: publicProcedure
    .input(z.object({
      status: z.string().optional(),
      category: z.string().optional(),
      skillLevel: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getAllCourses(input);
    }),

  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.getCourseById(input.id);
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return db.getCourseBySlug(input.slug);
    }),

  getModules: publicProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input }) => {
      return db.getCourseModules(input.courseId);
    }),

  enroll: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await db.getEnrollment(ctx.user.id, input.courseId);
      if (existing) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Already enrolled' });
      }
      await db.enrollInCourse({
        userId: ctx.user.id,
        courseId: input.courseId,
      });
      await db.logActivity({
        userId: ctx.user.id,
        action: 'course_enrolled',
        entityType: 'course',
        entityId: input.courseId,
      });
      return { success: true };
    }),

  getEnrollments: protectedProcedure.query(async ({ ctx }) => {
    return db.getUserEnrollments(ctx.user.id);
  }),

  updateProgress: protectedProcedure
    .input(z.object({
      courseId: z.number(),
      progress: z.number().min(0).max(100),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.updateEnrollmentProgress(ctx.user.id, input.courseId, input.progress);
      if (input.progress >= 100) {
        await db.updateUserPoints(ctx.user.id, 100);
        await db.logActivity({
          userId: ctx.user.id,
          action: 'course_completed',
          entityType: 'course',
          entityId: input.courseId,
        });
      }
      return { success: true };
    }),

  // Admin/SME routes
  generate: adminProcedure
    .input(z.object({
      topic: z.string(),
      targetAudience: z.string(),
      skillLevel: z.string(),
      focusAreas: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const generated = await generateCourse(input);
      const slug = generated.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const courseId = await db.createCourse({
        title: generated.title,
        slug: `${slug}-${nanoid(6)}`,
        description: generated.description,
        shortDescription: generated.shortDescription,
        category: generated.category,
        skillLevel: generated.skillLevel as any,
        status: 'pending_review',
        estimatedHours: generated.estimatedHours,
        totalModules: generated.modules.length,
        aiGenerated: true,
        learningOutcomes: generated.learningOutcomes,
        tags: generated.tags,
      });

      if (courseId) {
        for (const module of generated.modules) {
          await db.createCourseModule({
            courseId,
            title: module.title,
            description: module.description,
            content: module.content,
            estimatedMinutes: module.estimatedMinutes,
            orderIndex: module.orderIndex,
            aiGenerated: true,
          });
        }
      }

      return { courseId, generated };
    }),

  approve: smeProcedure
    .input(z.object({
      courseId: z.number(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.updateCourse(input.courseId, {
        status: 'approved',
        smeReviewerId: ctx.user.id,
        smeReviewedAt: new Date(),
        smeNotes: input.notes,
      });
      return { success: true };
    }),

  publish: adminProcedure
    .input(z.object({ courseId: z.number() }))
    .mutation(async ({ input }) => {
      await db.updateCourse(input.courseId, { status: 'published' });
      return { success: true };
    }),
});

// ============================================================================
// BUSINESS ROUTER
// ============================================================================

const businessRouter = router({
  listIdeas: protectedProcedure.query(async ({ ctx }) => {
    return db.getUserBusinessIdeas(ctx.user.id);
  }),

  getIdea: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const idea = await db.getBusinessIdeaById(input.id);
      if (!idea || idea.userId !== ctx.user.id) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      return idea;
    }),

  createIdea: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      vertical: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const profile = await db.getUserProfile(ctx.user.id);
      const enrollments = await db.getUserEnrollments(ctx.user.id);
      
      // Score the business idea
      const scores = await scoreBusinessIdea({
        ideaTitle: input.title,
        ideaDescription: input.description,
        userSkills: profile?.skills || [],
        capitalAvailable: Number(profile?.capitalAvailable) || 0,
        completedCourses: enrollments.filter(e => e.status === 'completed').map(e => `Course ${e.courseId}`),
      });

      const ideaId = await db.createBusinessIdea({
        userId: ctx.user.id,
        title: input.title,
        description: input.description,
        vertical: input.vertical,
        demandScore: scores.demandScore,
        skillsMatchScore: scores.skillsMatchScore,
        capitalRequirementScore: scores.capitalRequirementScore,
        automationPotentialScore: scores.automationPotentialScore,
        profitMarginScore: scores.profitMarginScore,
        competitionScore: scores.competitionScore,
        compositeScore: scores.compositeScore,
      });

      await db.logActivity({
        userId: ctx.user.id,
        action: 'business_idea_created',
        entityType: 'business_idea',
        entityId: ideaId,
      });

      return { ideaId, scores };
    }),

  generatePlan: protectedProcedure
    .input(z.object({ ideaId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const idea = await db.getBusinessIdeaById(input.ideaId);
      if (!idea || idea.userId !== ctx.user.id) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      const profile = await db.getUserProfile(ctx.user.id);
      
      const plan = await generateBusinessPlan({
        ideaTitle: idea.title,
        ideaDescription: idea.description || '',
        userBackground: `${profile?.previousRole || ''} in ${profile?.previousIndustry || ''}`,
        capitalAvailable: Number(profile?.capitalAvailable) || 0,
        targetMarket: 'Small to medium businesses and consumers',
      });

      await db.updateBusinessIdea(input.ideaId, {
        businessPlanContent: JSON.stringify(plan),
        estimatedStartupCost: String(plan.financialProjections.startupCosts),
        estimatedMonthlyRevenue: String(plan.financialProjections.projectedRevenue),
      });

      return plan;
    }),

  // Pitch competitions
  listCompetitions: publicProcedure.query(async () => {
    return db.getAllPitchCompetitions();
  }),

  submitPitch: protectedProcedure
    .input(z.object({
      competitionId: z.number(),
      businessIdeaId: z.number(),
      executiveSummary: z.string(),
      fundingRequested: z.string(),
      pitchDeckUrl: z.string().optional(),
      videoUrl: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.submitPitch({
        userId: ctx.user.id,
        competitionId: input.competitionId,
        businessIdeaId: input.businessIdeaId,
        executiveSummary: input.executiveSummary,
        fundingRequested: input.fundingRequested,
        pitchDeckUrl: input.pitchDeckUrl,
        videoUrl: input.videoUrl,
        status: 'submitted',
        submittedAt: new Date(),
      });
      return { success: true };
    }),
});

// ============================================================================
// COMMUNITY ROUTER
// ============================================================================

const communityRouter = router({
  // Forum
  listPosts: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getForumPosts(input);
    }),

  getPost: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.getForumPostById(input.id);
    }),

  createPost: protectedProcedure
    .input(z.object({
      title: z.string(),
      content: z.string(),
      category: z.enum(['general', 'courses', 'business', 'networking', 'support', 'success_stories']),
    }))
    .mutation(async ({ ctx, input }) => {
      // Moderate content
      const moderation = await moderateContent(input.content);
      
      const postId = await db.createForumPost({
        userId: ctx.user.id,
        title: input.title,
        content: input.content,
        category: input.category,
        sentimentScore: String(moderation.sentimentScore),
        flaggedForReview: moderation.suggestedAction !== 'approve',
      });

      await db.updateUserPoints(ctx.user.id, 5);
      return { postId, moderation };
    }),

  getReplies: publicProcedure
    .input(z.object({ postId: z.number() }))
    .query(async ({ input }) => {
      return db.getPostReplies(input.postId);
    }),

  createReply: protectedProcedure
    .input(z.object({
      postId: z.number(),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const moderation = await moderateContent(input.content);
      
      await db.createForumReply({
        postId: input.postId,
        userId: ctx.user.id,
        content: input.content,
        sentimentScore: String(moderation.sentimentScore),
        flaggedForReview: moderation.suggestedAction !== 'approve',
      });

      await db.updateUserPoints(ctx.user.id, 2);
      return { success: true, moderation };
    }),

  // Peer Groups
  listGroups: publicProcedure.query(async () => {
    return db.getAllPeerGroups();
  }),

  createGroup: protectedProcedure
    .input(z.object({
      name: z.string(),
      description: z.string(),
      category: z.string(),
      maxMembers: z.number().optional(),
      isPrivate: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const groupId = await db.createPeerGroup({
        ...input,
        createdById: ctx.user.id,
      });
      
      // Auto-join creator
      if (groupId) {
        await db.joinPeerGroup({
          groupId,
          userId: ctx.user.id,
          role: 'admin',
        });
      }
      
      return { groupId };
    }),

  joinGroup: protectedProcedure
    .input(z.object({ groupId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.joinPeerGroup({
        groupId: input.groupId,
        userId: ctx.user.id,
      });
      return { success: true };
    }),

  // Events
  listEvents: publicProcedure
    .input(z.object({ upcoming: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      return db.getAllEvents(input);
    }),

  createEvent: protectedProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      eventType: z.string(),
      location: z.string().optional(),
      virtualLink: z.string().optional(),
      startTime: z.date(),
      endTime: z.date(),
      maxAttendees: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const eventId = await db.createEvent({
        ...input,
        hostId: ctx.user.id,
      });
      return { eventId };
    }),

  registerForEvent: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.registerForEvent({
        eventId: input.eventId,
        userId: ctx.user.id,
      });
      return { success: true };
    }),
});

// ============================================================================
// SCHOLARSHIP ROUTER
// ============================================================================

const scholarshipRouter = router({
  list: publicProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async ({ input }) => {
      return db.getAllScholarships(input?.status);
    }),

  submitApplication: protectedProcedure
    .input(z.object({
      scholarshipId: z.number(),
      applicationEssay: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.applyForScholarship({
        scholarshipId: input.scholarshipId,
        userId: ctx.user.id,
        applicationEssay: input.applicationEssay,
      });
      return { success: true };
    }),

  // Admin routes
  create: adminProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      sponsorName: z.string(),
      amount: z.string(),
      totalSlots: z.number(),
      applicationDeadline: z.date(),
    }))
    .mutation(async ({ input }) => {
      const scholarshipId = await db.createScholarship({
        ...input,
        remainingSlots: input.totalSlots,
      });
      return { scholarshipId };
    }),
});

// ============================================================================
// EMPLOYER ROUTER
// ============================================================================

const employerRouter = router({
  getProfile: employerProcedure.query(async ({ ctx }) => {
    return db.getEmployerProfile(ctx.user.id);
  }),

  createProfile: employerProcedure
    .input(z.object({
      companyName: z.string(),
      industry: z.string(),
      companySize: z.string(),
      website: z.string().optional(),
      description: z.string().optional(),
      hiringInterests: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.createEmployerProfile({
        userId: ctx.user.id,
        ...input,
      });
      return { success: true };
    }),

  viewCandidate: employerProcedure
    .input(z.object({ candidateId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.logCandidateView(ctx.user.id, input.candidateId);
      return { success: true };
    }),
});

// ============================================================================
// SURVEY ROUTER
// ============================================================================

const surveyRouter = router({
  list: publicProcedure.query(async () => {
    return db.getAllSurveys();
  }),

  submit: publicProcedure
    .input(z.object({
      surveyId: z.number(),
      responses: z.record(z.string(), z.unknown()),
    }))
    .mutation(async ({ ctx, input }) => {
      await db.submitSurveyResponse({
        surveyId: input.surveyId,
        userId: ctx.user?.id,
        responses: input.responses,
      });
      return { success: true };
    }),

  create: adminProcedure
    .input(z.object({
      title: z.string(),
      description: z.string(),
      questions: z.array(z.object({
        id: z.string(),
        type: z.string(),
        question: z.string(),
        options: z.array(z.string()).optional(),
        required: z.boolean().optional(),
      })),
    }))
    .mutation(async ({ ctx, input }) => {
      const surveyId = await db.createSurvey({
        ...input,
        createdById: ctx.user.id,
      });
      return { surveyId };
    }),
});

// ============================================================================
// ANALYTICS ROUTER
// ============================================================================

const analyticsRouter = router({
  getPlatformStats: adminProcedure.query(async () => {
    return db.getPlatformStats();
  }),

  getRecentActivity: adminProcedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async ({ input }) => {
      return db.getRecentActivity(input?.limit || 50);
    }),

  getAllUsers: adminProcedure
    .input(z.object({
      limit: z.number().optional(),
      offset: z.number().optional(),
    }).optional())
    .query(async ({ input }) => {
      return db.getAllUsers(input?.limit, input?.offset);
    }),
});

// ============================================================================
// NOTIFICATION ROUTER
// ============================================================================

const notificationRouter = router({
  list: protectedProcedure
    .input(z.object({ limit: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return db.getUserNotifications(ctx.user.id, input?.limit);
    }),

  markRead: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.markNotificationRead(input.id);
      return { success: true };
    }),
});

// ============================================================================
// MAIN ROUTER
// ============================================================================

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  profile: profileRouter,
  course: courseRouter,
  business: businessRouter,
  community: communityRouter,
  scholarship: scholarshipRouter,
  employer: employerRouter,
  survey: surveyRouter,
  analytics: analyticsRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
