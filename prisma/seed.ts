import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding bounties...");

  // Clear existing bounties (optional - remove if you want to keep existing data)
  await prisma.bounty.deleteMany({});

  // Create 5 dummy bounties
  const bounties = await prisma.bounty.createMany({
    data: [
      {
        title: "Build Mobile App UI",
        company: "TechCorp Solutions",
        deadline: new Date("2025-01-15T23:59:59Z"),
        rewardXp: 150,
        rewardMoney: 75000,
        status: "OPEN",
      },
      {
        title: "Backend API Development",
        company: "StartUp Innovations",
        deadline: new Date("2025-01-20T23:59:59Z"),
        rewardXp: 200,
        rewardMoney: 100000,
        status: "OPEN",
      },
      {
        title: "Database Migration",
        company: "DataFlow Inc",
        deadline: new Date("2025-01-10T23:59:59Z"),
        rewardXp: 100,
        rewardMoney: 50000,
        status: "OPEN",
      },
      {
        title: "Security Audit",
        company: "SecureNet",
        deadline: new Date("2024-12-31T23:59:59Z"),
        rewardXp: 250,
        rewardMoney: 150000,
        status: "CLOSED",
      },
      {
        title: "UI/UX Redesign",
        company: "DesignHub",
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
