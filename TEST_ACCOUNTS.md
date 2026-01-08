# Test Accounts

## 5 Fully Functional Test Accounts

All accounts use password: `password123`

### 1. Sarah Chen (Level 12 - Advanced User)
- **Email:** `sarah@test.com`
- **Password:** `password123`
- **XP:** 1,350 (Level 12)
- **Balance:** Rp 500,000
- **Completed Bounties:** 3
  - Build Mobile App UI (150 XP, Rp 75,000)
  - Backend API Development (200 XP, Rp 100,000)
  - Payment Integration (150 XP, Rp 125,000)
- **Active Bounties:** 2
  - Real-time Chat Feature (working on)
  - Mobile Responsive Design (working on)
- **Event Registrations:** 2
  - React Meetup
  - Design Workshop

---

### 2. Marcus Dev (Level 10 - Experienced)
- **Email:** `marcus@test.com`
- **Password:** `password123`
- **XP:** 950 (Level 10)
- **Balance:** Rp 350,000
- **Completed Bounties:** 2
  - Database Migration (100 XP, Rp 50,000)
  - Security Audit (250 XP, Rp 150,000)
- **Active Bounties:** 1
  - GraphQL API Migration (working on)
- **Event Registrations:** 2
  - React Meetup
  - Data Summit

---

### 3. Emily Codes (Level 7 - Intermediate)
- **Email:** `emily@test.com`
- **Password:** `password123`
- **XP:** 650 (Level 7)
- **Balance:** Rp 200,000
- **Completed Bounties:** 2
  - UI/UX Redesign (180 XP, Rp 90,000)
  - Cloud Migration (200 XP, Rp 150,000)
- **Active Bounties:** 1
  - Performance Optimization (working on)
- **Event Registrations:** 1
  - Security Talk

---

### 4. James Tech (Level 3 - Beginner)
- **Email:** `james@test.com`
- **Password:** `password123`
- **XP:** 300 (Level 3)
- **Balance:** Rp 100,000
- **Completed Bounties:** 0
- **Active Bounties:** 1
  - Real-time Chat Feature (working on)
- **Event Registrations:** 1
  - Design Workshop

---

### 5. Alex Pro (Level 15 - Expert)
- **Email:** `alex@test.com`
- **Password:** `password123`
- **XP:** 1,800 (Level 15)
- **Balance:** Rp 750,000
- **Completed Bounties:** 3
  - E-commerce Platform (300 XP, Rp 200,000)
  - React Native App (250 XP, Rp 175,000)
  - AI Chatbot (350 XP, Rp 250,000)
- **Active Bounties:** 1
  - Admin Dashboard (working on)
- **Event Registrations:** 2
  - Hiring Fair
  - React Meetup

---

## Level System Reference

**XP Requirements per Level:**
- Level 1-10: 100 XP per level (0, 100, 200, 300, ..., 1000)
- Level 11-20: 150 XP per level (1100, 1250, 1400, 1550, ..., 2450)
- Level 21-30: 200 XP per level (and so on)

**Example:**
- Level 1: 0-99 XP
- Level 5: 400-499 XP
- Level 10: 900-999 XP
- Level 12: 1100-1249 XP (requires 1100 XP to reach)
- Level 15: 1550-1699 XP (requires 1550 XP to reach)

---

## Database Statistics

- **Total Users:** 8 (5 test + 3 regular)
- **Total Posts:** 30 with 338 post votes
- **Total Comments:** 71 with 287 comment votes
- **Total Events:** 5
- **Total Bounties:** 15 (10 completed, 5 active)
- **Total Companies:** 5

---

## Quick Login Test

```bash
# Test login with Sarah (Level 12)
curl -X POST http://192.168.20.12:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "sarah@test.com", "password": "password123"}'

# Test login with Alex (Level 15)
curl -X POST http://192.168.20.12:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alex@test.com", "password": "password123"}'
```

---

## API Endpoints to Test

- `GET /api/profile` - View profile with XP and balance
- `GET /api/profile/stats` - View detailed statistics
- `GET /api/bounties` - View all bounties
- `GET /api/events` - View all events
- `GET /api/posts` - View all posts with votes
