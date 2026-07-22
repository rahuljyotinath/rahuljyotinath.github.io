# FILE 5A

# SYSTEM ARCHITECTURE & TECHNOLOGY STACK

Version: 2.0

Purpose

Define a scalable, secure and maintainable technical architecture that supports Skyline's long-term business goals.

The system should support:

- High-performance public website
- Rich engineering knowledge base
- Case study library
- Lead generation
- Client portal (future)
- Building Health Dashboard (future)
- AI-assisted tools (future)

The architecture should favour modularity and extensibility over unnecessary complexity.

---

# Architecture Principles

1. Performance First
2. Security by Design
3. Content as Structured Data
4. API-First Where Practical
5. Progressive Enhancement
6. Accessibility by Default
7. SEO-Friendly Rendering
8. Modular Components
9. Observability
10. Easy to Maintain

---

##############################################################
HIGH-LEVEL ARCHITECTURE
##############################################################

                    Browser
                        │
                CDN + Edge Cache
                        │
              React Frontend (SSR)
                        │
          API Layer / Application Server
                        │
        ┌───────────────┼───────────────┐
        │               │               │
      Database      Search Index     Media Storage
        │               │               │
        └───────────────┼───────────────┘
                        │
                 Admin CMS Panel

Future

                        │
              Client Portal
                        │
           Building Passport System
                        │
             AI Recommendation Engine

---

##############################################################
FRONTEND
##############################################################

Recommended

React

Framework

Next.js

Reason

Excellent SEO

Server-side rendering

Static generation where appropriate

Image optimisation

Fast routing

Good ecosystem

Recommended Styling

Tailwind CSS

Component Layer

shadcn/ui (customised)

State Management

TanStack Query

Zustand (lightweight state)

Form Handling

React Hook Form

Validation

Zod

Icons

Lucide

Charts

Recharts

Animation

Framer Motion

Use motion sparingly.

---

##############################################################
BACKEND
##############################################################

Preferred

Laravel

Reason

Excellent authentication

Strong ecosystem

Queues

Email

Media management

Mature security

Alternative

Node.js (NestJS)

if an all-TypeScript stack is preferred.

Regardless of framework

Expose clean REST APIs.

Consider GraphQL only if future requirements justify the added complexity.

---

##############################################################
DATABASE
##############################################################

Preferred

PostgreSQL

Reason

Excellent reliability

Powerful indexing

JSON support

Full-text search capabilities

Strong long-term scalability

Core Entities

Articles

Projects

Problems

Engineering Solutions

Industries

Downloads

Engineers

Users

Enquiries

Reports (future)

Buildings (future)

Building Health Records (future)

Relationships should be normalised where appropriate.

---

##############################################################
CMS
##############################################################

Requirement

Non-technical staff must manage content.

Options

Laravel Nova

Filament

Statamic

Headless CMS (future if editorial team grows)

Capabilities

Drafts

Publishing workflow

Revision history

Media management

SEO fields

Scheduling

Content relationships

Role-based permissions

---

##############################################################
MEDIA MANAGEMENT
##############################################################

Store

Images

Videos

PDFs

CAD previews (future)

Inspection reports (future)

Requirements

Automatic optimisation

WebP/AVIF conversion

Responsive image generation

Lazy loading

Metadata

Alt text

Captions

Photographer/project attribution

---

##############################################################
SEARCH
##############################################################

Current

PostgreSQL full-text search

Future

Meilisearch

or

Typesense

Capabilities

Autocomplete

Typo tolerance

Natural language

Synonyms

Grouped results

Problem → Solution → Article → Case Study

---

##############################################################
AUTHENTICATION
##############################################################

Public users

No account required.

Registered users (future)

Saved downloads

Bookmarks

Building Passport

Inspection history

Authentication

Email OTP or password

Optional social login later if justified.

---

##############################################################
FILE STORAGE
##############################################################

Use object storage.

Recommended

Amazon S3 compatible

Cloudflare R2

Backblaze B2

Benefits

Scalable

Versioning

CDN integration

Lower server load

---

##############################################################
EMAIL
##############################################################

Transactional

Inspection confirmations

Download links

Contact acknowledgements

Future

Maintenance reminders

Inspection reminders

Newsletter

Provider

Resend

Amazon SES

Postmark

Choose one based on deliverability and operational needs.

---

##############################################################
CONTACT SYSTEM
##############################################################

Every enquiry should create

Lead

Activity log

Internal notification

CRM-ready record

Support

Photo uploads

Location

Problem category

Preferred contact time

