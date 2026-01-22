# NuFounders Platform - Development TODO

## 🚀 Current Sprint: Vercel Deployment & Cleanup

### Completed (January 2026)
- [x] Remove Manus AI dependencies from vite.config.ts
- [x] Remove vite-plugin-manus-runtime from package.json
- [x] Replace ManusDialog with generic LoginDialog component
- [x] Refactor OAuth to use Google/GitHub instead of Manus
- [x] Create Vercel serverless API structure (api/trpc, api/oauth)
- [x] Add vercel.json configuration
- [x] Update .env.example with new OAuth configuration
- [x] Add UI animation components (Framer Motion)
- [x] Update SETUP.md with Vercel deployment instructions

### In Progress
- [ ] Delete Manus debug files (`client/public/__manus__/`)
- [ ] Test local development with new OAuth flow
- [ ] Verify Vercel deployment works end-to-end

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
- [ ] Remove legacy Manus references from README.md
- [ ] Clean up unused OAuth types in `server/_core/types/`

### Testing
- [ ] Comprehensive unit test coverage (target: 80%)
- [ ] E2E testing with Playwright
- [ ] API integration tests for tRPC routes
- [ ] OAuth flow testing (Google/GitHub)

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

