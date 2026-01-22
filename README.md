# NuFounders Platform

## Executive Summary

**NuFounders** is an AI-native workforce transformation platform specifically designed to empower displaced Black women through comprehensive upskilling, entrepreneurship pathways, and community support. The platform addresses a critical market opportunity: Black women represent one of the fastest-growing segments of entrepreneurs in the United States, yet face disproportionate barriers to accessing capital, training, and professional networks.

The platform combines cutting-edge artificial intelligence with human expertise to deliver personalized learning experiences, data-driven business formation support, and meaningful community connections. With a target of $30 million in revenue for 2026, NuFounders is positioned to become the premier destination for workforce reentry and entrepreneurship among displaced Black women.

### Key Value Propositions

| Stakeholder | Value Delivered |
|-------------|-----------------|
| **Displaced Women** | Personalized AI-powered training, business formation support, funding access, and peer community |
| **Corporate Sponsors** | Impact investing opportunities, talent pipeline access, and ESG/DEI metric improvements |
| **Employers** | Pre-vetted, upskilled talent pool with verified competencies and soft skills |
| **Investors/VCs** | Proprietary data insights on workforce trends, market validation, and social impact metrics |

### Platform Metrics (Target Year 1)

| Metric | Target |
|--------|--------|
| Registered Users | 10,000+ |
| Course Completion Rate | 70%+ |
| Businesses Launched | 500+ |
| Funding Distributed | $2.5M+ |
| Corporate Sponsors | 25+ |
| Revenue | $30M |

---

## Table of Contents

