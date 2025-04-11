import prisma from "../prisma/prismaClient.js";

export function fetchSkills(req, res) {
  prisma.skills.findMany().then((skills) => {
    res.json({ skills });
  });
}

export function fetchCountries(req, res) {
  prisma.country.findMany().then((countries) => {
    res.json({ countries });
  });
}

export function fetchLanguages(req, res) {
  prisma.languages.findMany().then((languages) => {
    res.json({ languages });
  });
}