Spam protection

Rate limiting

CAPTCHA alternatives where appropriate.

---

##############################################################
SEO INFRASTRUCTURE
##############################################################

Automatic

Sitemap

Robots.txt

Canonical URLs

Structured Data

Open Graph

Twitter Cards

Breadcrumbs

Image metadata

Meta generation

Pagination support

Redirect management

404 logging

---

##############################################################
PERFORMANCE
##############################################################

Targets

Lighthouse

95+

Core Web Vitals

Pass

Optimisations

Image compression

Code splitting

Caching

Route prefetching

Static generation

Critical CSS

Lazy hydration where appropriate

---

##############################################################
SECURITY
##############################################################

HTTPS everywhere

Content Security Policy

Rate limiting

Input validation

Prepared statements

CSRF protection

XSS protection

Secure cookies

Audit logging (admin)

Regular dependency updates

Principle of least privilege

---

##############################################################
BACKUPS
##############################################################

Database

Daily

Media

Versioned

Retention

Configurable

Test restoration periodically.

Backups are only useful if they can be restored.

---

##############################################################
MONITORING
##############################################################

Application errors

Performance

Uptime

Broken links

Search failures

Form failures

Analytics

Recommended

Sentry

UptimeRobot

Plausible Analytics (privacy-friendly)

or Google Analytics if required

---

##############################################################
ANALYTICS
##############################################################

Track

Article views

Downloads

Case study engagement

Search queries

Inspection requests

CTA clicks

Symptom Finder usage

Scroll depth

Avoid excessive tracking.

Respect user privacy and applicable regulations.

---

##############################################################
INTERNATIONALISATION
##############################################################

Initially

English

Future

Hindi

Assamese

Other regional languages

Structure URLs to support localisation later.

---

##############################################################
API DESIGN
##############################################################

Expose endpoints for

Articles

Projects

Problems

Solutions

Downloads

Search

Future

Building Passport

Inspection reports

Health Dashboard

Version APIs.

Document them.

Avoid breaking changes.

---

##############################################################
FUTURE MODULES
##############################################################

Client Portal

Engineer Portal

Building Passport

Inspection Scheduler

Maintenance Calendar

AI Symptom Finder

Building Health Dashboard

Asset Register

Warranty Tracker

Digital Report Viewer

Design today's architecture so these can be added without major refactoring.

---

##############################################################
DEPLOYMENT
##############################################################

Environment

Development

Staging

Production

CI/CD

GitHub Actions

Automated testing

Preview deployments

Rollback capability

Infrastructure as Code preferred for larger deployments.

---

##############################################################
SUCCESS CRITERIA
##############################################################

The platform should:

Load quickly.

Be easy to maintain.

Scale as content grows.

Support future products.

Provide a stable foundation for Skyline's long-term digital strategy.

Technology should enable the business—not constrain it.

# FILE 5B

# SEO, GEO (Generative Engine Optimization) & CONTENT DISCOVERABILITY

Version: 2.0

Purpose

Design a search strategy that enables Skyline to be discovered through:

- Google Search
- Bing
- AI assistants (ChatGPT, Gemini, Claude, Perplexity, Copilot, etc.)
- Voice search
- Image search
- Local search
- Technical reference searches

The objective is not simply to rank for keywords.

The objective is to become a trusted source that search engines and AI systems confidently reference.

---

# Search Philosophy

People do not search for products.

They search for problems.

Examples

❌ PU Injection

✔ Water leaking through floor

❌ Carbon Fibre Wrapping

✔ How to strengthen an old concrete beam

❌ Waterproofing Contractor

✔ Why is my basement leaking during monsoon?

The website should answer the questions people naturally ask.

---

##############################################################
CONTENT PYRAMID
##############################################################

Level 1 — Quick Answers

Purpose

Capture featured snippets and AI summaries.

Length

400–800 words

Examples

What is Efflorescence?

What Causes Concrete Spalling?

Can Roof Leakage Be Repaired Without Removing Tiles?

---

Level 2 — Complete Guides

Purpose

Primary SEO assets.

Length

2,500–5,000 words

Examples

Complete Guide to Basement Waterproofing

Complete Guide to Structural Crack Repair

Understanding Hydrostatic Pressure

---

Level 3 — Engineering References

Purpose

Authority.

Length

5,000–10,000 words

Examples

NDT Method Comparison

Indian Standards for Concrete Repair

Injection Grouting Material Guide

---

##############################################################
TOPICAL CLUSTERS
##############################################################

Instead of isolated articles, build interconnected knowledge clusters.

