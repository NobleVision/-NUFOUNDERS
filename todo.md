# NuFounders Platform - Development TODO

## 🚀 Current Sprint: Platform Enhancements (January 22, 2026)

### Completed (January 22, 2026) - Global AI Chatbot
- [x] Create `GlobalAIChatBox` component with floating action button
- [x] Add `ai.chat` tRPC endpoint with `invokeLLM` integration
- [x] Implement context-aware suggested prompts based on current page
- [x] Add chat history persistence with localStorage (last 50 messages)
- [x] Integrate Nova AI assistant into App.tsx for all pages
- [x] Add page-specific prompts for Dashboard, Courses, Business, Community, Events, Scholarships
- [x] Add minimize/maximize and clear chat functionality

### Completed (January 22, 2026) - Document Analyzer & Brainstormer Access
- [x] Add Document Analyzer tab to Business page
- [x] Add Business Brainstormer tab to Business page
- [x] Update Business page tabs layout (4 columns: Ideas, Brainstorm, Analyzer, Competitions)
- [x] Make course titles clickable to access CourseDetail page with TTS player

### Completed (January 22, 2026) - Feature Enhancements
- [x] Create video assets utility library (`client/src/lib/videoAssets.ts`)
- [x] Integrate video backgrounds into Courses, Business, Community pages
- [x] Update env.ts with OpenAI API key configuration
- [x] Create database schema for business documents analysis
- [x] Create database schema for real-time chat (rooms, messages, participants)
- [x] Create database schema for user milestones and badges
- [x] Implement Document Analysis AI service
- [x] Implement Personalized Recommendations AI service
- [x] Implement Business Idea Brainstormer AI service
- [x] Create DocumentAnalyzer frontend component
- [x] Create CommunityChat frontend component
- [x] Create EnhancedDashboardStats frontend component

### Completed (January 22, 2026) - API Integration
- [x] Connect DocumentAnalyzer to real `document.analyze` API (with fallback)
- [x] Connect BusinessBrainstormer to real `ai.brainstorm` API (with fallback)
- [x] Connect CommunityChat to real `chat.sendMessage` and `chat.poll` APIs
- [x] Connect TTS Player to real `voice.synthesize` API (with fallback demo mode)

### Completed (January 22, 2026) - WebSocket/Chat Infrastructure
- [x] Create WebSocket infrastructure module (`server/_core/websocket.ts`)
- [x] Implement in-memory chat store with room management
- [x] Add chat tRPC router with message, room, and polling endpoints
- [x] Implement polling-based real-time updates (3-second interval)
- [x] Add presence tracking and online user management

### Completed (January 22, 2026) - Backend & TTS
- [x] Add tRPC router endpoints for document analysis (`document.analyze`)
- [x] Add tRPC router endpoints for AI features (`ai.recommendations`, `ai.brainstorm`, `ai.chat`)
- [x] Add tRPC router endpoints for dashboard stats (`dashboard.stats`)
- [x] Add tRPC router endpoints for TTS (`voice.synthesize`, `voice.estimateCost`)
- [x] Create TTS service module (`server/_core/textToSpeech.ts`)
- [x] Create reusable TTS React hook (`hooks/useTextToSpeech.ts`)
- [x] Create TTS Player UI component (`components/ui/tts-player.tsx`)
- [x] Integrate TTS into CourseDetail page
- [x] Create Business Idea Brainstormer UI component

### Suggested Next Tasks - High Priority
- [ ] Add TTS to DocumentAnalyzer summary section
- [ ] Add TTS to success stories on Community page
- [ ] Implement file upload for document analysis (PDF parsing)
- [ ] Add resume/LinkedIn optimizer feature
- [ ] Certificate generation (PDF export) for course completion
- [ ] SME review workflow UI for AI-generated courses

### Suggested Next Tasks - Medium Priority
- [ ] Implement real WebSocket for production chat (replace polling)
- [ ] Add notification system for chat messages
- [ ] Add TTS to dashboard greeting/encouragement
- [ ] Employer portal (B2B) - talent search functionality
- [ ] Vector database (pgvector) for semantic user matching

---

## 🚀 Previous Sprint: Vercel Deployment & Cleanup

### Completed (January 21, 2026)
- [x] Remove Manus AI dependencies from vite.config.ts
- [x] Remove vite-plugin-manus-runtime from package.json
- [x] Replace ManusDialog with generic LoginDialog component
- [x] Refactor OAuth to use Google/GitHub instead of Manus
- [x] Create Vercel serverless API structure (api/trpc, api/oauth)
- [x] Add vercel.json configuration
- [x] Update .env.example with new OAuth configuration
- [x] Add UI animation components (Framer Motion)
- [x] Update SETUP.md with Vercel deployment instructions
- [x] Fix Node.js version compatibility (set to 20.x)
- [x] Remove explicit runtime from vercel.json causing version conflicts
- [x] Fix Edge Function module resolution (@shared alias → relative paths)
- [x] Fix PostgreSQL insert patterns (use .returning() instead of insertId)
- [x] Create provider-specific OAuth callback routes (/api/oauth/google/callback)
- [x] Fix redirect_uri_mismatch error for Google OAuth
- [x] Fix JWT secret mismatch between OAuth callback and SDK
- [x] Fix cookie reading in authenticateRequest (support both parsed and header)
- [x] Move videos to client/public/videos/ for Vite serving
- [x] Add videos to git tracking for Vercel deployment
- [x] Generate secure JWT_SECRET for production
- [x] Update README.md with Vercel deployment and OAuth setup

