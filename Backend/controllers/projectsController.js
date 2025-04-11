import prisma from "../prisma/prismaClient.js";

async function filterProjects(req, res) {
  try {
    const {
      q,
      status,
      budget,
      skills,
      projectLocation,
      clientCountries,
      languages,
      sortBy,
      page = 0,
    } = req.query;

    console.log("req query->", req.query);

    const filters = {};

    // Search by title or description (case-insensitive)
    if (q) {
      filters.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    // Filter by status
    if (status) {
      filters.status = {
        in: status
          .split(",") // Split into an array
          .map((s) => s.trim().toUpperCase()) // Trim spaces & convert to uppercase
          .filter((s) => s !== ""),
      };
    }

    // Filter by budget range
    const min = Number(budget?.split("-")[0]);
    const max = Number(budget?.split("-")[1]);
    if (min && max && min <= max) {
      filters.AND = [];
      if (min) {
        filters.AND.push({ minBudget: { gte: min } });
      }
      if (max) {
        filters.AND.push({ maxBudget: { lte: max } });
      }
    }

    // Filter by required skills
    if (skills?.length) {
      filters.skillsRequired = { hasSome: skills.split(",") };
    }

    // Filter by project location (if applicable in your schema)
    //   if (projectLocation) {
    //     filters.projectLocation = projectLocation;
    //   }

    // Filter by client country
    if (clientCountries?.length) {
      filters.user = { country: { in: clientCountries.split(",") } };
    }

    // Filter by language (assuming user has a "languages" field)
    if (languages?.length) {
      filters.user = { languages: { hasSome: languages } };
    }

    // Sorting
    let orderBy = {};

    if (sortBy) {
      switch (sortBy) {
        case "oldest":
          orderBy = { createdAt: "asc" }; // Sort by oldest projects
          break;
        case "lowprice":
          orderBy = { minBudget: "asc" }; // Sort by lowest minimum budget
          break;
        case "highprice":
          orderBy = { minBudget: "desc" }; // Sort by highest minimum budget
          break;
        case "lowbids":
          orderBy = { bids: { _count: "asc" } }; // Sort by lowest number of bids
          break;
        case "highbids":
          orderBy = { bids: { _count: "desc" } }; // Sort by highest number of bids
          break;
        default:
          orderBy = { createdAt: "desc" }; // Default: Newest projects first
      }
    } else {
      orderBy = { createdAt: "desc" };
    }

    // Pagination
    const skip = Number(page) * Number(process.env.PROJECTSPERPAGE);
    const take = Number(process.env.PROJECTSPERPAGE);

    // Use prisma.$transaction() to fetch both total count and filtered projects in one query
    const [totalProjects, projects] = await prisma.$transaction([
      prisma.project.count({ where: filters }),
      prisma.project.findMany({
        where: filters,
        orderBy,
        skip,
        take,
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      }),
    ]);
    // Benefits of Using $transaction():
    // Single database lookup: Runs both queries (count and fetch) in one request, improving efficiency.
    // Consistency: Ensures both queries run with the same filter conditions.
    // Performance boost: Reduces the number of database queries from 2 to 1, reducing latency.

    console.log(`filtered ${totalProjects} projects->`);
    return res.status(200).send({
      message: "filtered projects",
      projects,
      totalPages:
        Number(totalProjects) / process.env.PROJECTSPERPAGE +
        (Number(totalProjects) % process.env.PROJECTSPERPAGE !== 0 ? 1 : 0),
    });
  } catch (error) {
    console.log("error in project filter->", error);
    return res
      .status(400)
      .send({ message: "project filter error from backend" });
  }
}

export async function assignProjectToFreelancer(projectId, freelancerId) {
  try {
    // 1. Validate project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // 2. Ensure project is not already assigned
    if (project.assignedTo) {
      throw new Error("Project is already assigned to a freelancer");
    }

    // 3. Validate freelancer existence
    const freelancer = await prisma.user.findUnique({
      where: { id: freelancerId },
    });

    if (!freelancer) {
      throw new Error("Freelancer not found");
    }

    // 4. Update project assignment
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        assignedTo: freelancerId,
        status: "IN_PROGRESS", // make sure enum is valid
      },
    });

    // Assume internal transaction: user -> platform
  // const paymentProcessed = true;

  // if (paymentProcessed) {
  //   await prisma.project.update({
  //     where: { id: projectId },
  //     data: { assignedTo: freelancerId },
  //   });
  //   return res.status(200).send({ message: "Freelancer assigned and payment done" });
  // }

    return updatedProject;
  } catch (error) {
    console.error("[assignProjectToFreelancer]", error);
    throw new Error(error.message || "Failed to assign project");
  }
}

