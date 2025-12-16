import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.bountyAssignment.deleteMany({});
  await prisma.bounty.deleteMany({});
  await prisma.company.deleteMany({});

  // Hash the password properly
  const hashedPassword = await bcrypt.hash("company123", 10);

  // Create companies
  const companies = await prisma.company.createMany({
    data: [
      {
        name: "TechCorp Solutions",
        email: "contact@techcorp.com",
        password: hashedPassword,
        description: "Leading technology solutions provider",
      },
      {
        name: "StartUp Innovations",
        email: "hello@startup.com",
        password: hashedPassword,
        description: "Innovative startup building the future",
      },
      {
        name: "DataFlow Inc",
        email: "info@dataflow.com",
        password: hashedPassword,
        description: "Data management and analytics company",
      },
      {
        name: "SecureNet",
        email: "security@securenet.com",
        password: hashedPassword,
        description: "Cybersecurity and network security experts",
      },
      {
        name: "DesignHub",
        email: "creative@designhub.com",
        password: hashedPassword,
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
}

main()
  .catch((e) => {
    console.error("Error seeding bounties:", e);
  })
  .then(async () => {
    await prisma.$disconnect();
  });
