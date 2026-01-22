CREATE TABLE `activityLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(50),
	`entityId` int,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activityLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `businessIdeas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`vertical` varchar(100),
	`businessStatus` enum('idea','planning','launched','growing','scaled') DEFAULT 'idea',
	`demandScore` int DEFAULT 50,
	`skillsMatchScore` int DEFAULT 50,
	`capitalRequirementScore` int DEFAULT 50,
	`automationPotentialScore` int DEFAULT 50,
	`profitMarginScore` int DEFAULT 50,
	`competitionScore` int DEFAULT 50,
	`compositeScore` int DEFAULT 50,
	`estimatedStartupCost` decimal(12,2),
	`estimatedMonthlyRevenue` decimal(12,2),
	`estimatedMonthlyProfit` decimal(12,2),
	`businessPlanUrl` varchar(500),
	`businessPlanContent` text,
	`relatedCourseIds` json,
	`ideaEmbedding` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `businessIdeas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`certificateNumber` varchar(64) NOT NULL,
	`certificateUrl` varchar(500),
	`issuedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_certificateNumber_unique` UNIQUE(`certificateNumber`)
);
--> statement-breakpoint
CREATE TABLE `courseEnrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`enrollmentStatus` enum('enrolled','in_progress','completed','dropped') DEFAULT 'enrolled',
	`progress` int DEFAULT 0,
	`currentModuleId` int,
	`pointsEarned` int DEFAULT 0,
	`startedAt` timestamp DEFAULT (now()),
	`completedAt` timestamp,
	`certificateUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseEnrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courseModules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`courseId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`content` text,
	`videoUrl` varchar(500),
	`orderIndex` int DEFAULT 0,
	`estimatedMinutes` int DEFAULT 30,
	`aiGenerated` boolean DEFAULT true,
	`smeApproved` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courseModules_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`shortDescription` varchar(500),
	`category` varchar(100),
	`skillLevel` enum('beginner','intermediate','advanced','expert') DEFAULT 'beginner',
	`courseStatus` enum('draft','pending_review','approved','published','archived') DEFAULT 'draft',
	`thumbnailUrl` varchar(500),
	`estimatedHours` int DEFAULT 1,
	`totalModules` int DEFAULT 0,
	`aiGenerated` boolean DEFAULT true,
	`aiGenerationPrompt` text,
	`smeReviewerId` int,
	`smeReviewedAt` timestamp,
	`smeNotes` text,
	`demandScore` int DEFAULT 50,
	`relevanceScore` int DEFAULT 50,
	`prerequisites` json,
	`tags` json,
	`learningOutcomes` json,
	`courseEmbedding` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`),
	CONSTRAINT `courses_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `employerCandidateViews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employerId` int NOT NULL,
	`candidateId` int NOT NULL,
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	`notes` text,
	`interested` boolean DEFAULT false,
	CONSTRAINT `employerCandidateViews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employerProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`companyLogo` varchar(500),
	`industry` varchar(100),
	`companySize` varchar(50),
	`website` varchar(500),
	`description` text,
	`hiringInterests` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employerProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `eventRegistrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eventId` int NOT NULL,
	`userId` int NOT NULL,
	`status` varchar(50) DEFAULT 'registered',
	`attendedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `eventRegistrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`eventType` varchar(50),
	`location` varchar(500),
	`virtualLink` varchar(500),
	`startTime` timestamp,
	`endTime` timestamp,
	`maxAttendees` int,
	`currentAttendees` int DEFAULT 0,
	`hostId` int,
	`isPublic` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forumPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text,
	`forumCategory` enum('general','courses','business','networking','support','success_stories') DEFAULT 'general',
	`isPinned` boolean DEFAULT false,
	`isLocked` boolean DEFAULT false,
	`viewCount` int DEFAULT 0,
	`likeCount` int DEFAULT 0,
	`replyCount` int DEFAULT 0,
	`sentimentScore` decimal(5,4),
	`flaggedForReview` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `forumPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `forumReplies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text,
	`likeCount` int DEFAULT 0,
	`sentimentScore` decimal(5,4),
	`flaggedForReview` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `forumReplies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `moduleProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`completed` boolean DEFAULT false,
	`timeSpentMinutes` int DEFAULT 0,
	`quizScore` int,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `moduleProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text,
	`link` varchar(500),
	`isRead` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `peerGroupMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupId` int NOT NULL,
	`userId` int NOT NULL,
	`role` varchar(50) DEFAULT 'member',
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `peerGroupMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `peerGroups` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100),
	`maxMembers` int DEFAULT 20,
	`currentMembers` int DEFAULT 0,
	`isPrivate` boolean DEFAULT false,
	`createdById` int,
	`groupEmbedding` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `peerGroups_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pitchCompetitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`quarter` varchar(10),
	`year` int,
	`prizePool` decimal(12,2),
	`maxParticipants` int DEFAULT 50,
	`applicationDeadline` timestamp,
	`pitchDate` timestamp,
	`status` varchar(50) DEFAULT 'upcoming',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pitchCompetitions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pitchSubmissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`competitionId` int NOT NULL,
	`businessIdeaId` int NOT NULL,
	`pitchStatus` enum('draft','submitted','under_review','selected','funded','rejected') DEFAULT 'draft',
	`pitchDeckUrl` varchar(500),
	`videoUrl` varchar(500),
	`executiveSummary` text,
	`fundingRequested` decimal(12,2),
	`fundingAwarded` decimal(12,2),
	`judgeNotes` text,
	`score` int,
	`submittedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pitchSubmissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platformAnalytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date` timestamp NOT NULL,
	`metricType` varchar(100) NOT NULL,
	`metricValue` decimal(14,4),
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `platformAnalytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scholarshipApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`scholarshipId` int NOT NULL,
	`userId` int NOT NULL,
	`applicationStatus` enum('pending','approved','rejected','waitlisted') DEFAULT 'pending',
	`applicationEssay` text,
	`reviewNotes` text,
	`reviewedById` int,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scholarshipApplications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scholarships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`sponsorId` int,
	`sponsorName` varchar(255),
	`sponsorLogo` varchar(500),
	`amount` decimal(12,2),
	`totalSlots` int DEFAULT 10,
	`remainingSlots` int DEFAULT 10,
	`eligibilityCriteria` json,
	`applicationDeadline` timestamp,
	`scholarshipStatus` enum('open','closed','awarded') DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scholarships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `surveyResponses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`surveyId` int NOT NULL,
	`userId` int,
	`responses` json,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `surveyResponses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `surveys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`createdById` int,
	`isActive` boolean DEFAULT true,
	`questions` json,
	`totalResponses` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `surveys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`age` int,
	`location` varchar(255),
	`city` varchar(100),
	`state` varchar(100),
	`country` varchar(100) DEFAULT 'USA',
	`displacementReason` enum('layoff','automation','industry_shift','company_closure','relocation','health','caregiving','other'),
	`displacementDate` timestamp,
	`previousIndustry` varchar(255),
	`previousRole` varchar(255),
	`yearsExperience` int,
	`skills` json,
	`interests` json,
	`businessGoals` json,
	`unmetNeeds` json,
	`capitalAvailable` decimal(12,2),
	`monthlyIncomeGoal` decimal(10,2),
	`resumeUrl` varchar(500),
	`bio` text,
	`linkedinUrl` varchar(500),
	`profileEmbedding` json,
	`totalPoints` int DEFAULT 0,
	`level` int DEFAULT 1,
	`badges` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userProfiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','sme','employer','sponsor') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `pictureUrl` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `onboardingCompleted` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `activityLogs` ADD CONSTRAINT `activityLogs_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `businessIdeas` ADD CONSTRAINT `businessIdeas_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courseEnrollments` ADD CONSTRAINT `courseEnrollments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courseEnrollments` ADD CONSTRAINT `courseEnrollments_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courseEnrollments` ADD CONSTRAINT `courseEnrollments_currentModuleId_courseModules_id_fk` FOREIGN KEY (`currentModuleId`) REFERENCES `courseModules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courseModules` ADD CONSTRAINT `courseModules_courseId_courses_id_fk` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `courses` ADD CONSTRAINT `courses_smeReviewerId_users_id_fk` FOREIGN KEY (`smeReviewerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employerCandidateViews` ADD CONSTRAINT `employerCandidateViews_employerId_users_id_fk` FOREIGN KEY (`employerId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employerCandidateViews` ADD CONSTRAINT `employerCandidateViews_candidateId_users_id_fk` FOREIGN KEY (`candidateId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employerProfiles` ADD CONSTRAINT `employerProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `eventRegistrations` ADD CONSTRAINT `eventRegistrations_eventId_events_id_fk` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `eventRegistrations` ADD CONSTRAINT `eventRegistrations_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `events` ADD CONSTRAINT `events_hostId_users_id_fk` FOREIGN KEY (`hostId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forumPosts` ADD CONSTRAINT `forumPosts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forumReplies` ADD CONSTRAINT `forumReplies_postId_forumPosts_id_fk` FOREIGN KEY (`postId`) REFERENCES `forumPosts`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `forumReplies` ADD CONSTRAINT `forumReplies_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `moduleProgress` ADD CONSTRAINT `moduleProgress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `moduleProgress` ADD CONSTRAINT `moduleProgress_moduleId_courseModules_id_fk` FOREIGN KEY (`moduleId`) REFERENCES `courseModules`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `peerGroupMembers` ADD CONSTRAINT `peerGroupMembers_groupId_peerGroups_id_fk` FOREIGN KEY (`groupId`) REFERENCES `peerGroups`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `peerGroupMembers` ADD CONSTRAINT `peerGroupMembers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `peerGroups` ADD CONSTRAINT `peerGroups_createdById_users_id_fk` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pitchSubmissions` ADD CONSTRAINT `pitchSubmissions_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pitchSubmissions` ADD CONSTRAINT `pitchSubmissions_competitionId_pitchCompetitions_id_fk` FOREIGN KEY (`competitionId`) REFERENCES `pitchCompetitions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pitchSubmissions` ADD CONSTRAINT `pitchSubmissions_businessIdeaId_businessIdeas_id_fk` FOREIGN KEY (`businessIdeaId`) REFERENCES `businessIdeas`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scholarshipApplications` ADD CONSTRAINT `scholarshipApplications_scholarshipId_scholarships_id_fk` FOREIGN KEY (`scholarshipId`) REFERENCES `scholarships`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scholarshipApplications` ADD CONSTRAINT `scholarshipApplications_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scholarshipApplications` ADD CONSTRAINT `scholarshipApplications_reviewedById_users_id_fk` FOREIGN KEY (`reviewedById`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scholarships` ADD CONSTRAINT `scholarships_sponsorId_users_id_fk` FOREIGN KEY (`sponsorId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `surveyResponses` ADD CONSTRAINT `surveyResponses_surveyId_surveys_id_fk` FOREIGN KEY (`surveyId`) REFERENCES `surveys`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `surveyResponses` ADD CONSTRAINT `surveyResponses_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `surveys` ADD CONSTRAINT `surveys_createdById_users_id_fk` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userProfiles` ADD CONSTRAINT `userProfiles_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;