export const postProject = async (req, res) => {
  try {
    const {
      projectName,
      description,
      minBudget,
      maxBudget,
      paymentMethod,
      skills,
      answers,
    } = req.body.details;

    // Assuming you get userId from JWT/auth middleware
    const userId = req.user?.id; // Or req.userId depending on your setup
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized, Login Again" });
    }

    console.log("Received Data:", {
      projectName,
      description,
      minBudget,
      maxBudget,
      paymentMethod,
      skills,
      answers,
    });

    if (
      !projectName ||
      !description ||
      !minBudget ||
      !maxBudget ||
      !paymentMethod ||
      !skills ||
      !answers ||
      (paymentMethod.toUpperCase() !== "FIXED" &&
        paymentMethod.toUpperCase() !== "HOURLY")
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // const [purpose, platform, inProjectPaymentMethod] = answers;

    const PURPOSE_Q = "What is the main purpose of the website?";
    const PLATFORM_Q = "Which platform do you want the site to be built on?";
    const PAYMENT_Q = "What payment methods do you need integrated?";

    const purpose = answers[PURPOSE_Q];
    const platform = answers[PLATFORM_Q];
    const inProjectPaymentMethod = answers[PAYMENT_Q];

    const newProject = await prisma.project.create({
      data: {
        userId,
        title: projectName,
        description,
        purpose,
        platform,
        inProjectPaymentMethod,
        minBudget: parseInt(minBudget),
        maxBudget: parseInt(maxBudget),
        paymentMethod: paymentMethod.toUpperCase(),
        skillsRequired: skills.map((skill) => String(skill.id)),
      },
    });

    return res
      .status(201)
      .json({ message: "Project created", project: newProject });
  } catch (error) {
    console.error("Create Project Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export async function getProjectDetails(req, res) {
  try {
    const projectId = req.params.projectId;
    const currentUserId = req.user?.id;

    if (!projectId) {
      return res.status(400).send({ message: "Project id is required" });
    }

    // 1. Fetch project with associated data
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        user: true, // project owner
        bids: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).send({ message: "Project not found" });
    }

    // 2. Check if current user bookmarked the project
    const bookmarkRecord = currentUserId
      ? await prisma.bookmark.findFirst({
          where: {
            userId: currentUserId,
            projectId: projectId,
          },
        })
      : null;

    const isBookmarked = !!bookmarkRecord;

    // 3. If project assigned, get the assigned freelancer's bid and their milestones
    let freelancerBid = null;
    let assignedMilestones = null;

    if (project.assignedTo) {
      freelancerBid = await prisma.bid.findFirst({
        where: {
          projectId,
          userId: project.assignedTo,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (freelancerBid?.milestones) {
        assignedMilestones = freelancerBid.milestones; // JSON field
      }
    }

    // 4. Final response
    return res.status(200).send({
      ...project,
      isBookmarked,
      freelancerBid,
      milestones:assignedMilestones, // ← JSON data from freelancer's bid
      message: "Project details fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching project details:", error);
    return res
      .status(500)
      .send({ message: "Error fetching project details", error });
  }
}

async function bidOnProject(req, res, next) {
  try {
    const { bidAmount, deliveryTime, proposal, milestoneDetails } = req.body;
    const { projectId } = req.params;
    const userId = req.user.id;

    if (!bidAmount || !proposal) {
      return res
        .status(400)
        .json({ error: "Bid amount and proposal are required." });
    }

    // Check if the project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found." });
    }

    const parsedMilestones =
      typeof milestoneDetails === "string"
        ? JSON.parse(milestoneDetails)
        : milestoneDetails;

    // Create the bid
    await prisma.bid.create({
      data: {
        projectId,
        userId,
        amount: Number(bidAmount),
        proposal,
        milestones: parsedMilestones,
        createdAt: new Date(),
      },
    });

    // Fetch all bids for the project
    const allBids = await prisma.bid.findMany({
      where: { projectId },
      select: { amount: true },
    });

    // Calculate total number of bids
    const totalBids = allBids.length;

    // Calculate the average bid amount
    const totalBidAmount = allBids.reduce((sum, bid) => sum + bid.amount, 0);
    const averageBidAmount = totalBids > 0 ? totalBidAmount / totalBids : 0;

    // Update project with new bid stats
    await prisma.project.update({
      where: { id: projectId },
      data: {
        noOfBids: totalBids,
        averageBidBudget: Math.round(averageBidAmount), // Rounding for clarity
      },
    });

    console.log(
      "Total Bids:",
      totalBids,
      "Average Bid Amount:",
      averageBidAmount
    );

    // Fetch and return updated bids
    const updatedBids = await prisma.bid.findMany({
      where: { projectId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      bids: updatedBids,
      message: "Bid posted successfully",
      noOfBids: totalBids,
      averageBidBudget: Math.round(averageBidAmount),
    });
  } catch (error) {
    console.error("Error posting bid:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}

export async function getMyProjects(req, res) {
  try {
    // Get the logged-in user id from req.user
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Find projects where the user is the creator (client)
    const projects = await prisma.project.findMany({
      where: { userId: userId },
      include: {
        user: true, // Client (project owner) details
        bids: true, // All bids on the project
        freelancer: true, // Freelancer details if assigned
      },
      orderBy: { createdAt: "desc" },
    });

    return res
      .status(200)
      .send({ projects, message: "Created projects fetched successfully" });
  } catch (error) {
    console.error("Error fetching created projects:", error);
    return res
      .status(500)
      .send({ message: "Error fetching created projects", error });
  }
}

export async function getAssignedProjects(req, res) {
  try {
    // Get the logged-in user id from req.user
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Find projects where the logged-in user is assigned as a freelancer.
    const projects = await prisma.project.findMany({
      where: { assignedTo: userId },
      include: {
        user: true, // Project owner details
        bids: true, // All bids on the project
        freelancer: true, // Freelancer details (should match logged-in user)
      },
      orderBy: { createdAt: "desc" },
    });

    return res
      .status(200)
      .send({ projects, message: "Assigned projects fetched successfully" });
  } catch (error) {
    console.error("Error fetching assigned projects:", error);
    return res
      .status(500)
      .send({ message: "Error fetching assigned projects", error });
  }
}

export { filterProjects, bidOnProject };
