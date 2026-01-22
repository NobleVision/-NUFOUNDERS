#!/usr/bin/env node
/**
 * NuFounders Demo Data Seed Script
 * Populates the database with comprehensive mock data for demo purposes
 */

import mysql from 'mysql2/promise';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in environment');
  process.exit(1);
}

// Parse connection string
const url = new URL(DATABASE_URL);
const connection = await mysql.createConnection({
  host: url.hostname,
  port: parseInt(url.port) || 3306,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: false }
});

console.log('Connected to database');

// Helper functions
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Data arrays
const firstNames = [
  'Keisha', 'Tamara', 'Destiny', 'Michelle', 'Jasmine', 'Aaliyah', 'Imani', 'Zara',
  'Brianna', 'Kiara', 'Nyah', 'Amara', 'Nia', 'Sasha', 'Tiana', 'Maya', 'Layla',
  'Aisha', 'Kendra', 'Simone', 'Ebony', 'Crystal', 'Diamond', 'Precious', 'Jade',
  'Amber', 'Essence', 'Harmony', 'Serenity', 'Trinity', 'Faith', 'Hope', 'Grace',
  'Joy', 'Charity', 'Patience', 'Destiny', 'Miracle', 'Blessing', 'Heaven'
];

const lastNames = [
  'Williams', 'Johnson', 'Carter', 'Roberts', 'Brown', 'Davis', 'Wilson', 'Moore',
  'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson',
  'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker',
  'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green', 'Baker', 'Adams',
  'Nelson', 'Hill', 'Ramirez', 'Campbell', 'Mitchell', 'Roberts', 'Carter'
];

const cities = [
  { city: 'Atlanta', state: 'GA' },
  { city: 'Houston', state: 'TX' },
  { city: 'Chicago', state: 'IL' },
  { city: 'New York', state: 'NY' },
  { city: 'Los Angeles', state: 'CA' },
  { city: 'Detroit', state: 'MI' },
  { city: 'Philadelphia', state: 'PA' },
  { city: 'Baltimore', state: 'MD' },
  { city: 'Washington', state: 'DC' },
  { city: 'Miami', state: 'FL' },
  { city: 'Dallas', state: 'TX' },
  { city: 'Charlotte', state: 'NC' },
  { city: 'Memphis', state: 'TN' },
  { city: 'New Orleans', state: 'LA' },
  { city: 'Oakland', state: 'CA' }
];

const displacementReasons = ['layoff', 'automation', 'industry_shift', 'company_closure', 'relocation', 'health', 'caregiving', 'other'];
const industries = ['Healthcare', 'Retail', 'Finance', 'Technology', 'Education', 'Hospitality', 'Manufacturing', 'Government', 'Non-profit', 'Real Estate'];
const roles = ['Manager', 'Specialist', 'Coordinator', 'Analyst', 'Director', 'Associate', 'Supervisor', 'Administrator', 'Consultant', 'Representative'];

const skills = [
  'Marketing', 'Sales', 'Customer Service', 'Project Management', 'Data Analysis',
  'Social Media', 'Content Writing', 'Graphic Design', 'Web Development', 'Accounting',
  'HR Management', 'Event Planning', 'Public Speaking', 'Leadership', 'Negotiation',
  'Microsoft Office', 'Google Workspace', 'CRM Systems', 'E-commerce', 'Photography'
];

const interests = [
  'Digital Marketing', 'E-commerce', 'Consulting', 'Coaching', 'Event Planning',
  'Food & Beverage', 'Fashion & Beauty', 'Health & Wellness', 'Education', 'Technology',
  'Real Estate', 'Finance', 'Non-profit', 'Creative Arts', 'Home Services'
];

const businessGoals = [
  'Start my own business', 'Freelance/Consulting', 'Find new employment',
  'Transition to tech', 'Build passive income', 'Grow existing business',
  'Learn new skills', 'Network with others', 'Access funding'
];

const unmetNeeds = [
  'Business funding', 'Technical skills', 'Marketing knowledge', 'Legal guidance',
  'Accounting help', 'Mentorship', 'Networking opportunities', 'Childcare support',
  'Transportation', 'Healthcare', 'Housing stability', 'Mental health support'
];

