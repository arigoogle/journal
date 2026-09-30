Build: Personal Journal & Pursuits App

You are working on a personal web application for journaling and tracking personal pursuits. make sure responsive on mobile and support PWA.

The goal is to build a simple, polished, personal timeline app — not a general-purpose productivity platform.

The product has three main concepts:

1. Journal — what happened on a particular day
2. Pursuits — things I am currently trying to accomplish
3. Overview — a simple summary of my journaling activity and pursuits

Keep the implementation focused and avoid unnecessary features.

⸻

1. Tech Stack

Use the following stack:

* React
* Vite
* TypeScript
* Tailwind CSS
* React Router
* Supabase
* PostgreSQL through Supabase

Use the latest stable versions available when setting up the project.

For UI components, use a lightweight approach. If a component library is needed, prefer a modern Tailwind-compatible library, but do not introduce unnecessary dependencies.

The application should be responsive and work well on both desktop and mobile.

⸻

2. Product Philosophy

The app should feel like a personal timeline rather than a productivity dashboard.

Core philosophy:

Journal what happened. Track what you’re pursuing. Look back at what happened.

Do NOT turn this into:

* a task manager
* a habit tracker
* a calendar productivity app
* a mood tracker
* a social network
* a gamification system
* a complicated analytics dashboard

Avoid feature creep.

V1 should be intentionally small.

⸻

3. Main Navigation

The application should have three primary sections:

Journal

Calendar-based journal.

Pursuits

Things I am currently pursuing.

Overview

Simple statistics and summary.

Navigation should be obvious and minimal.

Suggested navigation:

Journal
Pursuits
Overview

⸻

4. JOURNAL

Journal is the primary part of the application.

Calendar

Show a monthly calendar.

Example:

September 2026
Mon Tue Wed Thu Fri Sat Sun
  1   2   3   4   5   6   7
  8   9  10  11  12  13  14
 15  16  17  18  19  20  21
 22  23  24  25  26  27  28
 29  30

Each date should visually indicate whether a journal entry exists.

For example:

* no indicator = no journal
* subtle dot/indicator = journal exists

Do not make the calendar visually noisy.

The current date should be visually distinguishable.

Allow navigation between months:

< September 2026 >

The user should be able to navigate to previous/future months.

⸻

5. Journal Entry Behavior

When clicking a date:

If a journal exists

Show the journal entry.

Example:

September 29, 2026
I got sick today. I feel better than yesterday...

Provide an Edit action.

If no journal exists

Show an empty journal editor.

Example:

September 30, 2026
How was today?
[ textarea ]
Save

The writing experience should be simple and frictionless.

Use a normal textarea for V1.

Do NOT implement a complicated rich text editor.

⸻

6. Journal Database Rules

There should be at most ONE journal entry per date.

Database should enforce this using a unique constraint.

Suggested table:

journal_entries
id
date
content
created_at
updated_at

Recommended types:

* id: UUID
* date: DATE
* content: TEXT
* created_at: TIMESTAMPTZ
* updated_at: TIMESTAMPTZ

The date should represent the user’s local calendar date, not an arbitrary timestamp.

⸻

7. JOURNAL EDITING

Support:

* Create
* Read
* Update
* Delete

Deleting should require confirmation.

When saving:

* show appropriate loading state
* prevent duplicate submissions
* show success/error feedback
* update the calendar immediately

Do not lose unsaved text accidentally.

⸻

8. OVERVIEW

The Overview page should remain extremely simple.

Example:

September 2026
Journal
15 / 30 days
████████████░░░░░░░░

The primary statistic is:

Number of days with journal entries / total days in the selected month.

Example:

15 / 30 days

Also show a small summary of active pursuits.

For example:

Current Pursuits
4 active

Optionally show a small current journaling streak if it can be implemented cleanly.

Do not build a huge analytics dashboard.

Avoid unnecessary charts.

⸻

9. PURSUITS

The second major feature is called:

Pursuits

Do NOT call this “Goals”.

The idea is that a pursuit is something the user is currently trying to accomplish.

Examples:

Run a sub-20 5K
Become a strong intermediate tennis player
Go camping once a month
Improve my system design skills
Read 12 books

A pursuit should have:

title
description
status
started_at
ended_at
created_at
updated_at

⸻

10. Pursuit Statuses

A pursuit can have the following statuses:

ACTIVE
ACHIEVED
FAILED
SKIPPED
PASSED

Meaning:

ACTIVE

Currently pursuing it.

ACHIEVED

Successfully accomplished it.

FAILED

Attempted it but did not accomplish it.

SKIPPED

Intentionally skipped it for now.

PASSED

Decided this pursuit is no longer something the user wants.

These statuses are intentionally different.

Do not collapse them into “completed”.

⸻

11. Current Pursuits Page

Default view:

Pursuits
[ Current ] [ History ]
Current
4 active pursuits

Show active pursuits as cards.

Example:

