import { PrismaClient } from "../generated/prisma"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Clear in correct order to avoid FK constraint errors
  await prisma.postVote.deleteMany()
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

  // Hash password for all users
  const hashedPassword = await bcrypt.hash("password123", 10)

  // Create test users with XP and balance - 5 users you can login with
  // Level 12 = 1200 XP (0-10 = 100/level, 11-20 = 150/level)
  // Level 8 = 800 XP
  // Level 5 = 500 XP
  const usersData = [
    { username: "sarah_chen", email: "sarah@test.com", password: hashedPassword, xp: 1350, balance: 500000, profile_image: "/uploads/users/user_placeholder.png" }, // Level 12
    { username: "marcus_dev", email: "marcus@test.com", password: hashedPassword, xp: 950, balance: 350000, profile_image: "/uploads/users/user_placeholder.png" }, // Level 10
    { username: "emily_codes", email: "emily@test.com", password: hashedPassword, xp: 650, balance: 200000, profile_image: "/uploads/users/user_placeholder.png" }, // Level 7
    { username: "james_tech", email: "james@test.com", password: hashedPassword, xp: 300, balance: 100000, profile_image: "/uploads/users/user_placeholder.png" }, // Level 3
    { username: "alex_pro", email: "alex@test.com", password: hashedPassword, xp: 1800, balance: 750000, profile_image: "/uploads/users/user_placeholder.png" }, // Level 15
    { username: "olivia_taylor", email: "olivia@example.com", password: hashedPassword, xp: 0, balance: 0, profile_image: "/uploads/users/user_placeholder.png" },
    { username: "ryan_foster", email: "ryan@example.com", password: hashedPassword, xp: 0, balance: 0, profile_image: "/uploads/users/user_placeholder.png" },
    { username: "maya_johnson", email: "maya@example.com", password: hashedPassword, xp: 0, balance: 0, profile_image: "/uploads/users/user_placeholder.png" },
  ]

  await prisma.user.createMany({ data: usersData })
  const users = await prisma.user.findMany({ orderBy: { id: "asc" } })
  console.log(`Created ${users.length} users (5 test accounts: sarah@test.com, marcus@test.com, emily@test.com, james@test.com, alex@test.com)`)

  // Create companies with placeholder logo
  const companiesData = [
    { name: "Acme Co", email: "acme@example.com", password: hashedPassword, description: "Acme company", logo: "/uploads/companies/company_placeholder.png" },
    { name: "TechCorp", email: "tech@example.com", password: hashedPassword, description: "TechCorp", logo: "/uploads/companies/company_placeholder.png" },
    { name: "DesignHub", email: "design@example.com", password: hashedPassword, description: "DesignHub", logo: "/uploads/companies/company_placeholder.png" },
    { name: "DataFlow", email: "dataflow@example.com", password: hashedPassword, description: "DataFlow", logo: "/uploads/companies/company_placeholder.png" },
    { name: "SecureNet", email: "securenet@example.com", password: hashedPassword, description: "SecureNet", logo: "/uploads/companies/company_placeholder.png" },
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

  // Create comments - realistic conversations on posts
  const comments = await Promise.all([
    // Post 0 - TypeScript migration
    prisma.comment.create({ data: { post_id: posts[0].id, content: "Nice post Alice! We made the switch last year and never looked back!" } }),
    prisma.comment.create({ data: { post_id: posts[0].id, content: "The types really help catch bugs early. Great decision!" } }),
    prisma.comment.create({ data: { post_id: posts[0].id, content: "How long did the migration take? We're considering it." } }),
    prisma.comment.create({ data: { post_id: posts[0].id, content: "Any tips for migrating a large codebase?" } }),
    
    // Post 1 - CSS Grid vs Flexbox
    prisma.comment.create({ data: { post_id: posts[1].id, content: "Both have their uses! Grid for layouts, Flex for components." } }),
    prisma.comment.create({ data: { post_id: posts[1].id, content: "I still prefer Flexbox for most things tbh" } }),
    prisma.comment.create({ data: { post_id: posts[1].id, content: "Grid is definitely better for complex layouts!" } }),
    
    // Post 2 - Debugging story
    prisma.comment.create({ data: { post_id: posts[2].id, content: "Happens to the best of us! 😂" } }),
    prisma.comment.create({ data: { post_id: posts[2].id, content: "I've done this more times than I'd like to admit" } }),
    prisma.comment.create({ data: { post_id: posts[2].id, content: "Pro tip: Enable auto-save in VS Code!" } }),
    prisma.comment.create({ data: { post_id: posts[2].id, content: "This is why I have trust issues with computers lol" } }),
    
    // Post 3 - First deployment
    prisma.comment.create({ data: { post_id: posts[3].id, content: "Congrats! 🎉 First deployment is always special!" } }),
    prisma.comment.create({ data: { post_id: posts[3].id, content: "That's awesome! What stack did you use?" } }),
    prisma.comment.create({ data: { post_id: posts[3].id, content: "Welcome to production! Remember to monitor your logs 😄" } }),
    
    // Post 4 - Clean Code book
    prisma.comment.create({ data: { post_id: posts[4].id, content: "Great book! Also check out Refactoring by Martin Fowler" } }),
    prisma.comment.create({ data: { post_id: posts[4].id, content: "This book should be required reading for all developers" } }),
    
    // Post 5 - Vue vs React
    prisma.comment.create({ data: { post_id: posts[5].id, content: "React has more job opportunities currently" } }),
    prisma.comment.create({ data: { post_id: posts[5].id, content: "Vue is easier to learn, but React is more in demand" } }),
    prisma.comment.create({ data: { post_id: posts[5].id, content: "Can't go wrong with either! Pick based on job market in your area." } }),
    prisma.comment.create({ data: { post_id: posts[5].id, content: "I'd say React, bigger ecosystem and community" } }),
    
    // Post 6 - Docker
    prisma.comment.create({ data: { post_id: posts[6].id, content: "Docker is a lifesaver! No more dependency nightmares" } }),
    prisma.comment.create({ data: { post_id: posts[6].id, content: "Do you use Docker Compose for multi-container setups?" } }),
    
    // Post 7 - Tech conference
    prisma.comment.create({ data: { post_id: posts[7].id, content: "I'll be there! Let's meet up!" } }),
    prisma.comment.create({ data: { post_id: posts[7].id, content: "Which talks are you most excited about?" } }),
    prisma.comment.create({ data: { post_id: posts[7].id, content: "Thinking about going. Is it worth the ticket price?" } }),
    
    // Post 8 - AWS cert
    prisma.comment.create({ data: { post_id: posts[8].id, content: "Congratulations! How long did you study for it?" } }),
    prisma.comment.create({ data: { post_id: posts[8].id, content: "Nice! CKA next? That's a tough one 💪" } }),
    
    // Post 9 - Tests reminder
    prisma.comment.create({ data: { post_id: posts[9].id, content: "Preach! Tests have saved me countless times" } }),
    prisma.comment.create({ data: { post_id: posts[9].id, content: "What testing framework do you recommend?" } }),
    
    // Post 10 - ES2026
    prisma.comment.create({ data: { post_id: posts[10].id, content: "Pattern matching is going to change everything!" } }),
    prisma.comment.create({ data: { post_id: posts[10].id, content: "Finally! Been waiting for this since using Rust" } }),
    
    // Post 11 - GraphQL
    prisma.comment.create({ data: { post_id: posts[11].id, content: "How's the performance compared to REST?" } }),
    prisma.comment.create({ data: { post_id: posts[11].id, content: "The N+1 problem can be tricky. Use DataLoader!" } }),
    prisma.comment.create({ data: { post_id: posts[11].id, content: "GraphQL is great but over-fetching is still possible" } }),
    
    // Post 12 - Prisma
    prisma.comment.create({ data: { post_id: posts[12].id, content: "Prisma is incredible! The type safety is 👌" } }),
    prisma.comment.create({ data: { post_id: posts[12].id, content: "Migrations are so smooth with Prisma" } }),
    
    // Post 13 - Pair programming
    prisma.comment.create({ data: { post_id: posts[13].id, content: "Pair programming is underrated. Knowledge sharing is 🔑" } }),
    prisma.comment.create({ data: { post_id: posts[13].id, content: "Do you do driver-navigator style?" } }),
    
    // Post 14 - Open source
    prisma.comment.create({ data: { post_id: posts[14].id, content: "Congrats on your first PR! 🎊" } }),
    prisma.comment.create({ data: { post_id: posts[14].id, content: "That's awesome! Which project?" } }),
    
    // Post 15 - Database optimization
    prisma.comment.create({ data: { post_id: posts[15].id, content: "Indexing is magic! What DB are you using?" } }),
    prisma.comment.create({ data: { post_id: posts[15].id, content: "3s to 50ms is insane! Any other optimizations you did?" } }),
    
    // Post 16 - AI code generation
    prisma.comment.create({ data: { post_id: posts[16].id, content: "This sounds exciting! Keep us posted on progress" } }),
    prisma.comment.create({ data: { post_id: posts[16].id, content: "Are you using GPT or training your own model?" } }),
    
    // Post 17 - SOLID principles
    prisma.comment.create({ data: { post_id: posts[17].id, content: "Same! Game changer for code architecture" } }),
    prisma.comment.create({ data: { post_id: posts[17].id, content: "Single Responsibility is the most important one IMO" } }),
    
    // Post 18 - CI/CD
    prisma.comment.create({ data: { post_id: posts[18].id, content: "GitHub Actions is so powerful! What's your workflow?" } }),
    prisma.comment.create({ data: { post_id: posts[18].id, content: "Automated tests + deployments = peace of mind" } }),
    
    // Post 19 - Closures
    prisma.comment.create({ data: { post_id: posts[19].id, content: "Closures are tricky! Glad it clicked for you" } }),
    prisma.comment.create({ data: { post_id: posts[19].id, content: "Understanding the scope chain really helps" } }),
    
    // Post 20 - Refactoring
    prisma.comment.create({ data: { post_id: posts[20].id, content: "Love this! Less code, fewer bugs. Simple truth." } }),
    prisma.comment.create({ data: { post_id: posts[20].id, content: "What was the biggest win from the refactor?" } }),
    
    // Post 21 - New startup
    prisma.comment.create({ data: { post_id: posts[21].id, content: "Congrats Bob! What's the startup working on?" } }),
    prisma.comment.create({ data: { post_id: posts[21].id, content: "Good luck! Lead dev is a big responsibility 🚀" } }),
    
    // Post 22 - VS Code extensions
    prisma.comment.create({ data: { post_id: posts[22].id, content: "Prettier, ESLint, GitLens are must-haves!" } }),
    prisma.comment.create({ data: { post_id: posts[22].id, content: "Thunder Client for API testing is amazing" } }),
    prisma.comment.create({ data: { post_id: posts[22].id, content: "Don't forget Error Lens! Shows errors inline" } }),
    
    // Post 23 - Dark mode
    prisma.comment.create({ data: { post_id: posts[23].id, content: "Dark mode is essential! Good job listening to users" } }),
    prisma.comment.create({ data: { post_id: posts[23].id, content: "My eyes thank you 🌙" } }),
    
    // Post 24 - Tailwind
    prisma.comment.create({ data: { post_id: posts[24].id, content: "Tailwind is addictive! No more naming CSS classes" } }),
    prisma.comment.create({ data: { post_id: posts[24].id, content: "The utility-first approach is brilliant" } }),
    
    // Post 25 - Code review
    prisma.comment.create({ data: { post_id: posts[25].id, content: "This! Kindness in code reviews builds better teams 💙" } }),
    prisma.comment.create({ data: { post_id: posts[25].id, content: "Always comment on the code, not the person" } }),
    
    // Post 26 - Microservices vs Monolith
    prisma.comment.create({ data: { post_id: posts[26].id, content: "Start with monolith, break into microservices when needed" } }),
    prisma.comment.create({ data: { post_id: posts[26].id, content: "Microservices add complexity. Only use if you need scale" } }),
    
    // Post 27 - Chrome extension
    prisma.comment.create({ data: { post_id: posts[27].id, content: "Please open source it! Would love to check it out" } }),
    prisma.comment.create({ data: { post_id: posts[27].id, content: "50% boost is huge! What does it do?" } }),
    
    // Post 28 - Performance testing
    prisma.comment.create({ data: { post_id: posts[28].id, content: "10k concurrent is impressive! What stack?" } }),
    prisma.comment.create({ data: { post_id: posts[28].id, content: "Time to add horizontal scaling!" } }),
    
    // Post 29 - Learning Go
    prisma.comment.create({ data: { post_id: posts[29].id, content: "Go is amazing for backend services! Goroutines are 🔥" } }),
    prisma.comment.create({ data: { post_id: posts[29].id, content: "The simplicity of Go is refreshing after JS" } }),
  ])
  console.log(`Created ${comments.length} comments`)

  // Create many votes for both posts and comments
  const votes = await Promise.all([
    // Create 100+ votes for variety
    ...Array.from({ length: 120 }, (_, i) => 
      prisma.vote.create({ data: { vote_type: i % 3 === 0 ? "downvote" : "upvote" } })
    )
  ])
  console.log(`Created ${votes.length} votes`)
  
  // Link votes to posts (PostVote junction table) - add votes to all posts
  const postVotes = []
  for (let i = 0; i < posts.length; i++) {
    const numVotes = Math.floor(Math.random() * 15) + 5 // 5-20 votes per post
    for (let j = 0; j < numVotes; j++) {
      const voteIndex = (i * 4 + j) % votes.length
      postVotes.push(
        prisma.postVote.create({ 
          data: { post_id: posts[i].id, vote_id: votes[voteIndex].id } 
        })
      )
    }
  }
  await Promise.all(postVotes)
  console.log(`Created ${postVotes.length} post votes`)
  
  // Link votes to comments (CommentVote junction table)
  const commentVotes = []
  for (let i = 0; i < comments.length; i++) {
    const numVotes = Math.floor(Math.random() * 8) + 1 // 1-8 votes per comment
    for (let j = 0; j < numVotes; j++) {
      const voteIndex = (i * 3 + j + 50) % votes.length
      commentVotes.push(
        prisma.commentVote.create({ 
          data: { comment_id: comments[i].id, vote_id: votes[voteIndex].id } 
        })
      )
    }
  }
  await Promise.all(commentVotes)
  console.log(`Created ${commentVotes.length} comment votes`)

  // Create events linked to companies
  const events = await Promise.all([
    prisma.event.create({ data: { title: "React Meetup", description: "Discuss React 18 features", event_date: new Date('2025-02-20T18:00:00Z'), company_id: companies[0].id, registered_quota: 100 } }),
    prisma.event.create({ data: { title: "Design Workshop", description: "UI/UX hands-on", event_date: new Date('2025-03-05T10:00:00Z'), company_id: companies[1].id, registered_quota: 50 } }),
    prisma.event.create({ data: { title: "Data Summit", description: "Scaling Postgres", event_date: new Date('2025-04-01T09:00:00Z'), company_id: companies[2].id, registered_quota: 200 } }),
    prisma.event.create({ data: { title: "Security Talk", description: "App security best practices", event_date: new Date('2025-01-30T14:00:00Z'), company_id: companies[3].id, registered_quota: 150 } }),
    prisma.event.create({ data: { title: "Hiring Fair", description: "Meet talent", event_date: new Date('2025-05-12T11:00:00Z'), company_id: companies[4].id, registered_quota: 300 } }),
  ])
  console.log(`Created ${events.length} events`)

  // Create bounties linked to companies
  const bounties = await Promise.all([
    // Completed bounties (users won these)
    prisma.bounty.create({ data: { title: "Build Mobile App UI", company_id: companies[0].id, description: "Create a modern mobile UI", deadline: new Date('2025-01-05T23:59:59Z'), rewardXp: 150, rewardMoney: 75000, status: "CLOSED", winner_id: users[0].id } }),
    prisma.bounty.create({ data: { title: "Backend API Development", company_id: companies[1].id, description: "Build REST APIs", deadline: new Date('2025-01-06T23:59:59Z'), rewardXp: 200, rewardMoney: 100000, status: "CLOSED", winner_id: users[0].id } }),
    prisma.bounty.create({ data: { title: "Database Migration", company_id: companies[2].id, description: "Migrate DB", deadline: new Date('2025-01-07T23:59:59Z'), rewardXp: 100, rewardMoney: 50000, status: "CLOSED", winner_id: users[1].id } }),
    prisma.bounty.create({ data: { title: "Security Audit", company_id: companies[3].id, description: "Security audit", deadline: new Date('2024-12-31T23:59:59Z'), rewardXp: 250, rewardMoney: 150000, status: "CLOSED", winner_id: users[1].id } }),
    prisma.bounty.create({ data: { title: "UI/UX Redesign", company_id: companies[4].id, description: "Redesign website", deadline: new Date('2025-01-03T23:59:59Z'), rewardXp: 180, rewardMoney: 90000, status: "CLOSED", winner_id: users[2].id } }),
    prisma.bounty.create({ data: { title: "E-commerce Platform", company_id: companies[0].id, description: "Build full e-commerce", deadline: new Date('2025-01-04T23:59:59Z'), rewardXp: 300, rewardMoney: 200000, status: "CLOSED", winner_id: users[4].id } }),
    prisma.bounty.create({ data: { title: "React Native App", company_id: companies[1].id, description: "Mobile app development", deadline: new Date('2024-12-28T23:59:59Z'), rewardXp: 250, rewardMoney: 175000, status: "CLOSED", winner_id: users[4].id } }),
    prisma.bounty.create({ data: { title: "Payment Integration", company_id: companies[2].id, description: "Integrate payment gateway", deadline: new Date('2024-12-25T23:59:59Z'), rewardXp: 150, rewardMoney: 125000, status: "CLOSED", winner_id: users[0].id } }),
    prisma.bounty.create({ data: { title: "Cloud Migration", company_id: companies[3].id, description: "AWS cloud migration", deadline: new Date('2024-12-20T23:59:59Z'), rewardXp: 200, rewardMoney: 150000, status: "CLOSED", winner_id: users[2].id } }),
    prisma.bounty.create({ data: { title: "AI Chatbot", company_id: companies[4].id, description: "Build AI customer support", deadline: new Date('2024-12-15T23:59:59Z'), rewardXp: 350, rewardMoney: 250000, status: "CLOSED", winner_id: users[4].id } }),
    
    // Active bounties with assignments (users are working on these)
    prisma.bounty.create({ data: { title: "Real-time Chat Feature", company_id: companies[0].id, description: "WebSocket chat implementation", deadline: new Date('2025-02-15T23:59:59Z'), rewardXp: 180, rewardMoney: 120000, status: "OPEN" } }),
    prisma.bounty.create({ data: { title: "GraphQL API Migration", company_id: companies[1].id, description: "Convert REST to GraphQL", deadline: new Date('2025-02-20T23:59:59Z'), rewardXp: 220, rewardMoney: 140000, status: "OPEN" } }),
    prisma.bounty.create({ data: { title: "Performance Optimization", company_id: companies[2].id, description: "Optimize app performance", deadline: new Date('2025-03-01T23:59:59Z'), rewardXp: 150, rewardMoney: 90000, status: "OPEN" } }),
    prisma.bounty.create({ data: { title: "Admin Dashboard", company_id: companies[3].id, description: "Build comprehensive admin panel", deadline: new Date('2025-03-10T23:59:59Z'), rewardXp: 200, rewardMoney: 130000, status: "OPEN" } }),
    prisma.bounty.create({ data: { title: "Mobile Responsive Design", company_id: companies[4].id, description: "Make site fully responsive", deadline: new Date('2025-02-28T23:59:59Z'), rewardXp: 120, rewardMoney: 70000, status: "OPEN" } }),
  ])
  console.log(`Created ${bounties.length} bounties (10 completed, 5 active)`)
  
  // Create bounty assignments (users taking bounties)
  await Promise.all([
    prisma.bountyAssignment.create({ data: { bounty_id: bounties[10].id, user_id: users[0].id } }), // Sarah working on Real-time Chat
    prisma.bountyAssignment.create({ data: { bounty_id: bounties[11].id, user_id: users[1].id } }), // Marcus working on GraphQL
    prisma.bountyAssignment.create({ data: { bounty_id: bounties[12].id, user_id: users[2].id } }), // Emily working on Performance
    prisma.bountyAssignment.create({ data: { bounty_id: bounties[10].id, user_id: users[3].id } }), // James also on Real-time Chat
    prisma.bountyAssignment.create({ data: { bounty_id: bounties[13].id, user_id: users[4].id } }), // Alex on Admin Dashboard
    prisma.bountyAssignment.create({ data: { bounty_id: bounties[14].id, user_id: users[0].id } }), // Sarah on Mobile Responsive
  ])
  console.log("Created bounty assignments")
  
  // Create event registrations
  await Promise.all([
    prisma.eventRegistration.create({ data: { event_id: events[0].id, user_id: users[0].id } }),
    prisma.eventRegistration.create({ data: { event_id: events[1].id, user_id: users[0].id } }),
    prisma.eventRegistration.create({ data: { event_id: events[0].id, user_id: users[1].id } }),
    prisma.eventRegistration.create({ data: { event_id: events[2].id, user_id: users[1].id } }),
    prisma.eventRegistration.create({ data: { event_id: events[3].id, user_id: users[2].id } }),
    prisma.eventRegistration.create({ data: { event_id: events[1].id, user_id: users[3].id } }),
    prisma.eventRegistration.create({ data: { event_id: events[4].id, user_id: users[4].id } }),
    prisma.eventRegistration.create({ data: { event_id: events[0].id, user_id: users[4].id } }),
  ])
  console.log("Created event registrations")

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
