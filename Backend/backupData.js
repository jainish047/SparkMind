// backupData.js
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function backupData() {
  try {
    const users = await prisma.user.findMany();
    const projects = await prisma.project.findMany();
    const bids = await prisma.bid.findMany();
    const likes = await prisma.like.findMany();
    const bookmarks = await prisma.bookmark.findMany();
    const lists = await prisma.list.findMany();
    const listItems = await prisma.listItem.findMany();
    const skills = await prisma.skills.findMany();
    const countries = await prisma.country.findMany();
    const languages = await prisma.languages.findMany();

    const backup = {
      users,
      projects,
      bids,
      likes,
      bookmarks,
      lists,
      listItems,
      skills,
      countries,
      languages,
    };

    fs.writeFileSync('backup.json', JSON.stringify(backup, null, 2));
    console.log('Backup completed and saved as backup.json');
  } catch (err) {
    console.error('Error during backup:', err);
  } finally {
    await prisma.$disconnect();
  }
}

backupData();