### In Progress
- [ ] Test production OAuth flow end-to-end
- [ ] Verify video carousel works on deployed site

### Blocked / Needs Attention
- [ ] Delete Manus debug files (`client/public/__manus__/`) - manual cleanup needed

---

## Phase 1: Database Schema
- [x] Create comprehensive database schema with all tables
- [x] Add user profiles with demographics and displacement tracking
- [x] Add courses, modules, and progress tracking tables
- [x] Add business opportunities and pitch competitions tables
- [x] Add community forums and networking tables
- [x] Add scholarships and employer access tables
- [x] Add survey and analytics tables
- [x] Push database migrations

## Phase 2: Backend Services
- [x] Implement AI course generation service
- [x] Implement business opportunity scoring engine
- [x] Implement vector similarity matching service
- [x] Implement multi-model AI routing
- [x] Create tRPC routers for all features

## Phase 3: Onboarding Wizard
- [x] Build multi-step wizard component
- [x] Demographics capture (age, location, displacement reason)
- [x] Skills and experience input with AI parsing
- [x] Unmet needs and goals survey
- [x] Profile completion flow

## Phase 4: Course Catalog & Learning
- [x] Course catalog page with filtering
- [x] Course detail pages with modules
- [x] Progress tracking and gamification
- [ ] Certificate generation (PDF export) - **Priority: High**
- [ ] SME review workflow UI - **Priority: High**

## Phase 5: Business Formation
- [x] Business idea generation based on courses
- [x] Scoring engine display
- [x] Business plan generation
- [x] Pitch competition submission
- [ ] Capital access information integration - **Priority: Medium**

## Phase 6: Community Hub
- [x] Virtual forums implementation
- [x] Peer group matching
- [x] Event scheduler
- [x] AI moderation system (sentiment analysis) - *Implemented in moderateContent()*

## Phase 7: Admin & Analytics
- [x] Admin dashboard
- [x] Role-based access control
- [x] Analytics dashboard
- [ ] Employer portal (B2B hooks) - **Priority: High**
- [ ] SME dashboard - **Priority: High**

## Phase 8: Mock Data
- [x] Generate 25 sample courses
- [x] Generate 50+ sample users with diverse profiles
- [x] Generate business opportunities
- [x] Generate community posts and events
- [x] Generate scholarship data

## Phase 9: Documentation
- [x] README.md with executive summary
- [x] Mermaid architecture diagrams
- [x] API documentation
- [x] User flow documentation
- [x] Vercel deployment guide

## Phase 10: Video Prompts
- [x] Generate 50 Google Veo 3.1 video prompts
- [x] Professional Black women in various scenarios
- [x] Business and entrepreneurship themes
- [x] Training and education themes

## Phase 11: Final Delivery
- [x] Final testing
- [x] Create checkpoint
- [x] Deliver to user

---

## 🔴 Critical: Feature Gaps from Requirements

*Based on review of docs/Initial Meeting 20260121.txt and docs/Grok Suggestions 20260121.txt*

### Must-Have (Core Business Requirements)
- [ ] **Employer Portal (B2B)** - Allow employers to view trainee progress, search talent by skills
- [ ] **SME Dashboard** - Interface for human Subject Matter Experts to review/approve AI-generated courses
- [ ] **Certificate Generation** - PDF certificates upon course completion (gamification element)
- [ ] **Capital Access Integration** - Connect pitch competition winners with debt/equity funding sources

### Should-Have (Competitive Differentiators)
- [ ] **Vector Database Integration** - pgvector for semantic search on user profiles and courses
- [ ] **Resume Upload & AI Parsing** - Automatically extract skills from uploaded resumes
- [ ] **Real-time Notifications** - In-app and email notifications for important events
- [ ] **Video Course Hosting** - Support for video content in courses (integration with storage)

### Nice-to-Have (Future Roadmap)
- [ ] **Neo4j Graph Integration** - Relationship mapping for skills → courses → businesses
- [ ] **HeyGen Avatar Integration** - AI-generated video instructors for courses
- [ ] **Survey Distribution** - Facebook ads integration for market validation surveys

---

## 🟡 Future Enhancements (Post-Demo)

