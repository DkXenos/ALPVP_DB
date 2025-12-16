import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.bountyAssignment.deleteMany({});
  await prisma.bounty.deleteMany({});
  await prisma.company.deleteMany({});

  // Create companies
  const companies = await prisma.company.createMany({
    data: [
      {
        name: "TechCorp Solutions",
        email: "contact@techcorp.com",
        password: "$2b$10$dummyhashedpassword1", // In real app, hash this properly
        description: "Leading technology solutions provider",
      },
      {
        name: "StartUp Innovations",
        email: "hello@startup.com",
        password: "$2b$10$dummyhashedpassword2",
        description: "Innovative startup building the future",
      },
      {
        name: "DataFlow Inc",
        email: "info@dataflow.com",
        password: "$2b$10$dummyhashedpassword3",
        description: "Data management and analytics company",
      },
      {
        name: "SecureNet",
        email: "security@securenet.com",
        password: "$2b$10$dummyhashedpassword4",
        description: "Cybersecurity and network security experts",
      },
      {
        name: "DesignHub",
        email: "creative@designhub.com",
        password: "$2b$10$dummyhashedpassword5",
        description: "Creative design and branding agency",
      },
    ],
  });

  console.log(`Created ${companies.count} companies!`);

  // Fetch created companies to get their IDs
  const companyList = await prisma.company.findMany();

  // Create bounties linked to companies
  const bounties = await prisma.bounty.createMany({
    data: [
      {
        title: "Build Mobile App UI",
        company_id: companyList[0].id,
        description: "Create a modern, responsive mobile app UI using React Native",
        deadline: new Date("2025-01-15T23:59:59Z"),
        rewardXp: 150,
        rewardMoney: 75000,
        status: "OPEN",
      },
      {
        title: "Backend API Development",
        company_id: companyList[1].id,
        description: "Develop RESTful API endpoints for our new platform",
        deadline: new Date("2025-01-20T23:59:59Z"),
        rewardXp: 200,
        rewardMoney: 100000,
        status: "OPEN",
      },
      {
        title: "Database Migration",
        company_id: companyList[2].id,
        description: "Migrate existing MySQL database to PostgreSQL",
        deadline: new Date("2025-01-10T23:59:59Z"),
        rewardXp: 100,
        rewardMoney: 50000,
        status: "OPEN",
      },
      {
        title: "Security Audit",
        company_id: companyList[3].id,
        description: "Perform comprehensive security audit of our infrastructure",
        deadline: new Date("2024-12-31T23:59:59Z"),
        rewardXp: 250,
        rewardMoney: 150000,
        status: "CLOSED",
      },
      {
        title: "UI/UX Redesign",
        company_id: companyList[4].id,
        description: "Redesign our website with modern UI/UX principles",
        deadline: new Date("2025-02-01T23:59:59Z"),
        rewardXp: 180,
        rewardMoney: 90000,
        status: "OPEN",
      },
    ],
  });

  console.log(`Created ${bounties.count} bounties successfully!`);

  // --- Create sample users ---
  console.log("Seeding users...");
  await prisma.commentVote.deleteMany().catch(() => {})
  await prisma.comment.deleteMany().catch(() => {})
  await prisma.post.deleteMany().catch(() => {})
  await prisma.eventRegistration.deleteMany().catch(() => {})
  await prisma.event.deleteMany().catch(() => {})
  await prisma.company.deleteMany().catch(() => {})
  await prisma.user.deleteMany().catch(() => {})

  const users = await Promise.all([
    { username: "alice", email: "alice@example.com", password: "password123" },
    { username: "bob", email: "bob@example.com", password: "password123" },
    { username: "carol", email: "carol@example.com", password: "password123" },
    { username: "dave", email: "dave@example.com", password: "password123" },
    { username: "eve", email: "eve@example.com", password: "password123" },
  ].map((u) => prisma.user.create({ data: u })));

  console.log(`Created ${users.length} users`);

  // --- Create sample companies ---
  console.log("Seeding companies...");
  const companies = await Promise.all([
    { name: "Acme Co", email: "acme@example.com", password: "password123" },
    { name: "TechCorp", email: "tech@example.com", password: "password123" },
    { name: "DesignHub", email: "design@example.com", password: "password123" },
    { name: "DataFlow", email: "dataflow@example.com", password: "password123" },
    { name: "SecureNet", email: "securenet@example.com", password: "password123" },
  ].map((c) => prisma.company.create({ data: c })));

  console.log(`Created ${companies.length} companies`);

  // --- Create sample posts ---
  console.log("Seeding posts...");
  const posts = await Promise.all([
    prisma.post.create({ data: { user_id: users[0].id, content: "Hello from Alice!" } }),
    prisma.post.create({ data: { user_id: users[1].id, content: "Bob's first post." } }),
    prisma.post.create({ data: { user_id: users[2].id, content: "Carol shares an update." } }),
    prisma.post.create({ data: { user_id: users[3].id, content: "Dave's insight on tech." } }),
    prisma.post.create({ data: { user_id: users[4].id, content: "Eve says hi." } }),
  ]);
  console.log(`Created ${posts.length} posts`);

  // --- Create sample comments ---
  console.log("Seeding comments...");
  const comments = await Promise.all([
    prisma.comment.create({ data: { post_id: posts[0].id, content: "Nice post Alice!" } }),
    prisma.comment.create({ data: { post_id: posts[0].id, content: "I agree with this." } }),
    prisma.comment.create({ data: { post_id: posts[1].id, content: "Thanks for sharing." } }),
    prisma.comment.create({ data: { post_id: posts[2].id, content: "Interesting." } }),
    prisma.comment.create({ data: { post_id: posts[3].id, content: "Great read." } }),
  ]);
  console.log(`Created ${comments.length} comments`);

  // --- Create sample votes ---
  console.log("Seeding votes...");
  const votes = await Promise.all([
    prisma.vote.create({ data: { vote_type: "upvote" } }),
    prisma.vote.create({ data: { vote_type: "upvote" } }),
    prisma.vote.create({ data: { vote_type: "downvote" } }),
    prisma.vote.create({ data: { vote_type: "upvote" } }),
    prisma.vote.create({ data: { vote_type: "downvote" } }),
  ]);
  console.log(`Created ${votes.length} votes`);

  // --- Create sample events ---
  console.log("Seeding events...");
  const events = await Promise.all([
    prisma.event.create({ data: { title: "React Meetup", description: "Discuss React 18 features", event_date: new Date('2025-02-20T18:00:00Z'), company_id: companies[0].id, registered_quota: 100 } }),
    prisma.event.create({ data: { title: "Design Workshop", description: "UI/UX hands-on", event_date: new Date('2025-03-05T10:00:00Z'), company_id: companies[1].id, registered_quota: 50 } }),
    prisma.event.create({ data: { title: "Data Summit", description: "Scaling Postgres", event_date: new Date('2025-04-01T09:00:00Z'), company_id: companies[2].id, registered_quota: 200 } }),
    prisma.event.create({ data: { title: "Security Talk", description: "App security best practices", event_date: new Date('2025-01-30T14:00:00Z'), company_id: companies[3].id, registered_quota: 150 } }),
    prisma.event.create({ data: { title: "Hiring Fair", description: "Meet talent", event_date: new Date('2025-05-12T11:00:00Z'), company_id: companies[4].id, registered_quota: 300 } }),
  ]);
  console.log(`Created ${events.length} events`);
}

main()
  .catch((e) => {
    console.error("Error seeding bounties:", e);
  })
  .then(async () => {
    await prisma.$disconnect();
  });
