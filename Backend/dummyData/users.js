import prisma from "../prisma/prismaClient.js";

async function main() {
  // Insert dummy users
  const users = [
    {
      id: "user-1",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "WORK",
      provider: "local",
      phoneNumber: "1234567890",
      bio: "Web developer",
      skills: ["1", "12"],
      location: "2",
      active: true,
      dob: new Date("1990-05-15"),
      languages: ["English"],
      experience: {},
      emailVerified: true,
      phoneNumberVerified: false,
    },
    {
      id: "user-2",
      name: "Bob Smith",
      email: "bob@example.com",
      role: "HIRE",
      provider: "google",
      phoneNumber: "2345678901",
      bio: "AI Expert",
      skills: ["2", "3"],
      location: "4",
      active: true,
      dob: new Date("1988-10-21"),
      languages: ["English", "French"],
      experience: {},
      emailVerified: true,
      phoneNumberVerified: true,
    },
    {
      id: "user-3",
      name: "Charlie Davis",
      email: "charlie@example.com",
      role: "WORK",
      provider: "local",
      phoneNumber: "3456789012",
      bio: "App Developer",
      skills: ["1", "3"],
      location: "2",
      active: true,
      dob: new Date("1995-07-11"),
      languages: ["English"],
      experience: {},
      emailVerified: false,
      phoneNumberVerified: false,
    },
    {
      id: "user-4",
      name: "David Lee",
      email: "david@example.com",
      role: "HIRE",
      provider: "local",
      phoneNumber: "4567890123",
      bio: "Software Engineer",
      skills: ["2", "3"],
      location: "1",
      active: true,
      dob: new Date("1992-03-25"),
      languages: ["English", "German"],
      experience: {},
      emailVerified: true,
      phoneNumberVerified: true,
    },
    {
      id: "user-5",
      name: "Emma Watson",
      email: "emma@example.com",
      role: "WORK",
      provider: "local",
      phoneNumber: "5678901234",
      bio: "Data Scientist",
      skills: ["3", "1", "19"],
      location: "2",
      active: true,
      dob: new Date("1993-09-14"),
      languages: ["English"],
      experience: {},
      emailVerified: true,
      phoneNumberVerified: false,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }

  console.log("Dummy users inserted successfully!");

}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