┌─────────────────────────────────┐
│ Run a sub-20 5K                 │
│                                 │
│ Run a 5K under 20 minutes.     │
│                                 │
│ Started Sep 1, 2026             │
│                                 │
│ ACTIVE                          │
└─────────────────────────────────┘

Cards should be clean and readable.

Do not overload cards with information.

⸻

12. Creating a Pursuit

Provide a clear “New Pursuit” action.

Form:

Title
Description
Start date

Start date should default to today.

New pursuits begin with:

ACTIVE

Validate required fields.

Title is required.

Description is optional.

⸻

13. Pursuit Detail

Clicking a pursuit should open its detail view.

Example:

Run a sub-20 5K
Started
September 1, 2026
Description
Run a 5K under 20 minutes.
Status
ACTIVE

Provide actions to update the status.

For example:

Update Status
Achieved
Failed
Skipped
Passed

The user should also be able to edit the pursuit.

⸻

14. IMPORTANT: STATUS HISTORY

Do NOT simply overwrite the pursuit status.

Every status change must be recorded.

Use a separate table:

pursuit_status_history
id
pursuit_id
status
note
created_at

Example history:

September 1
Created
ACTIVE
September 20
FAILED
October 2
ACTIVE
November 15
ACHIEVED

This history is important.

The application should preserve the complete lifecycle of a pursuit.

A pursuit can therefore theoretically go:

ACTIVE
↓
FAILED
↓
ACTIVE
↓
ACHIEVED

Do not delete previous status history when the status changes.

⸻

15. Status Change Note

When changing the status, allow the user to optionally add a short note.

Example:

Change Status
Status
[ Achieved ]
Note
[ Finally ran 19:42 ]
Cancel     Confirm

The note should be stored in pursuit_status_history.

⸻

16. Pursuit History

The History view should contain pursuits that are no longer active.

Example:

History
✓ Run a 10K
  ACHIEVED
  August 2026
— Learn freestyle swimming
  SKIPPED
  July 2026
× Build side project X
  FAILED
  June 2026
→ Learn guitar
  PASSED
  May 2026

Do not assign subjective labels such as “good” or “bad” to these outcomes.

They are simply historical states.

Allow filtering by:

All
Achieved
Failed
Skipped
Passed

Keep the filtering simple.

⸻

17. Database Schema

Use PostgreSQL through Supabase.

Initial schema should contain:

journal_entries

id UUID PRIMARY KEY
date DATE UNIQUE NOT NULL
content TEXT NOT NULL
created_at TIMESTAMPTZ NOT NULL
updated_at TIMESTAMPTZ NOT NULL

pursuits

id UUID PRIMARY KEY
title TEXT NOT NULL
description TEXT
status TEXT NOT NULL
started_at DATE NOT NULL
ended_at DATE
created_at TIMESTAMPTZ NOT NULL
updated_at TIMESTAMPTZ NOT NULL

Status should be constrained to the supported values.

Prefer a PostgreSQL enum or an appropriate CHECK constraint.

pursuit_status_history

id UUID PRIMARY KEY
pursuit_id UUID NOT NULL REFERENCES pursuits(id) ON DELETE CASCADE
status TEXT NOT NULL
note TEXT
created_at TIMESTAMPTZ NOT NULL

Create appropriate indexes.

At minimum:

* journal_entries.date
* pursuits.status
* pursuit_status_history.pursuit_id
* pursuit_status_history.created_at

⸻

18. Supabase

Use Supabase as the backend/database.

Set up the project so database migrations are tracked in the repository.

Use the Supabase CLI where appropriate.

The application should be able to run against a local Supabase environment during development.

Do not hard-code credentials.

Use environment variables.

Example:

VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY

Create an appropriate .env.example.

Never commit secrets.

⸻

19. Authentication

For V1, keep authentication simple.

If authentication is necessary for the Supabase setup, implement a minimal email/password or magic-link authentication flow.

However, do not build elaborate account/profile functionality.

There is only one intended user for this application.

Structure the application so authentication can be improved later without rewriting the entire app.

⸻

20. UI / UX

The visual design should feel:

* clean
* calm
* minimal
* personal
* modern
* slightly editorial
* easy to read

Avoid making it look like a corporate SaaS dashboard.

The calendar should be the visual focus of the Journal page.

Use whitespace generously.

Use subtle borders and states rather than excessive colors.

Do not use excessive animations.

Animations should be subtle and functional.

⸻

21. Responsive Design

The application must work well on:

Desktop

Three-section navigation can be horizontal/sidebar depending on the design.

Mobile

Navigation should remain easy to access.

Calendar must remain usable on small screens.

Journal editor should feel comfortable on mobile.

Pursuit cards should stack vertically.

⸻

22. Loading / Empty / Error States

Implement proper states.

Examples:

Journal:

Loading journal...

No journal:

Nothing written yet.
Write about your day.

Pursuits:

No active pursuits.
What are you pursuing right now?

Errors:

Show a useful user-facing message without exposing raw database errors.

⸻

23. Architecture

Keep the code modular.

Suggested structure:

