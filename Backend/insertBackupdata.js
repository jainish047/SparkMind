// importData.js
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importData() {
  try {
    const backup = JSON.parse(fs.readFileSync('backup.json', 'utf-8'));

    // 1. Insert standalone data first (no foreign keys)
    if (backup.skills.length > 0) {
      await prisma.skills.createMany({ data: backup.skills });
      console.log('Skills imported');
    }
    if (backup.countries.length > 0) {
      await prisma.country.createMany({ data: backup.countries });
      console.log('Countries imported');
    }
    if (backup.languages.length > 0) {
      await prisma.languages.createMany({ data: backup.languages });
      console.log('Languages imported');
    }

    // 2. Insert Users (no dependencies)
    if (backup.users.length > 0) {
      await prisma.user.createMany({ data: backup.users });
      console.log('Users imported');
    }

    // 3. Insert Projects (depends on users)
    if (backup.projects.length > 0) {
      await prisma.project.createMany({ data: backup.projects });
      console.log('Projects imported');
    }

    // 4. Insert Lists (depends on users)
    if (backup.lists.length > 0) {
      await prisma.list.createMany({ data: backup.lists });
      console.log('Lists imported');
    }

    // 5. Insert Bids (depends on projects and users)
    if (backup.bids.length > 0) {
      await prisma.bid.createMany({ data: backup.bids });
      console.log('Bids imported');
    }

    // 6. Insert Likes (depends on projects and users)
    if (backup.likes.length > 0) {
      await prisma.like.createMany({ data: backup.likes });
      console.log('Likes imported');
    }

    // 7. Insert Bookmarks (depends on projects and users)
    if (backup.bookmarks.length > 0) {
      await prisma.bookmark.createMany({ data: backup.bookmarks });
      console.log('Bookmarks imported');
    }

    // 8. Insert ListItems (depends on lists, and optionally projects and users)
    if (backup.listItems.length > 0) {
      await prisma.listItem.createMany({ data: backup.listItems });
      console.log('ListItems imported');
    }

    console.log('Data re-imported successfully.');
  } catch (err) {
    console.error('Error during import:', err);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
