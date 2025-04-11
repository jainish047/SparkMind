import prisma from "../prisma/prismaClient.js";

async function main() {
    const countries = [
        'United States', 'Canada', 'United Kingdom', 'India', 'Germany', 'France', 'Australia',
        'Brazil', 'Japan', 'China', 'Russia', 'South Korea', 'Italy', 'Mexico', 'Spain', 'Netherlands',
        'Switzerland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'New Zealand', 'Singapore', 'South Africa',
        'Argentina', 'Indonesia', 'Pakistan', 'Bangladesh', 'Turkey', 'Saudi Arabia', 'United Arab Emirates'
    ];

    await prisma.country.createMany({
        data: countries.map(country => ({ name: country })),
        skipDuplicates: true  // Avoids inserting duplicates
    });

    console.log('Countries inserted successfully!');
}

main()
    .catch((e) => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