// Course data
const courses = [
  { title: 'Digital Marketing Fundamentals', category: 'Marketing', skillLevel: 'beginner', hours: 8, modules: 6, demandScore: 92 },
  { title: 'Entrepreneurship 101', category: 'Business', skillLevel: 'beginner', hours: 12, modules: 8, demandScore: 95 },
  { title: 'AI Literacy for Business', category: 'Technology', skillLevel: 'intermediate', hours: 6, modules: 5, demandScore: 88 },
  { title: 'Financial Management for Entrepreneurs', category: 'Finance', skillLevel: 'intermediate', hours: 10, modules: 7, demandScore: 85 },
  { title: 'E-commerce Mastery', category: 'E-commerce', skillLevel: 'intermediate', hours: 15, modules: 10, demandScore: 90 },
  { title: 'Personal Branding & LinkedIn', category: 'Marketing', skillLevel: 'beginner', hours: 5, modules: 4, demandScore: 82 },
  { title: 'Project Management Essentials', category: 'Business', skillLevel: 'beginner', hours: 8, modules: 6, demandScore: 78 },
  { title: 'Advanced Social Media Strategy', category: 'Marketing', skillLevel: 'advanced', hours: 10, modules: 8, demandScore: 86 },
  { title: 'Business Communication Skills', category: 'Business', skillLevel: 'beginner', hours: 6, modules: 5, demandScore: 80 },
  { title: 'Web Design for Non-Designers', category: 'Technology', skillLevel: 'beginner', hours: 8, modules: 6, demandScore: 84 },
  { title: 'Customer Service Excellence', category: 'Business', skillLevel: 'beginner', hours: 5, modules: 4, demandScore: 75 },
  { title: 'Data Analytics Fundamentals', category: 'Technology', skillLevel: 'intermediate', hours: 12, modules: 8, demandScore: 89 },
  { title: 'Sales Mastery', category: 'Business', skillLevel: 'intermediate', hours: 10, modules: 7, demandScore: 83 },
  { title: 'Content Marketing Strategy', category: 'Marketing', skillLevel: 'intermediate', hours: 8, modules: 6, demandScore: 87 },
  { title: 'Leadership & Team Building', category: 'Business', skillLevel: 'advanced', hours: 12, modules: 8, demandScore: 81 },
  { title: 'Bookkeeping Basics', category: 'Finance', skillLevel: 'beginner', hours: 6, modules: 5, demandScore: 76 },
  { title: 'Email Marketing Mastery', category: 'Marketing', skillLevel: 'intermediate', hours: 7, modules: 5, demandScore: 84 },
  { title: 'Business Law Essentials', category: 'Business', skillLevel: 'intermediate', hours: 8, modules: 6, demandScore: 72 },
  { title: 'Graphic Design Fundamentals', category: 'Technology', skillLevel: 'beginner', hours: 10, modules: 7, demandScore: 79 },
  { title: 'Negotiation Skills', category: 'Business', skillLevel: 'intermediate', hours: 6, modules: 4, demandScore: 85 },
  { title: 'SEO Fundamentals', category: 'Marketing', skillLevel: 'beginner', hours: 5, modules: 4, demandScore: 88 },
  { title: 'Podcast & Video Production', category: 'Technology', skillLevel: 'intermediate', hours: 8, modules: 6, demandScore: 77 },
  { title: 'Franchise Ownership 101', category: 'Business', skillLevel: 'advanced', hours: 10, modules: 7, demandScore: 74 },
  { title: 'Real Estate Investing Basics', category: 'Finance', skillLevel: 'intermediate', hours: 8, modules: 6, demandScore: 82 },
  { title: 'Public Speaking & Presentation', category: 'Business', skillLevel: 'beginner', hours: 6, modules: 5, demandScore: 80 }
];

// Business verticals
const businessVerticals = [
  'Digital Marketing Agency', 'E-commerce Store', 'Consulting Services', 'Event Planning',
  'Food & Beverage', 'Fashion & Beauty', 'Health & Wellness', 'Education & Tutoring',
  'Tech Services', 'Real Estate', 'Financial Services', 'Non-profit', 'Creative Agency',
  'Home Services', 'Personal Coaching', 'Virtual Assistant Services', 'Content Creation',
  'Social Media Management', 'Bookkeeping Services', 'HR Consulting'
];