### High Priority
- [ ] Mobile responsive optimizations
- [ ] Email notification system (SendGrid/Resend integration)
- [ ] Resume upload and AI parsing
- [ ] Real-time chat/messaging (WebSockets)
- [ ] Video course content hosting (S3/Cloudflare R2)

### Medium Priority
- [ ] Stripe payment integration (premium tiers)
- [ ] Multi-language support (Spanish, French)
- [ ] Advanced analytics with custom reports
- [ ] Employer talent search with advanced filters
- [ ] Mentor matching system (AI-powered)
- [ ] Facebook Ads API integration for surveys

### Low Priority
- [ ] Mobile app (React Native / Expo)
- [ ] White-label solutions for partners
- [ ] API marketplace for third-party integrations
- [ ] Franchise partnership portal
- [ ] International expansion features (Côte d'Ivoire via EXIM)

---

## 🔧 Technical Debt & Infrastructure

### Immediate
- [ ] Delete `client/public/__manus__/` debug folder
- [ ] Delete `dist/public/__manus__/` from build output
- [x] Remove legacy Manus references from README.md
- [ ] Clean up unused OAuth types in `server/_core/types/`
- [ ] Add error boundary for OAuth failures on frontend
- [ ] Add loading state during OAuth redirect

### Testing
- [ ] Comprehensive unit test coverage (target: 80%)
- [ ] E2E testing with Playwright
- [ ] API integration tests for tRPC routes
- [ ] OAuth flow testing (Google/GitHub)
- [ ] Session persistence testing across page reloads
- [ ] Cookie security testing (HttpOnly, Secure, SameSite)

### Performance & Security
- [ ] Performance optimization audit
- [ ] Security audit and penetration testing
- [ ] Accessibility (WCAG 2.1 AA) compliance
- [ ] Rate limiting on API routes
- [ ] Input validation hardening

### DevOps
- [ ] CI/CD pipeline setup (GitHub Actions)
- [ ] Staging environment configuration
- [ ] Database backup automation
- [ ] Error monitoring (Sentry integration)
- [ ] Analytics tracking (Vercel Analytics / Plausible)

---

## 📊 Data & AI Improvements

### Immediate Value
- [ ] Vector database (pgvector) for semantic user matching
- [ ] Course recommendation engine based on user profile vectors
- [ ] Job market data integration (real-time demand signals)

### Advanced
- [ ] Predictive analytics for user success likelihood
- [ ] A/B testing framework for course content
- [ ] AI-powered mentor matching
- [ ] Automated course content refresh based on market trends

---

## 📅 Suggested Milestones

### Week 1: Core Stability
- Complete Vercel deployment testing
- Implement certificate generation
- Build SME review workflow

### Week 2: B2B Features
- Employer portal MVP
- Talent search functionality
- Email notifications

### Week 3: AI Enhancements
- Vector search implementation
- Resume parsing
- Enhanced recommendation engine

### Week 4: Polish & Launch
- Performance optimization
- Security hardening
- Documentation finalization
- Production launch

---

## 🔐 Security Checklist (Pre-Production)

- [x] JWT_SECRET generated with cryptographically secure method
- [x] Cookies set with HttpOnly, Secure, SameSite=Lax
- [ ] Rate limiting on OAuth endpoints
- [ ] CSRF protection for state parameter validation
- [ ] Environment variables validated at startup
- [ ] Secrets not logged or exposed in error messages
- [ ] Database connection uses SSL in production

---

## 📝 Session Notes (January 21, 2026)

### Issues Resolved This Session

1. **Node.js Version Conflict**: Vercel was showing contradictory error messages (asking for 18.x, then 20.x, then 24.x). Root cause was explicit `runtime: "@vercel/node@3.0.0"` in vercel.json forcing an outdated builder.

2. **Edge Function Module Resolution**: `@shared/*` path aliases don't work in Vercel's edge bundler. Fixed by converting to relative imports.

3. **PostgreSQL Insert Pattern**: MySQL's `insertId` doesn't exist in PostgreSQL. Fixed by using Drizzle's `.returning()` method.

4. **OAuth redirect_uri_mismatch**: App was sending `/api/oauth/callback` but Google Console expected `/api/oauth/google/callback`. Created provider-specific routes.

5. **Session Not Persisting**: Two issues:
   - JWT secret fallback mismatch between OAuth callback and SDK
   - Cookie reading only checked `req.headers.cookie`, not `req.cookies`

6. **Videos Not Deploying**: Videos were in wrong directory (`public/videos/` instead of `client/public/videos/`) and not tracked in git.

### Architecture Decisions

- **Provider-specific OAuth routes**: `/api/oauth/google/callback` and `/api/oauth/github/callback` for cleaner separation
- **Shared ENV config**: All services use `server/_core/env.ts` for consistent environment variable access
- **Edge-compatible types**: Custom interfaces instead of Express types for Vercel Edge Functions

