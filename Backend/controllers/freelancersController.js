import prisma from "../prisma/prismaClient.js";

async function filterFreelancers(req, res) {
  try {
    const { q, rating, skills, country, languages, sortBy, page = 0 } = req.query;

    console.log("req query->", req.query);

    const filters = {};

    // Search by name or bio (case-insensitive)
    if (q) {
      filters.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { bio: { contains: q, mode: "insensitive" } },
      ];
    }

    // Filter by rating (greater than given value)
    if (rating) {
      const minRating = Number(rating);
      if (!isNaN(minRating)) {
        filters.rating = { gte: minRating };
      }
    }

    // Filter by required skills
    if (skills?.length) {
      filters.skills = { hasSome: skills.split(",") };
    }

    // Filter by country
    if (country?.length) {
      filters.country = { in: country.split(",") };
    }

    // Filter by languages spoken
    if (languages?.length) {
      filters.languages = { hasSome: languages.split(",") };
    }

    // Sorting
    let orderBy = {};
    if (sortBy) {
      switch (sortBy) {
        case "highestRated":
          orderBy = { rating: "desc" };
          break;
        case "lowestRated":
          orderBy = { rating: "asc" };
          break;
        case "newest":
          orderBy = { createdAt: "desc" };
          break;
        case "oldest":
          orderBy = { createdAt: "asc" };
          break;
        default:
          orderBy = { rating: "desc" }; // Default: Highest rated first
      }
    } else {
      orderBy = { rating: "desc" };
    }

    // Pagination
    const skip = Number(page) * Number(process.env.FREELANCERSPERPAGE);
    const take = Number(process.env.FREELANCERSPERPAGE);

    // Fetch total count and filtered freelancers using a transaction
    const [totalFreelancers, freelancers] = await prisma.$transaction([
      prisma.user.count({ where: filters }),
      prisma.user.findMany({
        where: filters,
        orderBy,
        skip,
        take,
        select: {
          id: true,
          name: true,
          profilePic: true,
          location: true,
          rating: true,
          bio: true,
          skills: true,
          country: true,
          languages: true,
        },
      }),
      
    ]);

    console.log(`filtered ${totalFreelancers} freelancers->`);
    return res.status(200).send({
      message: "filtered freelancers",
      freelancers,
      totalPages:
        Math.ceil(Number(totalFreelancers) / process.env.FREELANCERSPERPAGE),
    });
  } catch (error) {
    console.log("error in freelancer filter->", error);
    return res
      .status(400)
      .send({ message: "freelancer filter error from backend" });
  }
}


export {
    filterFreelancers
};
