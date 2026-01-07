import { PrismaClient } from "../generated/prisma"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Clear in correct order to avoid FK constraint errors
  await prisma.commentVote.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.eventRegistration.deleteMany()
  await prisma.event.deleteMany()
  await prisma.bountyAssignment.deleteMany()
  await prisma.bounty.deleteMany()
  await prisma.company.deleteMany()
  await prisma.vote.deleteMany()
  await prisma.user.deleteMany()

  // Create users with placeholder profile image
  const usersData = [
    { username: "alice", email: "alice@example.com", password: "password123", profile_image: "/uploads/users/user_placeholder.png" },
    { username: "bob", email: "bob@example.com", password: "password123", profile_image: "/uploads/users/user_placeholder.png" },
    { username: "carol", email: "carol@example.com", password: "password123", profile_image: "/uploads/users/user_placeholder.png" },
    { username: "dave", email: "dave@example.com", password: "password123", profile_image: "/uploads/users/user_placeholder.png" },
    { username: "eve", email: "eve@example.com", password: "password123", profile_image: "/uploads/users/user_placeholder.png" },
  ]

  await prisma.user.createMany({ data: usersData })
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } })
  console.log(`Created ${users.length} users`)

  // Create companies with placeholder logo
  const companiesData = [
    { name: "Acme Co", email: "acme@example.com", password: "password123", description: "Acme company", logo: "/uploads/companies/company_placeholder.png" },
    { name: "TechCorp", email: "tech@example.com", password: "password123", description: "TechCorp", logo: "/uploads/companies/company_placeholder.png" },
    { name: "DesignHub", email: "design@example.com", password: "password123", description: "DesignHub", logo: "/uploads/companies/company_placeholder.png" },
    { name: "DataFlow", email: "dataflow@example.com", password: "password123", description: "DataFlow", logo: "/uploads/companies/company_placeholder.png" },
    { name: "SecureNet", email: "securenet@example.com", password: "password123", description: "SecureNet", logo: "/uploads/companies/company_placeholder.png" },
  ]

  await prisma.company.createMany({ data: companiesData })
  const companies = await prisma.company.findMany({ orderBy: { id: "asc" } })
  console.log(`Created ${companies.length} companies`)

  // Create posts - lots of diverse content
  const posts = await Promise.all([
    prisma.post.create({ data: { user_id: users[0].id, content: "Just finished migrating our entire backend to TypeScript! The type safety is a game changer. Who else made the switch this year? 🚀" } }),
    prisma.post.create({ data: { user_id: users[1].id, content: "Hot take: CSS Grid is better than Flexbox for most layouts. Change my mind 💭" } }),
    prisma.post.create({ data: { user_id: users[2].id, content: "Spent 3 hours debugging only to realize I forgot to save the file. Anyone else? 😅" } }),
    prisma.post.create({ data: { user_id: users[3].id, content: "Just deployed my first app to production! Feeling nervous and excited at the same time 🎉" } }),
    prisma.post.create({ data: { user_id: users[4].id, content: "Reading Clean Code by Robert Martin. This book is changing how I write code! Highly recommend 📚" } }),
    prisma.post.create({ data: { user_id: users[0].id, content: "Question: Should I learn Vue or React in 2026? Looking at job market trends..." } }),
    prisma.post.create({ data: { user_id: users[1].id, content: "Dockerized my entire development environment. No more 'works on my machine' issues! 🐳" } }),
    prisma.post.create({ data: { user_id: users[2].id, content: "Anyone attending the tech conference next month? Would love to connect!" } }),
    prisma.post.create({ data: { user_id: users[3].id, content: "Just got my AWS certification! Next up: Kubernetes 💪" } }),
    prisma.post.create({ data: { user_id: users[4].id, content: "Reminder: Always write tests. Your future self will thank you! 🧪" } }),
    prisma.post.create({ data: { user_id: users[0].id, content: "The new JavaScript features in ES2026 are mind-blowing. Pattern matching is finally here! 🎯" } }),
    prisma.post.create({ data: { user_id: users[1].id, content: "Switched from REST to GraphQL for our API. The flexibility is incredible but the learning curve is real 📈" } }),
    prisma.post.create({ data: { user_id: users[2].id, content: "Pro tip: Use Prisma for your next project. The developer experience is unmatched! ⚡" } }),
    prisma.post.create({ data: { user_id: users[3].id, content: "Been pair programming all week. It's amazing how much faster we solve problems together 👥" } }),
    prisma.post.create({ data: { user_id: users[4].id, content: "Started contributing to open source! My first PR just got merged 🎊" } }),
    prisma.post.create({ data: { user_id: users[0].id, content: "Database optimization reduced our query time from 3s to 50ms. Indexing matters! 🔥" } }),
    prisma.post.create({ data: { user_id: users[1].id, content: "Working on a side project that uses AI to generate code. Progress is looking good! 🤖" } }),
    prisma.post.create({ data: { user_id: users[2].id, content: "Just learned about the SOLID principles. Wish someone taught me this earlier in my career!" } }),
    prisma.post.create({ data: { user_id: users[3].id, content: "Setting up CI/CD pipeline with GitHub Actions. Automation is beautiful 🎭" } }),
    prisma.post.create({ data: { user_id: users[4].id, content: "Finally understood closures in JavaScript after 2 years. Sometimes it just clicks! 💡" } }),
    prisma.post.create({ data: { user_id: users[0].id, content: "Refactored 500 lines of code down to 150. Code that doesn't exist can't have bugs! ✨" } }),
    prisma.post.create({ data: { user_id: users[1].id, content: "Joined a new startup as lead developer. Excited for this new chapter! 🚀" } }),
    prisma.post.create({ data: { user_id: users[2].id, content: "Best VS Code extensions for web development? Drop your favorites below! 👇" } }),
    prisma.post.create({ data: { user_id: users[3].id, content: "Implementing dark mode in our app. Users have been requesting this forever! 🌙" } }),
    prisma.post.create({ data: { user_id: users[4].id, content: "Just discovered Tailwind CSS. Where has this been all my life?! 🎨" } }),
    prisma.post.create({ data: { user_id: users[0].id, content: "Code review tip: Always be kind. We're all learning and growing together 💙" } }),
    prisma.post.create({ data: { user_id: users[1].id, content: "Microservices vs Monolith debate continues. IMO it depends on your team size and needs 🤔" } }),
    prisma.post.create({ data: { user_id: users[2].id, content: "Built a Chrome extension that boosts productivity by 50%. Thinking about open sourcing it! 🔧" } }),
    prisma.post.create({ data: { user_id: users[3].id, content: "Performance testing revealed our app handles 10k concurrent users. Time to scale! 📊" } }),
    prisma.post.create({ data: { user_id: users[4].id, content: "Learning Go after years of JavaScript. The concurrency model is fascinating! 🐹" } }),
  ])
  console.log(`Created ${posts.length} posts`)

  // Create comments
  const comments = await Promise.all([
    prisma.comment.create({ data: { post_id: posts[0].id, content: "Nice post Alice!" } }),
    prisma.comment.create({ data: { post_id: posts[0].id, content: "I agree with this." } }),
    prisma.comment.create({ data: { post_id: posts[1].id, content: "Thanks for sharing." } }),
    prisma.comment.create({ data: { post_id: posts[2].id, content: "Interesting." } }),
    prisma.comment.create({ data: { post_id: posts[3].id, content: "Great read." } }),
  ])
  console.log(`Created ${comments.length} comments`)

  // Create votes
  const votes = await Promise.all([
    prisma.vote.create({ data: { vote_type: "upvote" } }),
    prisma.vote.create({ data: { vote_type: "upvote" } }),
    prisma.vote.create({ data: { vote_type: "downvote" } }),
    prisma.vote.create({ data: { vote_type: "upvote" } }),
    prisma.vote.create({ data: { vote_type: "downvote" } }),
  ])
  console.log(`Created ${votes.length} votes`)

  // Create events linked to companies
  const events = await Promise.all([
    prisma.event.create({ data: { title: "React Meetup", description: "Discuss React 18 features", event_date: new Date('2025-02-20T18:00:00Z'), company_id: companies[0].id, registered_quota: 100 } }),
    prisma.event.create({ data: { title: "Design Workshop", description: "UI/UX hands-on", event_date: new Date('2025-03-05T10:00:00Z'), company_id: companies[1].id, registered_quota: 50 } }),
    prisma.event.create({ data: { title: "Data Summit", description: "Scaling Postgres", event_date: new Date('2025-04-01T09:00:00Z'), company_id: companies[2].id, registered_quota: 200 } }),
    prisma.event.create({ data: { title: "Security Talk", description: "App security best practices", event_date: new Date('2025-01-30T14:00:00Z'), company_id: companies[3].id, registered_quota: 150 } }),
    prisma.event.create({ data: { title: "Hiring Fair", description: "Meet talent", event_date: new Date('2025-05-12T11:00:00Z'), company_id: companies[4].id, registered_quota: 300 } }),
  ])
  console.log(`Created ${events.length} events`)

  // Create bounties linked to companies (using Promise.all for UUID support)
  const bounties = await Promise.all([
    prisma.bounty.create({ data: { title: "Build Mobile App UI", company_id: companies[0].id, description: "Create a modern mobile UI", deadline: new Date('2025-01-15T23:59:59Z'), rewardXp: 150, rewardMoney: 75000, status: "OPEN" } }),
    prisma.bounty.create({ data: { title: "Backend API Development", company_id: companies[1].id, description: "Build REST APIs", deadline: new Date('2025-01-20T23:59:59Z'), rewardXp: 200, rewardMoney: 100000, status: "OPEN" } }),
    prisma.bounty.create({ data: { title: "Database Migration", company_id: companies[2].id, description: "Migrate DB", deadline: new Date('2025-01-10T23:59:59Z'), rewardXp: 100, rewardMoney: 50000, status: "OPEN" } }),
    prisma.bounty.create({ data: { title: "Security Audit", company_id: companies[3].id, description: "Security audit", deadline: new Date('2024-12-31T23:59:59Z'), rewardXp: 250, rewardMoney: 150000, status: "CLOSED" } }),
    prisma.bounty.create({ data: { title: "UI/UX Redesign", company_id: companies[4].id, description: "Redesign website", deadline: new Date('2025-02-01T23:59:59Z'), rewardXp: 180, rewardMoney: 90000, status: "OPEN" } }),
  ])
  console.log(`Created ${bounties.length} bounties`)

  console.log("Seeding finished successfully!")
}

;(async () => {
  try {
    await main()
  } catch (e) {
    console.error("Error seeding:", e)
  } finally {
    try {
      await prisma.$disconnect()
    } catch (e) {
      // ignore disconnect errors
    }
  }
})()
