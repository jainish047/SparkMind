import prisma from "../prisma/prismaClient.js";

async function main() {
  // Insert dummy human languages (including Indian regional languages)
  const languages = [
    // Global languages
    'English', 'Spanish', 'Mandarin', 'Hindi', 'French', 'Arabic', 'Bengali', 
    'Portuguese', 'Russian', 'Japanese', 'German', 'Korean', 'Italian', 'Turkish', 
    'Vietnamese', 'Tamil', 'Urdu', 'Persian', 'Polish', 'Dutch', 'Greek', 'Hebrew', 
    'Thai', 'Swedish', 'Czech', 'Hungarian', 'Romanian', 'Danish', 'Finnish', 
    'Norwegian', 'Ukrainian', 'Malay', 'Filipino', 'Swahili', 'Slovak', 'Bulgarian',

    // Indian regional languages
    'Assamese', 'Bengali', 'Bodo', 'Dogri', 'Gujarati', 'Hindi', 'Kannada', 
    'Kashmiri', 'Konkani', 'Maithili', 'Malayalam', 'Manipuri', 'Marathi', 'Nepali', 
    'Odia', 'Punjabi', 'Sanskrit', 'Santali', 'Sindhi', 'Tamil', 'Telugu', 'Urdu'
  ];

  await prisma.languages.createMany({
    data: languages.map(language => ({ name: language })),
    skipDuplicates: true  // Avoids errors if a language already exists
  });

  console.log('Dummy human languages (including Indian regional languages) inserted successfully!');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