Example

Water Leakage

↓

Floor Leakage

↓

Hydrostatic Pressure

↓

PU Injection

↓

Case Studies

↓

Downloads

↓

Inspection Booking

Every cluster should include:

Problem Pages

Knowledge Articles

Engineering Solutions

Case Studies

Industry Pages

FAQs

Downloads

---

##############################################################
URL STRUCTURE
##############################################################

Examples

/problems/floor-leakage

/problems/beam-cracks

/solutions/polyurethane-injection

/knowledge/concrete-carbonation

/case-studies/basement-water-ingress

/industries/apartment-buildings

/downloads/building-health-checklist

URLs should be:

Readable

Short

Permanent

Lowercase

Hyphenated

Avoid IDs and unnecessary parameters.

---

##############################################################
STRUCTURED DATA
##############################################################

Implement schema where relevant.

Article

FAQ

Breadcrumb

Organization

Local Business

Person (Engineer profiles)

Video

Image

HowTo (only when appropriate)

Avoid marking marketing content as HowTo if it doesn't genuinely provide instructions.

Validate with Google's Rich Results Test.

---

##############################################################
ON-PAGE SEO
##############################################################

Every page requires:

Unique title

Unique meta description

One H1

Logical H2/H3 hierarchy

Descriptive URLs

Optimised images

Internal links

External references where appropriate

Readable language

Table of contents for long articles

Estimated reading time

Updated date

Author / reviewer

---

##############################################################
EEAT STRATEGY
##############################################################

Demonstrate

Experience

Expertise

Authoritativeness

Trustworthiness

Methods

Engineer biographies

Technical reviewers

Real project photography

Case studies

Publication dates

Revision history

Transparent contact details

Relevant certifications and memberships

Citations to recognised standards where appropriate

---

##############################################################
LOCAL SEO
##############################################################

Create city pages only when there is genuine value.

Examples

Structural Rehabilitation in Guwahati

Basement Waterproofing in Shillong

Concrete Repair in Siliguri

Each page must include:

Relevant projects

Local considerations

Climate factors

Common regional building issues

Avoid doorway pages with duplicated content.

---

##############################################################
IMAGE SEO
##############################################################

Every image should include:

Descriptive filename

Alt text

Caption

Structured metadata

Example

Incorrect

IMG_4821.jpg

Correct

basement-water-ingress-before-pu-injection-guwahati.jpg

Real project photography is preferred over stock images.

---

##############################################################
VIDEO SEO
##############################################################

Recommended content

Inspection walkthroughs

NDT demonstrations

Repair explanations

Case studies

Engineer interviews

Monsoon preparedness

Requirements

Transcript

Captions

Thumbnail

Structured metadata

Meaningful title and description

---

##############################################################
INTERNAL LINKING
##############################################################

Every page should link to:

Related Problem Pages

Engineering Solutions

Knowledge Articles

Case Studies

Industry Pages

Downloads

FAQs

Inspection page

Never leave a page isolated.

---

##############################################################
CONTENT GOVERNANCE
##############################################################

Review schedule

High-value guides

Every 6–12 months

News or regulations

As required

Case studies

When new information becomes available

Display:

Published date

Last updated date

Reviewer (where applicable)

---

##############################################################
AI / GEO STRATEGY
##############################################################

Optimise for answer engines.

Write clear answers to:

What is it?

Why does it happen?

How is it investigated?

What are the possible solutions?

When should professional assessment be considered?

Support answers with:

Structured headings

Bullet lists

Comparison tables

Definitions

References

Avoid keyword stuffing.

Prioritise clarity and factual accuracy.

---

##############################################################
FEATURED SNIPPETS
##############################################################

Design content specifically for snippet opportunities.

Examples

Definitions

Step summaries

Comparison tables

Pros & Cons

Checklists

Common causes

FAQs

Use concise introductory answers before expanding into detail.

---

##############################################################
VOICE SEARCH
##############################################################

Optimise conversational questions.

Examples

Why is water coming through my floor?

How do I know if a crack is structural?

Can basement leakage be repaired from inside?

Natural language improves both voice search and AI discoverability.

---

##############################################################
MEASUREMENT
##############################################################

Track

Organic traffic

Ranking by topic cluster

Featured snippets

AI referral traffic (where measurable)

Internal search queries

Downloads

Inspection requests

Content engagement

Update strategy based on evidence, not assumptions.

---

##############################################################
CONTENT ROADMAP
##############################################################

Phase 1

20 Problem Pages

15 Engineering Solution Pages

