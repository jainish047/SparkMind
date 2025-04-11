import prisma from "../prisma/prismaClient.js";
import { getTable, exist } from "../common/user.js";
import { uploadFile } from "../common/cloudinary.js";

async function selfDetails(req, res) {
  const user = req.user;

  if (!user) return res.status(404).send({ message: "User not found" });

  // const existingUser = await prisma.user.findUnique({
  //   where: {
  //     email: user.email,
  //   },
  // });
  // no need to do this bcz if user exist, jwt strategy has alreacy extracted details

  console.log("existingUser->", user);

  return res.status(200).send(user);
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is extracted from JWT middleware
    console.log("updating user profile of user:->", userId);

    const { name, phoneNumber, bio, skills, location, country, dob } = req.body;

    console.log(
      "gotten details to update: =>",
      name,
      phoneNumber,
      bio,
      skills,
      location,
      country,
      dob
    );
    console.log(req.body)

    // Convert skills (comma-separated) into an array if needed
    const skillsArray = skills
      ? skills.split(",").map((skill) => skill.trim())
      : [];

    let profilePicUrl = null;
    if (req.file) {
      profilePicUrl = await uploadFile(req.file.path); // Upload and get URL
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phoneNumber,
        bio,
        skills: skillsArray,
        location,
        country,
        dob: dob ? new Date(dob) : null,
        profilePic: profilePicUrl || undefined,
        profileComplete: true, // Set profile as complete if user updates
      },
    });

    console.log("sending user to frontend:->", updatedUser)

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export async function userDetails(req, res) {
  try {
    console.log("fetching user in user details");
    const userId = req.params.id;
    const currentUserId = req.user?.id; // Logged-in user ID

    console.log("userId:", userId);
    console.log("currentUserId:", currentUserId);

    if (!userId)
      return res.status(400).send({ message: "User id is required" });

    console.log("finding user with id:", userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return res.status(404).send({ message: "User not found" });

    // Check if the current user is following the requested user
    const followRecord = currentUserId
      ? await prisma.follow.findFirst({
          where: {
            followerId: currentUserId,
            followingId: userId,
          },
        })
      : false;

    // Set isFollowing to true if a follow record exists, otherwise false.
    const isFollowing = !!followRecord;

    console.log("found profile:->", user);
    console.log("isFollowing:->", isFollowing);

    // Return the user details along with the isFollowing property.
    return res.status(200).send({ ...user, isFollowing });
  } catch (error) {
    console.log("error fetching user details:", error);
    return res
      .status(500)
      .send({ message: "Error fetching user details", error });
  }
}

export { selfDetails };
