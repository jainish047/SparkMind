import prisma from "../prisma/prismaClient.js";

async function main() {
  // Insert dummy projects
  const projects = [
    {
      userId: "user-1",
      title: "E-commerce Website Development",
      description: "A full-stack e-commerce website using React and Node.js.",
      minBudget: 500,
      maxBudget: 1500,
      status: "OPEN",
      dueDate: new Date("2025-05-15"),
      documents: ["https://example.com/specs.pdf"],
      skillsRequired: ["React", "Node.js", "MongoDB"],
      paymentMethod: "FIXED",
    },
    {
      userId: "user-2",
      title: "AI Chatbot for Customer Support",
      description: "An AI-powered chatbot to handle customer queries.",
      minBudget: 1000,
      maxBudget: 3000,
      status: "OPEN",
      dueDate: new Date("2025-06-20"),
      documents: ["https://example.com/chatbot-requirements.pdf"],
      skillsRequired: ["Python", "TensorFlow", "NLP"],
      paymentMethod: "FIXED",
    },
    {
      userId: "user-3",
      title: "Mobile App for Freelancers",
      description:
        "A cross-platform mobile app to connect freelancers with clients.",
      minBudget: 800,
      maxBudget: 2500,
      status: "OPEN",
      dueDate: new Date("2025-07-10"),
      documents: ["https://example.com/app-design.pdf"],
      skillsRequired: ["Flutter", "Firebase", "Dart"],
      paymentMethod: "FIXED",
    },
    {
      userId: "user-4",
      title: "Enterprise CRM System",
      description: "A robust CRM system for large enterprises.",
      minBudget: 2000,
      maxBudget: 5000,
      status: "OPEN",
      dueDate: new Date("2025-08-30"),
      documents: ["https://example.com/crm-requirements.pdf"],
      skillsRequired: ["Java", "Spring Boot", "PostgreSQL"],
      paymentMethod: "FIXED",
    },
    {
      userId: "user-5",
      title: "Data Analytics Dashboard",
      description: "A web-based dashboard for visualizing business analytics.",
      minBudget: 1500,
      maxBudget: 4000,
      status: "OPEN",
      dueDate: new Date("2025-09-20"),
      documents: ["https://example.com/analytics-dashboard.pdf"],
      skillsRequired: ["Python", "Django", "Tableau"],
      paymentMethod: "FIXED",
    },
  ];

  // Insert projects into database
  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  console.log("Dummy projects inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