20 Knowledge Articles

10 Case Studies

5 Industry Pages

---

Phase 2

50 Problem Pages

30 Solution Pages

75 Knowledge Articles

30 Case Studies

15 Industry Pages

---

Phase 3

100 Problem Pages

50 Solution Pages

250+ Knowledge Articles

100+ Case Studies

25+ Industry Pages

Interactive tools

Building Passport integration

---

##############################################################
SUCCESS CRITERIA
##############################################################

Skyline should become known not only for engineering services, but for engineering knowledge.

The website should answer more building rehabilitation questions than any regional competitor.

When someone asks an AI assistant or searches online about building deterioration, waterproofing or structural rehabilitation, Skyline should increasingly appear as a credible source of information.

The long-term objective is sustainable authority built through accurate, experience-based content—not short-term ranking tactics.

# FILE 5C

# CMS & ADMIN PANEL SPECIFICATION

Version: 2.0

Purpose

Provide Skyline with a secure, structured and efficient content management platform that allows engineers, administrators and marketing staff to manage the entire digital ecosystem without developer assistance for routine tasks.

The CMS should prioritise accuracy, consistency and traceability over unrestricted editing.

---

# Design Philosophy

The admin panel should feel like professional engineering software.

Not like a generic blog editor.

Content should be treated as structured engineering information.

Relationships between content types should be visible and easy to manage.

---

##############################################################
ADMIN DASHBOARD
##############################################################

Purpose

Provide an operational overview.

Widgets

Inspection Requests

Unread Messages

Content Pending Review

Recently Published

Broken Links

Upcoming Content Reviews

Downloads

Search Trends

Recent Case Studies

System Health

Quick Actions

Create Article

Add Project

Upload Media

Create Download

Publish FAQ

Book Inspection (manual)

Recent Activity Feed

---

##############################################################
CONTENT MANAGEMENT
##############################################################

Supported Content Types

Knowledge Articles

Problem Pages

Engineering Solutions

Case Studies

Industry Pages

Downloads

FAQs

Engineer Profiles

Company Pages

Policies

Homepage Sections

Reusable CTA Blocks

Each content type has

Draft

Review

Published

Archived

Scheduled

Revision history

---

##############################################################
RICH TEXT EDITOR
##############################################################

Requirements

Markdown support (optional)

Visual editor

Table support

Code blocks (for technical references)

Mathematical notation (future)

Responsive tables

Image embedding

Video embedding

Diagram placeholders

Callout boxes

Comparison tables

Automatic Table of Contents

Anchor links

Internal link suggestions

Word count

Reading time

SEO preview

Autosave

---

##############################################################
MEDIA LIBRARY
##############################################################

Supported Files

Images

Videos

PDF

CAD previews (image/PDF)

ZIP downloads

Future

3D models

Inspection reports

Each asset stores

Title

Description

Alt text

Tags

Categories

Photographer

Project

Usage history

Upload date

Automatic optimisation

Duplicate detection

---

##############################################################
CASE STUDY MANAGER
##############################################################

Fields

Project Title

Slug

Client Type

Industry

Location

Building Type

Problem Category

Investigation Methods

Engineering Solutions

Materials

Project Gallery

Videos

Downloads

Timeline

Lessons Learned

SEO fields

Related Articles

Related Problem Pages

Related Downloads

Publication workflow

---

##############################################################
PROBLEM PAGE MANAGER
##############################################################

Fields

Problem Name

Symptoms

Possible Causes

Engineering Investigation

Solutions

FAQs

Case Studies

Downloads

Related Articles

Severity

Priority

SEO

Content relationships update automatically where possible.

---

##############################################################
ENGINEERING SOLUTION MANAGER
##############################################################

Fields

Solution Name

Applications

Advantages

Limitations

Investigation Requirements

Materials

Execution Process

Related Problems

Related Projects

FAQs

Downloads

SEO

Comparison tables

---

##############################################################
KNOWLEDGE CENTRE MANAGER
##############################################################

Organise by

Category

Topic Cluster

Difficulty

Reading Time

Author

Reviewer

Published Date

Updated Date

References

Related Content

Downloads

Featured status

---

##############################################################
DOWNLOAD CENTRE
##############################################################

Manage

PDFs

Checklists

Maintenance Guides

Technical Notes

Inspection Forms

Manuals

Fields

Version

Language

Category

File Size

Access Type

Public

Registration Required

Internal

Download statistics

---

##############################################################
ENGINEER DIRECTORY
##############################################################

Each engineer profile

Name

Designation

Qualifications

