import prisma from "../prisma/prismaClient.js";

async function main() {
  // Insert dummy users
  const skills = [
    'React', 'Node.js', 'MongoDB', 'Python', 'TensorFlow', 'NLP', 'Flutter', 'Dart', 'Firebase',
    'Angular', 'Vue.js', 'Java', 'Spring Boot', 'Kotlin', 'Swift', 'Machine Learning',
    'Deep Learning', 'Data Science', 'SQL', 'PostgreSQL', 'MySQL', 'GraphQL', 'Docker',
    'Kubernetes', 'AWS', 'Azure', 'Google Cloud', 'Cybersecurity', 'Blockchain',
    'Rust', 'Go', 'C++', 'C#', 'PHP', 'Laravel', 'Django', 'FastAPI', 'Ruby on Rails',
    'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap'
];

await prisma.skills.createMany({
    data: skills.map(skill => ({ name: skill })),
    skipDuplicates: true  // Avoids errors if skill already exists
});

console.log('Dummy skills inserted successfully!');

}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
