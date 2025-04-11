import prisma from "../prisma/prismaClient.js";
import jwt from "jsonwebtoken";

const person = {
  developer: "Developer",
  employer: "Employer",
  type: {
    individual: "Individual",
    organization: "Organization",
  },
};

function getTable(role, type) {
  if (role === person.developer) {
    return prisma.developer;
  } else if (role === person.employer && type === person.type.individual) {
    return prisma.clientIndividual;
  } else if (role === person.employer && type === person.type.organization) {
    return prisma.clientOrganization;
  }
  return false;
}

function exist(email, table) {
  return table.findUnique({
    where: { email: email },
    select: {
      email: true,
      emailVerified: true,
    },
  });
}

export async function getUserIfThere(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("authHeader:", authHeader)

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }
  
  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer "
  console.log("token:", token)

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify token
    req.user = decoded; // Attach decoded user data to request
    console.log("decoded user:->", req.user)
    return next(); // Proceed to next middleware
  } catch (error) {
    console.log("error getting current user from token and header");
    return next()
  }
}

export { person, getTable, exist };