Areas of Expertise

Professional Memberships

Years of Experience

Languages

Photograph

Biography

Projects

Articles Reviewed

Articles Written

Availability (future)

This strengthens transparency and trust.

---

##############################################################
LEAD MANAGEMENT
##############################################################

Every enquiry creates

Lead Record

Fields

Source

Problem

Location

Building Type

Urgency

Assigned Engineer

Status

Notes

Attachments

Communication Log

Stages

New

Contacted

Inspection Scheduled

Inspection Completed

Proposal Sent

Won

Lost

Closed

Search

Filters

Export

---

##############################################################
SEARCH MANAGEMENT
##############################################################

Admin tools

Rebuild search index

Manage synonyms

Popular searches

Failed searches

Suggested content

Content gaps

Use search analytics to guide future content creation.

---

##############################################################
SEO MANAGER
##############################################################

Fields

Meta Title

Meta Description

Canonical URL

Structured Data Preview

Open Graph Image

Social Preview

Robots Settings

Redirects

Indexing Status

Sitemap inclusion

SEO score (guidance only, not absolute)

---

##############################################################
WORKFLOW & APPROVALS
##############################################################

Roles

Administrator

Engineering Reviewer

Content Editor

Marketing

Media Manager

Viewer

Workflow

Draft

↓

Engineering Review

↓

Editorial Review

↓

SEO Check

↓

Approval

↓

Scheduled / Publish

Critical technical content should require engineering review before publication.

---

##############################################################
AUDIT LOG
##############################################################

Track

Who edited content

What changed

When

Rollback history

Login activity

Permission changes

Media deletions

This is important for accountability and recovery.

---

##############################################################
ANALYTICS DASHBOARD
##############################################################

Track

Most viewed articles

Most viewed case studies

Popular searches

Top downloads

Conversion rate

Inspection requests

Traffic by topic

Content freshness

Returning visitors

Show trends over time.

---

##############################################################
NOTIFICATIONS
##############################################################

Examples

Content awaiting review

Failed uploads

Broken links detected

Scheduled content published

Inspection assigned

System backup completed

Notifications should be useful, not noisy.

---

##############################################################
ROLE-BASED PERMISSIONS
##############################################################

Example

Administrator

Everything

Engineer

Technical review

Projects

Case studies

Reports

Editor

Articles

FAQs

Downloads

Marketing

Homepage

SEO

Media

Viewer

Read-only

Permissions should follow the principle of least privilege.

---

##############################################################
SYSTEM SETTINGS
##############################################################

Manage

Navigation

Footer

Global CTAs

Emergency Contact

Office Locations

Social Links

Email Templates

Site Settings

Analytics IDs

API Keys

Legal Pages

Feature Flags

---

##############################################################
FUTURE MODULES
##############################################################

Building Passport Manager

Inspection Report Builder

Maintenance Scheduler

Warranty Manager

Engineer Calendar

Quotation System

Asset Register

Digital Signature

Client Portal Administration

AI Content Assistant (review only, never auto-publish technical content)

Design extension points now so future modules integrate cleanly.

---

##############################################################
SUCCESS CRITERIA
##############################################################

The CMS should enable Skyline to publish, organise and maintain a large engineering knowledge platform efficiently.

Routine content updates should not require developer involvement.

Technical accuracy should be protected through structured workflows and engineering review.

The admin experience should support the company's evolution from a service provider into a long-term publisher of engineering knowledge.

# FILE 5D

# DATABASE SCHEMA & CONTENT MODEL

Version: 2.0

Purpose

Define the core entities, relationships and lifecycle rules that power the Skyline digital platform.

The database should model engineering knowledge—not just web pages.

Every piece of content should be reusable, searchable and interconnected.

---

# Data Modelling Principles

1. Store structured information whenever practical.
2. Avoid duplicating content.
3. Use relationships instead of hard-coded links.
4. Keep presentation separate from data.
5. Support future expansion without schema redesign.
6. Preserve historical revisions where appropriate.

---

##############################################################
CORE ENTITY OVERVIEW
##############################################################

Primary Content

• Problem
• Engineering Solution
• Knowledge Article
• Case Study
• Industry
• Download
• FAQ
• Engineer
• Project Gallery
• Video

Operational

• Lead
• Contact Request
• User
• Role
• Media
• Tag
• Category

Future

• Building
• Building Passport
• Inspection
• Health Assessment
• Maintenance Task
• Warranty
• Client Organisation

---

##############################################################
ENTITY: PROBLEM
##############################################################

Purpose

Represents a customer-facing symptom.