async function seedData() {
  try {
    console.log('Starting data seed...');

    // Seed courses
    console.log('Seeding courses...');
    for (const course of courses) {
      const slug = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await connection.execute(
        `INSERT INTO courses (title, slug, shortDescription, description, category, skillLevel, estimatedHours, totalModules, status, demandScore, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE title=title`,
        [
          course.title,
          slug,
          `Master ${course.title.toLowerCase()} with this comprehensive course designed for ${course.skillLevel} learners.`,
          `This course covers everything you need to know about ${course.title.toLowerCase()}. Perfect for displaced workers and aspiring entrepreneurs looking to build new skills and launch their careers.`,
          course.category,
          course.skillLevel,
          course.hours,
          course.modules,
          course.demandScore
        ]
      );
    }
    console.log(`Seeded ${courses.length} courses`);

    // Get course IDs
    const [courseRows] = await connection.execute('SELECT id, title FROM courses');
    const courseMap = new Map(courseRows.map(c => [c.title, c.id]));

    // Seed user profiles (50 demo users)
    console.log('Seeding user profiles...');
    const userCount = 50;
    const userIds = [];
    
    for (let i = 0; i < userCount; i++) {
      const firstName = randomChoice(firstNames);
      const lastName = randomChoice(lastNames);
      const location = randomChoice(cities);
      const openId = `demo-user-${randomUUID().slice(0, 8)}`;
      
      // Insert user
      const [userResult] = await connection.execute(
        `INSERT INTO users (openId, name, email, role, createdAt, updatedAt, lastSignedIn)
         VALUES (?, ?, ?, 'user', NOW(), NOW(), NOW())`,
        [
          openId,
          `${firstName} ${lastName}`,
          `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`
        ]
      );
      
      const userId = userResult.insertId;
      userIds.push(userId);

      // Insert profile
      const userSkills = Array.from({ length: randomInt(3, 8) }, () => randomChoice(skills));
      const userInterests = Array.from({ length: randomInt(2, 5) }, () => randomChoice(interests));
      const userGoals = Array.from({ length: randomInt(2, 4) }, () => randomChoice(businessGoals));
      const userNeeds = Array.from({ length: randomInt(2, 5) }, () => randomChoice(unmetNeeds));
      
      await connection.execute(
        `INSERT INTO userProfiles (userId, age, city, state, displacementReason, previousIndustry, previousRole, yearsExperience, skills, interests, businessGoals, unmetNeeds, capitalAvailable, monthlyIncomeGoal, bio, onboardingCompleted, totalPoints, level, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true, ?, ?, NOW(), NOW())`,
        [
          userId,
          randomInt(22, 55),
          location.city,
          location.state,
          randomChoice(displacementReasons),
          randomChoice(industries),
          randomChoice(roles),
          randomInt(2, 20),
          JSON.stringify([...new Set(userSkills)]),
          JSON.stringify([...new Set(userInterests)]),
          JSON.stringify([...new Set(userGoals)]),
          JSON.stringify([...new Set(userNeeds)]),
          `${randomInt(1, 50) * 1000}`,
          `${randomInt(3, 15) * 1000}`,
          `Passionate entrepreneur looking to build a successful business and make a positive impact in my community.`,
          randomInt(100, 5000),
          randomInt(1, 10)
        ]
      );
    }
    console.log(`Seeded ${userCount} user profiles`);

    // Seed course enrollments
    console.log('Seeding course enrollments...');
    let enrollmentCount = 0;
    for (const userId of userIds) {
      const numEnrollments = randomInt(1, 5);
      const enrolledCourses = new Set();
      
      for (let i = 0; i < numEnrollments; i++) {
        const courseTitle = randomChoice(courses).title;
        const courseId = courseMap.get(courseTitle);
        
        if (courseId && !enrolledCourses.has(courseId)) {
          enrolledCourses.add(courseId);
          const progress = randomInt(0, 100);
          const status = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'enrolled';
          
          await connection.execute(
            `INSERT INTO courseEnrollments (userId, courseId, status, progress, enrolledAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, NOW())`,
            [
              userId,
              courseId,
              status,
              progress,
              randomDate(new Date('2025-06-01'), new Date())
            ]
          );
          enrollmentCount++;
        }
      }
    }
    console.log(`Seeded ${enrollmentCount} course enrollments`);

    // Seed business ideas
    console.log('Seeding business ideas...');
    let ideaCount = 0;
    for (const userId of userIds) {
      if (Math.random() > 0.4) { // 60% of users have business ideas
        const numIdeas = randomInt(1, 3);
        
        for (let i = 0; i < numIdeas; i++) {
          const vertical = randomChoice(businessVerticals);
          const demandScore = randomInt(60, 95);
          const skillsMatchScore = randomInt(55, 95);
          const capitalScore = randomInt(50, 95);
          const automationScore = randomInt(40, 90);
          const profitScore = randomInt(55, 90);
          const competitionScore = randomInt(45, 85);
          const compositeScore = Math.round((demandScore + skillsMatchScore + capitalScore + automationScore + profitScore + competitionScore) / 6);
          
          await connection.execute(
            `INSERT INTO businessIdeas (userId, title, description, vertical, status, demandScore, skillsMatchScore, capitalRequirementScore, automationPotentialScore, profitMarginScore, competitionScore, compositeScore, estimatedStartupCost, estimatedMonthlyRevenue, createdAt, updatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
              userId,
              `${vertical} Business`,
              `A ${vertical.toLowerCase()} business focused on serving underserved communities with high-quality, affordable services.`,
              vertical,
              randomChoice(['idea', 'planning', 'launched']),
              demandScore,
              skillsMatchScore,
              capitalScore,
              automationScore,
              profitScore,
              competitionScore,
              compositeScore,
              randomInt(2, 25) * 1000,
              randomInt(3, 20) * 1000
            ]
          );
          ideaCount++;
        }
      }
    }
    console.log(`Seeded ${ideaCount} business ideas`);

    // Seed pitch competitions
    console.log('Seeding pitch competitions...');
    const competitions = [
      { title: 'Q1 2026 NuFounders Pitch Competition', quarter: 'Q1 2026', prizePool: 100000, maxParticipants: 50, deadline: '2026-02-15', pitchDate: '2026-03-01' },
      { title: 'Women in Tech Startup Challenge', quarter: 'Q2 2026', prizePool: 75000, maxParticipants: 30, deadline: '2026-05-01', pitchDate: '2026-05-15' },
      { title: 'E-commerce Innovation Award', quarter: 'Q2 2026', prizePool: 50000, maxParticipants: 25, deadline: '2026-04-15', pitchDate: '2026-04-30' },
      { title: 'Social Impact Business Competition', quarter: 'Q3 2026', prizePool: 125000, maxParticipants: 40, deadline: '2026-07-01', pitchDate: '2026-07-15' }
    ];
    
    for (const comp of competitions) {
      await connection.execute(
        `INSERT INTO pitchCompetitions (title, description, quarter, prizePool, maxParticipants, applicationDeadline, pitchDate, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'open', NOW(), NOW())`,
        [
          comp.title,
          `Quarterly pitch competition for NuFounders members with $${comp.prizePool.toLocaleString()} in total prizes.`,
          comp.quarter,
          comp.prizePool,
          comp.maxParticipants,
          comp.deadline,
          comp.pitchDate
        ]
      );
    }
    console.log(`Seeded ${competitions.length} pitch competitions`);

    // Seed scholarships
    console.log('Seeding scholarships...');
    const scholarships = [
      { title: 'NuFounders Launch Grant', sponsor: 'NuFounders Foundation', amount: 10000, slots: 20, category: 'Business Launch' },
      { title: 'Tech Skills Scholarship', sponsor: 'Google.org', amount: 5000, slots: 50, category: 'Education' },
      { title: 'Single Mom Entrepreneur Fund', sponsor: 'Wells Fargo', amount: 15000, slots: 15, category: 'Business Launch' },
      { title: 'Marketing Mastery Grant', sponsor: 'Meta', amount: 3000, slots: 100, category: 'Education' },
      { title: 'E-commerce Accelerator', sponsor: 'Shopify', amount: 7500, slots: 25, category: 'Business Launch' },
      { title: 'Community Leader Award', sponsor: 'NuFounders Foundation', amount: 2500, slots: 10, category: 'Recognition' }
    ];
    
    for (const scholarship of scholarships) {
      const deadline = randomDate(new Date('2026-02-01'), new Date('2026-06-01'));
      await connection.execute(
        `INSERT INTO scholarships (title, description, sponsorName, amount, totalSlots, filledSlots, applicationDeadline, status, category, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?, NOW(), NOW())`,
        [
          scholarship.title,
          `${scholarship.title} - funding opportunity sponsored by ${scholarship.sponsor}.`,
          scholarship.sponsor,
          scholarship.amount,
          scholarship.slots,
          randomInt(0, Math.floor(scholarship.slots * 0.7)),
          deadline,
          scholarship.category
        ]
      );
    }
    console.log(`Seeded ${scholarships.length} scholarships`);

    // Seed events
    console.log('Seeding events...');
    const events = [
      { title: 'Weekly Founder Meetup', type: 'virtual', duration: 60, location: 'Zoom', maxAttendees: 50 },
      { title: 'Atlanta Networking Brunch', type: 'in_person', duration: 120, location: 'The Gathering Spot, Atlanta, GA', maxAttendees: 30 },
      { title: 'Pitch Practice Workshop', type: 'virtual', duration: 90, location: 'Google Meet', maxAttendees: 20 },
      { title: 'Digital Marketing Masterclass', type: 'virtual', duration: 120, location: 'Zoom', maxAttendees: 100 },
      { title: 'Houston Founder Dinner', type: 'in_person', duration: 180, location: 'Houston, TX', maxAttendees: 20 },
      { title: 'Q1 Pitch Competition Finals', type: 'hybrid', duration: 240, location: 'Atlanta Tech Village + Virtual', maxAttendees: 500 }
    ];
    
    for (const event of events) {
      const eventDate = randomDate(new Date('2026-01-25'), new Date('2026-04-01'));
      await connection.execute(
        `INSERT INTO events (title, description, type, eventDate, duration, location, maxAttendees, currentAttendees, status, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', NOW(), NOW())`,
        [
          event.title,
          `Join us for ${event.title} - a great opportunity to connect and learn.`,
          event.type,
          eventDate,
          event.duration,
          event.location,
          event.maxAttendees,
          randomInt(0, Math.floor(event.maxAttendees * 0.8))
        ]
      );
    }
    console.log(`Seeded ${events.length} events`);

    // Seed forum posts
    console.log('Seeding forum posts...');
    const forumCategories = ['Success Stories', 'Questions', 'Tips & Advice', 'Events', 'Introductions', 'Resources'];
    const postTitles = [
      'How I landed my first client in 30 days',
      'Best resources for learning e-commerce?',
      'Networking event in Atlanta - Jan 28th',
      'Tips for the pitch competition',
      'My journey from layoff to business owner',
      'Seeking accountability partner',
      'Free marketing tools I recommend',
      'How to price your services',
      'Building confidence as a new entrepreneur',
      'Success story: From $0 to $10K/month'
    ];
    
    for (let i = 0; i < 20; i++) {
      const authorId = randomChoice(userIds);
      await connection.execute(
        `INSERT INTO forumPosts (authorId, title, content, category, likes, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [
          authorId,
          randomChoice(postTitles),
          'This is a sample forum post content. In a real scenario, this would contain valuable insights and discussions from community members.',
          randomChoice(forumCategories),
          randomInt(5, 150),
          randomDate(new Date('2025-10-01'), new Date())
        ]
      );
    }
    console.log('Seeded 20 forum posts');

    // Seed peer groups
    console.log('Seeding peer groups...');
    const groups = [
      { name: 'Women in Tech', category: 'Technology' },
      { name: 'Atlanta Entrepreneurs', category: 'Local' },
      { name: 'E-commerce Builders', category: 'E-commerce' },
      { name: 'Marketing Mavens', category: 'Marketing' },
      { name: 'First-Time Founders', category: 'Business' },
      { name: 'Side Hustle to Full-Time', category: 'Business' }
    ];
    
    for (const group of groups) {
      await connection.execute(
        `INSERT INTO peerGroups (name, description, category, memberCount, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [
          group.name,
          `Connect with fellow ${group.name.toLowerCase()} members and share your journey.`,
          group.category,
          randomInt(50, 500)
        ]
      );
    }
    console.log(`Seeded ${groups.length} peer groups`);

    console.log('\n✅ Data seeding completed successfully!');
    console.log(`Summary:
    - ${courses.length} courses
    - ${userCount} user profiles
    - ${enrollmentCount} course enrollments
    - ${ideaCount} business ideas
    - ${competitions.length} pitch competitions
    - ${scholarships.length} scholarships
    - ${events.length} events
    - 20 forum posts
    - ${groups.length} peer groups
    `);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await connection.end();
  }
}

seedData();
