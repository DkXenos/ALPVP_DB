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

  // Create users
  const usersData = [
    { username: "alice", email: "alice@example.com", password: "password123" },
    { username: "bob", email: "bob@example.com", password: "password123" },
    { username: "carol", email: "carol@example.com", password: "password123" },
    { username: "dave", email: "dave@example.com", password: "password123" },
    { username: "eve", email: "eve@example.com", password: "password123" },
  ]

  await prisma.user.createMany({ data: usersData })
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } })
  console.log(`Created ${users.length} users`)

  // Create companies
  const companiesData = [
    { name: "Acme Co", email: "acme@example.com", password: "password123", description: "Acme company" },
    { name: "TechCorp", email: "tech@example.com", password: "password123", description: "TechCorp" },
    { name: "DesignHub", email: "design@example.com", password: "password123", description: "DesignHub" },
    { name: "DataFlow", email: "dataflow@example.com", password: "password123", description: "DataFlow" },
    { name: "SecureNet", email: "securenet@example.com", password: "password123", description: "SecureNet" },
  ]

  await prisma.company.createMany({ data: companiesData })
  const companies = await prisma.company.findMany({ orderBy: { id: "asc" } })
  console.log(`Created ${companies.length} companies`)

  // Create posts
  const posts = await Promise.all([
    prisma.post.create({ data: { user_id: users[0].id, content: "Hello from Alice!" } }),
    prisma.post.create({ data: { user_id: users[1].id, content: "Bob's first post." } }),
    prisma.post.create({ data: { user_id: users[2].id, content: "Carol shares an update." } }),
    prisma.post.create({ data: { user_id: users[3].id, content: "Dave's insight on tech." } }),
    prisma.post.create({ data: { user_id: users[4].id, content: "Eve says hi." } }),
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