Fields

ID

Slug

Title

Short Summary

Detailed Description

Typical Symptoms

Possible Causes

Risk Level

Recommended Investigation

Featured Image

SEO Title

Meta Description

Status

Published Date

Updated Date

Relationships

Many → Engineering Solutions

Many → Knowledge Articles

Many → Case Studies

Many → FAQs

Many → Downloads

Many → Industries

Many → Tags

---

##############################################################
ENTITY: ENGINEERING SOLUTION
##############################################################

Fields

ID

Slug

Name

Summary

Applications

Advantages

Limitations

Execution Method

Typical Duration

Maintenance Notes

Hero Image

SEO Fields

Relationships

Many → Problems

Many → Articles

Many → Case Studies

Many → Downloads

Many → Materials

---

##############################################################
ENTITY: KNOWLEDGE ARTICLE
##############################################################

Fields

ID

Slug

Title

Excerpt

Body

Category

Difficulty Level

Reading Time

Author

Reviewer

Published Date

Last Updated

References

Featured Image

SEO

Relationships

Many → Problems

Many → Solutions

Many → FAQs

Many → Downloads

Many → Tags

Many → Case Studies

---

##############################################################
ENTITY: CASE STUDY
##############################################################

Fields

ID

Slug

Title

Summary

Project Type

Industry

Building Type

City

Region

Construction Year (optional)

Problem Summary

Investigation Summary

Engineering Decision

Execution Summary

Outcome

Lessons Learned

Gallery

Video

Downloads

SEO

Relationships

Many → Problems

Many → Solutions

Many → Articles

Many → Engineers

---

##############################################################
ENTITY: INDUSTRY
##############################################################

Fields

ID

Slug

Name

Overview

Typical Problems

Operational Constraints

Maintenance Advice

SEO

Relationships

Many → Problems

Many → Solutions

Many → Articles

Many → Case Studies

Many → Downloads

---

##############################################################
ENTITY: DOWNLOAD
##############################################################

Fields

ID

Title

Version

Category

Language

Description

File Type

File Size

Public / Restricted

Published Date

Relationships

Many → Articles

Many → Problems

Many → Solutions

Many → Industries

---

##############################################################
ENTITY: FAQ
##############################################################

Fields

ID

Question

Answer

Category

Priority

Published

Relationships

Many → Problems

Many → Articles

Many → Solutions

Many → Industries

---

##############################################################
ENTITY: ENGINEER
##############################################################

Fields

ID

Name

Designation

Biography

Qualifications

Specialisations

Experience

Languages

Profile Photo

Professional Memberships

Relationships

Many → Articles (Reviewer)

Many → Articles (Author)

Many → Case Studies

Many → Projects

---

##############################################################
ENTITY: MEDIA
##############################################################

Fields

ID

Filename

Title

Description

Alt Text

Caption

Media Type

Dimensions

File Size

Photographer

Upload Date

Copyright Status

Usage Count

Relationships

Attachable to any content entity.

---

##############################################################
ENTITY: TAG
##############################################################

Purpose

Cross-topic discovery.

Examples

Hydrostatic Pressure

Carbonation

Waterproofing

Concrete Repair

Corrosion

NDT

Tags should remain controlled vocabulary.

Avoid uncontrolled tag growth.

---

##############################################################
ENTITY: CATEGORY
##############################################################

Examples

Knowledge

Problem

Solution

Industry

Download

Case Study

Supports navigation and reporting.

---

##############################################################
ENTITY: LEAD
##############################################################

Fields

ID

Name

Phone

Email

Building Type

Problem

Location

Urgency

Source

Assigned Engineer

Status

Notes

Attachments

Created Date

Updated Date

Future Relationships

Inspection

Proposal

Building Passport

---

##############################################################
ENTITY: USER
##############################################################

Fields

ID

Name

Email

Role

Password / Authentication Method

Last Login

Status

Permissions

Future

Organisation

Building Portfolio

Bookmarks

Saved Downloads

---

##############################################################
FUTURE ENTITY: BUILDING
##############################################################

Purpose

Foundation of the Building Passport.

Fields

Building Name

Address

Coordinates

Construction Year

Floors

Structural System

Owner

Usage Type

Climate Zone

Inspection History

Relationships

Many → Inspections

Many → Reports

Many → Repairs

Many → Health Assessments

---

##############################################################
FUTURE ENTITY: BUILDING PASSPORT
##############################################################

Fields

Passport ID

Building

Current Health Score

Structural Status

Waterproofing Status

Concrete Status