1. [Platform Architecture](#platform-architecture)
2. [User Journey](#user-journey)
3. [Core Features](#core-features)
4. [AI Systems](#ai-systems)
5. [Database Architecture](#database-architecture)
6. [Role-Based Access Control](#role-based-access-control)
7. [Technical Stack](#technical-stack)
8. [API Documentation](#api-documentation)
9. [Deployment](#deployment)
10. [Future Roadmap](#future-roadmap)

---

## Platform Architecture

The NuFounders platform follows a modern, scalable architecture designed for rapid growth and AI-native operations.

```mermaid
flowchart TB
    subgraph Client["Frontend (React 19 + Tailwind 4)"]
        LP[Landing Page]
        OB[Onboarding Wizard]
        DB[User Dashboard]
        CC[Course Catalog]
        BF[Business Formation]
        CM[Community Hub]
        AD[Admin Dashboard]
    end
    
    subgraph API["Backend (Express + tRPC)"]
        AUTH[Authentication]
        TRPC[tRPC Router]
        AI[AI Services]
        NOTIFY[Notifications]
    end
    
    subgraph AI_Services["AI Engine"]
        LLM[LLM Integration]
        SCORE[Scoring Engine]
        MATCH[Peer Matching]
        GEN[Content Generation]
    end
    
    subgraph Data["Data Layer"]
        MYSQL[(MySQL/TiDB)]
        S3[(S3 Storage)]
        CACHE[(Redis Cache)]
    end
    
    subgraph External["External Services"]
        OAUTH[Manus OAuth]
        FORGE[Forge API]
        ANALYTICS[Analytics]
    end
    
    Client --> API
    API --> AI_Services
    API --> Data
    API --> External
    AI_Services --> LLM
```

---

## User Journey

The platform guides users through a comprehensive journey from displacement to entrepreneurship success.

```mermaid
journey
    title NuFounders User Journey
    section Onboarding
      Visit Landing Page: 5: User
      Create Account: 4: User
      Complete Profile Wizard: 4: User
      Take Skills Assessment: 3: User
    section Learning
      Browse Course Catalog: 5: User
      Enroll in Courses: 5: User
      Complete Modules: 4: User
      Earn Certificates: 5: User
    section Business Formation
      Generate Business Ideas: 5: User, AI
      Review Scoring Analysis: 4: User
      Create Business Plan: 4: User, AI
      Submit to Pitch Competition: 3: User
    section Growth
      Apply for Scholarships: 4: User
      Join Peer Groups: 5: User
      Attend Events: 5: User
      Launch Business: 5: User
```

---

## Core Features

### 1. Multi-Step Onboarding Wizard

The onboarding process captures comprehensive user data to enable personalized recommendations.

```mermaid
stateDiagram-v2
    [*] --> Welcome
    Welcome --> Demographics
    Demographics --> Experience
    Experience --> Skills
    Skills --> Goals
    Goals --> Needs
    Needs --> Review
    Review --> Complete
    Complete --> [*]
    
    state Demographics {
        [*] --> Age
        Age --> Location
        Location --> DisplacementReason
    }
    
    state Experience {
        [*] --> PreviousIndustry
        PreviousIndustry --> PreviousRole
        PreviousRole --> YearsExperience
    }
    
    state Skills {
        [*] --> SkillsAssessment
        SkillsAssessment --> ResumeUpload
        ResumeUpload --> AISkillExtraction
    }
```

**Data Captured:**
- Demographics (age, location, displacement reason)
- Professional experience (industry, role, years)
- Skills inventory (self-reported + AI-extracted from resume)
- Business interests and goals
- Unmet needs for market validation
- Financial parameters (capital available, income goals)

### 2. AI-Powered Course Catalog

The platform offers 25+ courses across key categories, with 80% AI-generated content and 20% SME review.

```mermaid
flowchart LR
    subgraph Categories
        MKT[Marketing]
        BIZ[Business]
        TECH[Technology]
        FIN[Finance]
        ECOM[E-commerce]
    end
    
    subgraph Levels
        BEG[Beginner]
        INT[Intermediate]
        ADV[Advanced]
    end
    
    subgraph Features
        PROG[Progress Tracking]
        QUIZ[Quizzes & Assessments]
        CERT[Certificates]
        BADGE[Gamification Badges]
    end
    
    Categories --> Levels
    Levels --> Features
```

**Course Categories:**
| Category | Courses | Avg. Hours | Completion Rate |
|----------|---------|------------|-----------------|
| Marketing | 6 | 7.2 | 72% |
| Business | 8 | 8.5 | 68% |
| Technology | 5 | 8.8 | 65% |
| Finance | 3 | 8.0 | 76% |
| E-commerce | 3 | 12.0 | 58% |

### 3. Business Formation Pathway

AI-powered business idea generation and scoring helps users identify viable business opportunities.

```mermaid
flowchart TB
    subgraph Input["User Input"]
        SKILLS[Completed Courses]
        PROFILE[Profile Data]
        PREFS[Business Preferences]
    end
    
    subgraph AI_Analysis["AI Analysis Engine"]
        MARKET[Market Demand Analysis]
        SKILL_MATCH[Skills Matching]
        CAPITAL[Capital Requirements]
        AUTO[Automation Potential]
        PROFIT[Profit Margin Analysis]
        COMP[Competition Analysis]
    end
    
    subgraph Output["Scoring Output"]
        COMPOSITE[Composite Score]
        RANK[Business Idea Ranking]
        PLAN[Business Plan Generation]
    end
    
    Input --> AI_Analysis
    AI_Analysis --> Output
    
    COMPOSITE --> PITCH[Pitch Competition]
    PLAN --> FUNDING[Funding Applications]
```

**Scoring Dimensions:**
| Dimension | Weight | Description |
|-----------|--------|-------------|
| Market Demand | 20% | Current and projected demand for the business vertical |
| Skills Match | 25% | Alignment between user skills and business requirements |
| Capital Requirements | 15% | Startup costs relative to user's available capital |
| Automation Potential | 15% | Opportunity for AI/tech-enabled efficiency |
| Profit Margin | 15% | Expected profitability based on industry benchmarks |
| Competition | 10% | Market saturation and competitive landscape |

### 4. Community Networking Hub

Peer matching uses vector similarity to connect users with compatible community members.

```mermaid
flowchart LR
    subgraph Community["Community Features"]
        FORUMS[Discussion Forums]
        GROUPS[Peer Groups]
        EVENTS[Events Calendar]
        DM[Direct Messaging]
    end
    
    subgraph Matching["AI Matching"]
        VECTOR[Vector Embeddings]
        SIM[Similarity Scoring]
        REC[Recommendations]
    end
    
    subgraph Moderation["AI Moderation"]
        SENT[Sentiment Analysis]
        FLAG[Content Flagging]
        REVIEW[Human Review Queue]
    end
    
    Community --> Matching
    Community --> Moderation
```

**Forum Categories:**
- Success Stories
- Questions & Answers
- Tips & Advice
- Events & Meetups
- Introductions
- Resources & Tools

### 5. Scholarship & Funding Management

Corporate sponsors can create and manage funding opportunities for platform users.

```mermaid
sequenceDiagram
    participant User
    participant Platform
    participant Sponsor
    participant Admin
    
    Sponsor->>Platform: Create Scholarship
    Platform->>Admin: Review & Approve
    Admin->>Platform: Publish Scholarship
    Platform->>User: Notify Eligible Users
    User->>Platform: Submit Application
    Platform->>Sponsor: Forward Application
    Sponsor->>Platform: Review & Decide
    Platform->>User: Notify Decision
    Platform->>Admin: Update Metrics
```

### 6. Pitch Competition System

Quarterly pitch competitions provide funding opportunities for promising business ideas.

```mermaid
gantt
    title Q1 2026 Pitch Competition Timeline
    dateFormat  YYYY-MM-DD
    section Application
    Applications Open     :a1, 2026-01-01, 30d
    Application Review    :a2, after a1, 14d
    section Selection
    Semifinalist Selection :s1, after a2, 7d
    Semifinalist Prep     :s2, after s1, 14d
    section Finals
    Finalist Selection    :f1, after s2, 7d
    Pitch Day            :milestone, f2, 2026-03-01, 1d
    section Awards
    Winner Announcement   :w1, after f2, 3d
    Funding Distribution  :w2, after w1, 14d
```

---

## AI Systems

### Multi-Model Architecture

NuFounders employs a multi-model AI architecture for different use cases:

```mermaid
flowchart TB
    subgraph Models["AI Model Routing"]
        GPT[OpenAI GPT-4]
        CLAUDE[Claude 3]
        GROK[Grok]
    end
    
    subgraph Use_Cases["Use Cases"]
        CONTENT[Course Content Generation]
        ETHICS[Ethical Review]
        JOBS[Job Market Analysis]
        MATCH[Peer Matching]
        SCORE[Business Scoring]
    end
    
    CONTENT --> GPT
    ETHICS --> CLAUDE
    JOBS --> GROK
    MATCH --> GPT
    SCORE --> GPT
```

| Model | Primary Use | Strengths |
|-------|-------------|-----------|
| GPT-4 | Content generation, scoring | Comprehensive knowledge, creative output |
| Claude 3 | Ethical checks, content review | Safety-focused, nuanced analysis |
| Grok | Job market data, trends | Real-time data, market insights |

### AI Agent Architecture

```mermaid
flowchart LR
    subgraph Agent["NuFounders AI Agent"]
        CONTEXT[Context Builder]
        PROMPT[Prompt Engineering]
        INVOKE[LLM Invocation]
        PARSE[Response Parser]
        VALIDATE[Output Validation]
    end
    
    USER[User Request] --> CONTEXT
    CONTEXT --> PROMPT
    PROMPT --> INVOKE
    INVOKE --> PARSE
    PARSE --> VALIDATE
    VALIDATE --> RESPONSE[Structured Response]
```

---

## Database Architecture

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ USER_PROFILES : has
    USERS ||--o{ COURSE_ENROLLMENTS : enrolls
    USERS ||--o{ BUSINESS_IDEAS : creates
    USERS ||--o{ FORUM_POSTS : writes
    USERS ||--o{ SCHOLARSHIP_APPLICATIONS : submits
    USERS ||--o{ EVENT_REGISTRATIONS : registers
    
    COURSES ||--o{ COURSE_ENROLLMENTS : has
    COURSES ||--o{ COURSE_MODULES : contains
    
    BUSINESS_IDEAS ||--o{ PITCH_APPLICATIONS : submits
    PITCH_COMPETITIONS ||--o{ PITCH_APPLICATIONS : receives
    
    SCHOLARSHIPS ||--o{ SCHOLARSHIP_APPLICATIONS : receives
    
    EVENTS ||--o{ EVENT_REGISTRATIONS : has
    
    PEER_GROUPS ||--o{ PEER_GROUP_MEMBERS : has
    USERS ||--o{ PEER_GROUP_MEMBERS : joins
    
    USERS {
        int id PK
        string openId UK
        string name
        string email
        enum role
        timestamp createdAt
    }
    
    USER_PROFILES {
        int id PK
        int userId FK
        int age
        string city
        string state
        string displacementReason
        json skills
        json interests
        json businessGoals
        json unmetNeeds
        int totalPoints
        int level
    }
    
    COURSES {
        int id PK
        string title
        string slug UK
        string category
        enum skillLevel
        int estimatedHours
        int totalModules
        int demandScore
    }
    
    BUSINESS_IDEAS {
        int id PK
        int userId FK
        string title
        string vertical
        int compositeScore
        int demandScore
        int skillsMatchScore
    }
```

### Key Tables

| Table | Purpose | Records (Demo) |
|-------|---------|----------------|
| users | User authentication and identity | 50 |
| userProfiles | Extended user data and preferences | 50 |
| courses | Course catalog | 25 |
| courseEnrollments | User course progress | 150+ |
| businessIdeas | AI-generated business opportunities | 60+ |
| pitchCompetitions | Quarterly competitions | 4 |
| scholarships | Funding opportunities | 6 |
| events | Community events | 6 |
| forumPosts | Community discussions | 20 |
| peerGroups | Networking groups | 6 |

---

## Role-Based Access Control

```mermaid
flowchart TB
    subgraph Roles["User Roles"]
        USER[User]
        SME[Subject Matter Expert]
        EMPLOYER[Employer]
        SPONSOR[Corporate Sponsor]
        ADMIN[Administrator]
    end
    
    subgraph Permissions["Permissions"]
        VIEW_COURSES[View Courses]
        ENROLL[Enroll in Courses]
        CREATE_CONTENT[Create Content]
        REVIEW_CONTENT[Review Content]
        VIEW_TALENT[View Talent Pool]
        MANAGE_SCHOLARSHIPS[Manage Scholarships]
        PLATFORM_ADMIN[Platform Administration]
        VIEW_ANALYTICS[View Analytics]
    end
    
    USER --> VIEW_COURSES
    USER --> ENROLL
    
    SME --> VIEW_COURSES
    SME --> CREATE_CONTENT
    SME --> REVIEW_CONTENT
    
    EMPLOYER --> VIEW_TALENT
    EMPLOYER --> VIEW_ANALYTICS
    
    SPONSOR --> MANAGE_SCHOLARSHIPS
    SPONSOR --> VIEW_ANALYTICS
    
    ADMIN --> PLATFORM_ADMIN
    ADMIN --> VIEW_ANALYTICS
```

| Role | Description | Key Capabilities |
|------|-------------|------------------|
| User | Platform members (displaced women) | Course access, business tools, community |
| SME | Subject matter experts | Content creation, course review |
| Employer | Corporate talent seekers | Talent pool access, progress tracking |
| Sponsor | Corporate funding partners | Scholarship management, impact metrics |
| Admin | Platform administrators | Full platform access, analytics |

---

## Technical Stack

### Frontend
- **React 19** - UI framework with concurrent features
- **Tailwind CSS 4** - Utility-first styling
- **tRPC** - End-to-end type-safe APIs
- **Wouter** - Lightweight routing
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **shadcn/ui** - Component library

### Backend
- **Express 4** - HTTP server
- **tRPC 11** - Type-safe API layer
- **Drizzle ORM** - Database toolkit
- **MySQL/TiDB** - Relational database
- **S3** - File storage
- **Manus OAuth** - Authentication

### AI/ML
- **OpenAI GPT-4** - Content generation
- **Claude 3** - Ethical review
- **Grok** - Market analysis
- **Vector embeddings** - Peer matching

### Infrastructure
- **Manus Platform** - Hosting and deployment
- **GitHub** - Version control
- **Vitest** - Testing framework

---

## API Documentation

### Authentication Endpoints

```typescript
// Get current user
trpc.auth.me.useQuery()

// Logout
trpc.auth.logout.useMutation()
```

### Course Endpoints

```typescript
// List all courses
trpc.course.list.useQuery({ category?, skillLevel?, search? })

// Get course details
trpc.course.get.useQuery({ id })

// Enroll in course
trpc.course.enroll.useMutation({ courseId })

// Update progress
trpc.course.updateProgress.useMutation({ enrollmentId, progress })
```

### Business Endpoints

```typescript
// Generate business ideas
trpc.business.generateIdeas.useMutation({ preferences })

// Get user's business ideas
trpc.business.getIdeas.useQuery()

// Generate business plan
trpc.business.generatePlan.useMutation({ ideaId })
```

### Community Endpoints

```typescript
// List forum posts
trpc.community.listPosts.useQuery({ category? })

// Create post
trpc.community.createPost.useMutation({ title, content, category })

// List peer groups
trpc.community.listGroups.useQuery()

// Join group
trpc.community.joinGroup.useMutation({ groupId })
```

---

## Deployment

### Prerequisites
- Node.js 22+
- pnpm 10+
- MySQL/TiDB database
- S3-compatible storage

### Local Development

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Seed demo data (optional)
node scripts/seed-data.mjs

# Start development server
pnpm dev
```

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| DATABASE_URL | MySQL connection string |
| JWT_SECRET | Session signing secret |
| VITE_APP_ID | Manus OAuth app ID |
| OAUTH_SERVER_URL | OAuth backend URL |
| BUILT_IN_FORGE_API_URL | AI services URL |
| BUILT_IN_FORGE_API_KEY | AI services key |

---

## Future Roadmap

### Phase 2 (Q2 2026)
- [ ] Mobile app (React Native)
- [ ] Advanced AI tutoring
- [ ] Live video courses
- [ ] Mentorship matching
- [ ] Payment processing (Stripe)

### Phase 3 (Q3 2026)
- [ ] Franchise partnership portal
- [ ] B2B employer dashboard
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] SMS notifications

### Phase 4 (Q4 2026)
- [ ] AI-powered business coaching
- [ ] Investment marketplace
- [ ] Alumni network
- [ ] White-label solutions
- [ ] International expansion

---

## Support

For technical support or business inquiries:
- **Email**: support@nufounders.com
- **Website**: https://nufounders.com

---

## License

Copyright © 2026 NuFounders. All rights reserved.

---

*Built with ❤️ for displaced Black women entrepreneurs*