src/
  components/
  pages/
  layouts/
  features/
    journal/
    pursuits/
    overview/
  lib/
    supabase/
  hooks/
  types/
  utils/

Do not over-engineer.

Avoid creating abstractions for things that are only used once.

Keep business logic separate enough that it is easy to understand and modify.

⸻

24. TypeScript

Use TypeScript strictly.

Avoid:

any

unless there is a genuinely unavoidable reason.

Define types for:

* JournalEntry
* Pursuit
* PursuitStatus
* PursuitStatusHistory

Prefer generated Supabase database types where practical.

⸻

25. Data Fetching

Keep data fetching predictable and simple.

Avoid adding React Query/TanStack Query unless there is a clear benefit.

For V1, straightforward Supabase queries and React state/hooks are acceptable.

If you believe another dependency is necessary, explain why before adding it.

⸻

26. Important Product Constraints

Do NOT implement the following in V1:

* habit tracking
* reminders
* notifications
* recurring goals
* task management
* tags
* categories
* mood tracking
* AI-generated journal entries
* AI summaries
* social sharing
* comments
* multi-user collaboration
* gamification
* streak rewards
* complicated analytics
* calendar events
* file attachments
* image uploads

The application should remain small.

⸻

27. Future Compatibility

Do not build these features now, but avoid making architectural choices that make them impossible later:

* authentication
* journal ↔ pursuit relationships
* richer journal formatting
* yearly statistics
* journal search
* mobile PWA
* export/import
* AI-assisted reflection

Do not implement them unless specifically requested later.

⸻

28. Date Handling

Be careful with timezone issues.

The journal is based on the user’s calendar day.

A journal for:

September 30, 2026

must remain September 30 regardless of timestamp conversion.

Avoid bugs where an entry becomes September 29 or October 1 because of UTC conversion.

Use DATE semantics where possible instead of timestamps for journal dates.

⸻

29. Code Quality

Before considering the implementation complete:

* TypeScript must compile
* production build must work
* linting should pass
* database migrations should be valid
* no hardcoded secrets
* no obvious console errors
* no broken routes
* no dead UI controls
* mobile layout should be checked
* empty states should work
* error states should work

⸻

30. Development Process

Do not immediately generate the entire application blindly.

First:

1. Inspect the existing repository if one exists.
2. Determine whether the project is empty or already has code.
3. Check installed dependencies.
4. Check the current Vite/React/Tailwind setup.
5. Check whether Supabase is already configured.
6. Then implement incrementally.

If the repository already contains an application, preserve useful existing work instead of replacing everything.

Do not delete existing functionality without a reason.

⸻

31. Implementation Order

Implement in this order:

Phase 1

Project foundation:

* Vite
* React
* TypeScript
* Tailwind
* routing
* basic layout/navigation

Phase 2

Supabase:

* database configuration
* migrations
* schema
* generated types
* environment variables

Phase 3

Journal:

* calendar
* month navigation
* journal entry creation
* journal viewing
* editing
* deleting

Phase 4

Pursuits:

* current pursuits
* create pursuit
* detail page
* edit pursuit
* status changes
* status history

Phase 5

Overview:

* monthly journal count
* active pursuit count
* optional simple streak

Phase 6

Polish:

* responsive design
* loading states
* empty states
* error states
* confirmation dialogs
* accessibility
* visual consistency

⸻

32. Acceptance Criteria

The application is considered V1 complete when:

Journal

* I can navigate between months.
* I can click any date.
* I can create a journal entry.
* I can view an existing journal entry.
* I can edit it.
* I can delete it.
* Calendar dates visually indicate whether a journal exists.
* Only one journal entry can exist per date.

Pursuits

* I can create a pursuit.
* New pursuits start as ACTIVE.
* I can view current pursuits.
* I can open a pursuit.
* I can change its status.
* I can optionally add a note when changing status.
* Every status change is preserved in history.
* I can see historical pursuits.
* I can filter history by status.

Overview

* I can see the selected month’s journal count.
* Example: 15 / 30 days.
* I can see the number of active pursuits.

General

* Application works on desktop.
* Application works on mobile.
* Refreshing the page does not lose data.
* Database persists data correctly.
* No secrets are committed.
* Production build succeeds.

⸻

33. Important Design Principle

When you encounter a decision that isn’t specified above, prefer:

the simpler implementation.

Ask yourself:

“Does this help the user journal or understand their personal pursuits?”

If the answer is no, don’t add it.

The goal is not to build the biggest possible journaling application.

The goal is to build a small application that I will actually use every day.

⸻

34. Final Instruction

Start by inspecting the repository and current environment.

Then implement the application according to this specification.

Do not ask me to make decisions that can reasonably be made from this specification.

If you encounter a genuinely important architectural/product ambiguity, stop and explain the ambiguity before making a potentially expensive decision.

After implementation, provide:

1. A concise summary of what was built.
2. Files/components created or changed.
3. Database migrations created.
4. Commands required to run the application locally.
5. Any environment variables required.
6. Any remaining limitations or follow-up items.

Do not add features outside this specification without explicit approval.