Maintenance Status

Documents

Timeline

Recommendations

Review Date

Relationships

One → Building

Many → Inspections

Many → Reports

Many → Maintenance Tasks

---

##############################################################
RELATIONSHIP MODEL
##############################################################

Example

Problem

↓

Related Engineering Solutions

↓

Related Knowledge Articles

↓

Related Case Studies

↓

Related Downloads

↓

Relevant Industry Pages

↓

Relevant FAQs

This relationship network powers

Internal linking

Search

Recommendations

Related content

Future AI features

---

##############################################################
CONTENT STATUS
##############################################################

Lifecycle

Draft

↓

Engineering Review

↓

Editorial Review

↓

Approved

↓

Published

↓

Archived

Support scheduled publishing.

Retain revision history.

---

##############################################################
SEARCH INDEX
##############################################################

Index

Title

Summary

Body

FAQs

Captions

Alt text

Tags

Categories

Engineer names

Locations

Support weighted ranking.

Example

Problem title has higher weight than body text.

---

##############################################################
TAXONOMY
##############################################################

Controlled vocabularies

Problem Type

Building Type

Industry

Investigation Method

Repair Method

Material

Region

Language

Status

Difficulty

Using controlled values improves reporting and filtering.

---

##############################################################
AUDITABILITY
##############################################################

Every record should track

Created By

Created At

Updated By

Updated At

Published By

Version

Revision Notes

Deletion Status

Prefer soft deletes for important content.

---

##############################################################
RETENTION
##############################################################

Operational Data

Retain according to business and legal requirements.

Content

Archive rather than delete where practical.

Media

Version important engineering images if edited.

---

##############################################################
INDEXING STRATEGY
##############################################################

Optimise indexes for

Slug

Status

Published Date

Category

Problem

Industry

Location

Tags

Search Fields

Design indexes based on real query patterns, not assumptions.

---

##############################################################
SUCCESS CRITERIA
##############################################################

The data model should support

Thousands of articles.

Hundreds of case studies.

Large media libraries.

Fast search.

Future Building Passport functionality.

AI-assisted recommendations.

Without requiring significant structural changes to the database.

The database should model engineering knowledge in a way that is reusable, scalable and maintainable.

# FILE 5E

# API SPECIFICATION & INTEGRATION ARCHITECTURE

Version: 2.0

Purpose

Define a secure, versioned and extensible API architecture that powers all current and future Skyline applications.

The API should serve as the single source of truth for engineering content, operational workflows and future digital services.

---

# API Design Principles

1. API-first development
2. Version all public APIs
3. Stateless communication
4. Consistent response formats
5. Secure by default
6. Resource-oriented design
7. Idempotent operations where applicable
8. Comprehensive validation
9. Predictable error handling
10. Backward compatibility whenever practical

---

##############################################################
HIGH-LEVEL ARCHITECTURE
##############################################################

                    Web Frontend
                         │
                  REST API Gateway
                         │
      ┌──────────────────┼──────────────────┐
      │                  │                  │
   CMS Admin         Client Portal     Mobile App
      │                  │                  │
      └──────────────────┼──────────────────┘
                         │
                Business Logic Layer
                         │
                   Database & Storage

Future Consumers

AI Assistant

Building Passport

Reporting Engine

Partner Integrations

Internal Dashboards

---

##############################################################
API VERSIONING
##############################################################

Base Path

/api/v1/

Future

/api/v2/

Rules

Never introduce breaking changes within a version.

Deprecate old endpoints with clear timelines.

Document all changes.

---

##############################################################
AUTHENTICATION
##############################################################

Public Endpoints

Read-only content

Search

FAQs

Downloads (public)

Protected Endpoints

Lead management

Content editing

Media uploads

Reports

Client Portal

Authentication Options

Bearer Tokens

JWT

Session Authentication (CMS)

Future

OAuth2/OpenID Connect if external integrations expand.

---

##############################################################
STANDARD RESPONSE FORMAT
##############################################################

Success

{
  "success": true,
  "data": { ... },
  "meta": { ... }
}

Error

{
  "success": false,
  "error": {
      "code": "...",
      "message": "...",
      "details": [...]
  }
}

Always include meaningful HTTP status codes.

---

##############################################################
CONTENT APIs
##############################################################

Resources

Problems

Solutions

Articles

Case Studies

Industries

Downloads

FAQs

Engineers

Supported Operations

List

Retrieve

Create

Update

Archive

Search

Filtering

Sorting

Pagination

---

##############################################################
SEARCH API
##############################################################

Endpoint

/search

Capabilities

Keyword search

Autocomplete

Typo tolerance

Filters

Weighted ranking

Grouped results

Response Categories

Problems

Solutions

Articles

Case Studies

Downloads

FAQs

Engineers

Future

Semantic search

Natural language queries

---

##############################################################
MEDIA API
##############################################################

Upload

Replace

Delete

Optimise

Metadata

Generate thumbnails

Generate responsive images

Return CDN URLs

Future

Video transcoding

---

##############################################################
LEAD API
##############################################################

Create enquiry

Update status

Assign engineer

Upload attachments

Communication history

Status workflow

New

Qualified

Inspection Scheduled

Inspection Completed

Proposal Sent

Won

Lost

Closed

---

##############################################################
CMS API
##############################################################

Functions

Content management

Publishing

Drafts

Revisions

Scheduling

Media

Taxonomies

Permissions

Audit logs

Optimised for admin interfaces.

---

##############################################################
BUILDING PASSPORT API (Future)
##############################################################

Resources

Buildings

Health Scores

Inspections

Reports

Maintenance

Documents

Timeline

Recommendations

Supports

Client Portal

Mobile App

Engineer Dashboard

---

##############################################################
INSPECTION API (Future)
##############################################################

Create inspection

Assign engineer

Inspection checklist

Observations

Photos

Videos

NDT results

Recommendations

Approval workflow

PDF generation

---

##############################################################
DOWNLOAD API
##############################################################

Track

Downloads

Registrations

Versions

Public access

Restricted access

Download analytics

Future

License management

---

##############################################################
NOTIFICATION API
##############################################################

Channels

Email

SMS (future)

WhatsApp (future)

Push Notifications (future)

Triggers

Inspection booked

Proposal sent

Content published

Review required

Maintenance reminder

---

##############################################################
ANALYTICS API
##############################################################

Expose

Page views

Downloads

Searches

Conversions

Inspection requests

Content performance

Dashboard metrics

Allow configurable date ranges.

---

##############################################################
WEBHOOKS
##############################################################

Events

Lead Created

Inspection Scheduled

Inspection Completed

Content Published

Media Uploaded

Download Completed

Future

Building Health Updated

Warranty Expired

Maintenance Due

All webhook deliveries should be signed and retry on transient failures.

---

##############################################################
THIRD-PARTY INTEGRATIONS
##############################################################

Email Provider

CRM (future)

Calendar

Maps

Cloud Storage

Analytics

Payment Gateway (future)

Document Signing (future)

Design integrations behind abstraction layers to reduce vendor lock-in.

---

##############################################################
RATE LIMITING
##############################################################

Public APIs

Per IP

Authenticated APIs

Per user

Sensitive Endpoints

Stricter limits

Return clear retry information when limits are exceeded.

---

##############################################################
VALIDATION
##############################################################

Server-side validation is mandatory.

Validate

Input types

Required fields

File sizes

File formats

Permissions

Relationships

Never rely solely on client-side validation.

---

##############################################################
ERROR HANDLING
##############################################################

Return consistent codes.

Examples

Validation Failed

Authentication Required

Permission Denied

Resource Not Found

Conflict

Rate Limited

Internal Error

Avoid exposing internal implementation details.

Log full diagnostics internally.

---

##############################################################
SECURITY
##############################################################

HTTPS only

Authentication

Authorisation

CSRF protection (session-based)

Input sanitisation

Output encoding

Rate limiting

Audit logging

Secure headers

Token expiration

Least privilege access

---

##############################################################
DOCUMENTATION
##############################################################

Generate

OpenAPI Specification

Swagger UI

Example requests

Example responses

Authentication guide

Version history

Error catalogue

Integration tutorials

API documentation should be treated as a product.

---

##############################################################
SDK STRATEGY (Future)
##############################################################

Potential SDKs

JavaScript

PHP

Python

Mobile

Flutter

React Native

Keep SDKs thin.

Business rules remain on the server.

---

##############################################################
OBSERVABILITY
##############################################################

Track

Latency

Error rates

Throughput

Failed authentication

Webhook failures

Slow queries

Top endpoints

Use metrics to improve API performance continuously.

---

##############################################################
SUCCESS CRITERIA
##############################################################

The API should enable multiple applications to share a single engineering knowledge base.

It should remain stable as new modules—such as the Building Passport, AI assistant, mobile applications and partner integrations—are introduced.

The API should be easy to document, secure to expose and efficient to maintain.

Its design should encourage reuse of engineering knowledge rather than duplication of logic.