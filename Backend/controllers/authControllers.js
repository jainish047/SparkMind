import prisma from "../prisma/prismaClient.js";
import { UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

const sendVerificationEmail = async (email, role, res) => {
  console.log("in sendVerificationEMail function");
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can use your email provider
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  const token = jwt.sign({ email, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  const verificationUrl = `${process.env.FRONTEND_URL}/verify/verify-email?token=${token}`;

  try {
    await transporter.sendMail({
      from: '"P4" <no-reply@example.com>',
      to: email,
      subject: "Email Verification",
      html: `
            <p>Hello ${email},</p>
            <p>Thank you for registering! Please verify your email by clicking the link below:</p>
            <a href="${verificationUrl}">Verify Email</a><br>
            <a>${verificationUrl}</a>
            <p>The link will expire in 1 hour.</p>
          `,
    });

    console.log("email sent to ", email);
    return res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    console.log("error sending verification email: ", error);
    return res
      .status(400)
      .send({ message: "Error sending verification email" });
  }
};

export async function signup(req, res) {
  try {
    console.log(req.body);
    const { email, password, role } = req.body;

    console.log(email, " tried to signup");

    // empty fields
    if (!email || !password || email === "" || password === "") {
      console.log("Invalid email or password");
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }],
      },
    });
    console.log("existing user:->", existingUser);

    if (existingUser) {
      console.log("already exist");
      return res
        .status(409)
        .send({ message: "Email/Company name already exists" });
    }

    let userRole;
    if (role === "WORK") {
      userRole = UserRole.WORK;
    } else if (role === "HIRE") {
      userRole = UserRole.HIRE;
    } else {
      console.log("Invalid role");
      return res.status(400).send({ message: "Invalid role provided" });
    }

    // Save new user to the database
    let newUser;
    try {
      newUser = await prisma.user.create({
        data: {
          email,
          password: await bcrypt.hash(
            password,
            parseInt(process.env.SALT_ROUNDS, 10)
          ),
          role: userRole,
        },
      });
    } catch (err) {
      console.log("error creating user->", err);
    }

    console.log("newUser:->", newUser);

    if (!newUser)
      return res.status(400).send({ message: "User could not be created" });

    sendVerificationEmail(email, role, res);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: "Something went wrong" });
  }
  //   return res.status(201).send({ message: "User created successfully", user: newUser });
}

export async function verifyEmail(req, res) {
  const { token } = req.body;

  console.log("token: ", token);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Decode the token
    const { email, role } = decoded;

    console.log(email, " ", role, "is verifying");

    const user = await prisma.user.findUnique({
      where: { email: email },
      select: {
        email: true,
        emailVerified: true,
      },
    });
    if (!user) return res.status(404).send("User not found");

    // Mark the user as verified
    await prisma.user.update({
      where: { email: email },
      data: { emailVerified: true },
    });

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(400).json({
        message: "Verification link expired. Please request a new one.",
      });
    } else {
      res.status(400).json({ message: "Invalid token." });
    }
  }
}

export async function resendVerificationEMail(req, res) {
  const { email, role } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      email: true,
      emailVerified: true,
    },
  });
  if (user) return res.status(404).send({ message: "User not found" });

  if (user.emailVerified)
    return res.status(400).json({ message: "Email is already verified." });

  sendVerificationEmail(email, res);
}

export async function login(req, res) {
  // first authenticate email and password
  const { email, password, role } = req.body;
  console.log("email:", email);
  console.log("password:", password);
  if (!email || !password)
    return res.status(401).send({ message: "Invalid credentials" });

  // user-data from client
  const user = {
    email,
    password,
    role,
  };

  const dbuser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!dbuser || !dbuser.password)
    return res.status(404).send({ message: "No such user exist" });

  console.log(user.email, "tried to login");

  if (dbuser === null)
    return res.status(404).send({ message: "No such user exist" });
  if (!bcrypt.compare(password, dbuser.password))
    return res.status(400).send({ message: "Invalid password" });
  if (!dbuser.emailVerified)
    return res.status(403).send({ message: "Please verify your email" });

  // generating access token
  const accessToken = jwt.sign(
    { email, role, id: dbuser.id },
    process.env.ACCESS_TOKEN_SECRET
  );
  return res
    .cookie("token", accessToken, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "strict", // Prevent CSRF
    })
    .json({ user: dbuser, token: accessToken, message: "Token assigned" });
}

export async function forgotPWEmail(req, res) {
  try {
    const { email } = req.body;
    console.log("email: ", email);
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // send email
    console.log("in sendPWforgot email function");
    const transporter = nodemailer.createTransport({
      service: "gmail", // You can use your email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    const token = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    const resetPWURL = `${process.env.FRONTEND_URL}/verify/setpassword?token=${token}`;

    try {
      await transporter.sendMail({
        from: '"P4" <no-reply@example.com>',
        to: email,
        subject: "Password Reset",
        html: `
            <p>Hello ${email},</p>
            <p>Please click button reset password:</p>
            <a href="${resetPWURL}"><button>Reset Password</button></a><br>
            <a>${resetPWURL}</a>
            <p>The link will expire in 1 hour.</p>
          `,
      });

      console.log("email sent to ", email);
      return res.status(200).send({ message: "Reset Password email sent" });
    } catch (error) {
      console.log("error sending reset pw email: ", error);
      return res
        .status(400)
        .send({ message: "Error sending reset pw email" });
    }
  } catch (err) {
    console.log("error in forgotPWEmail: ", err);
    return res.status(400).send({ message: "Something went wrong" });
  }
}

export async function resetPassword(req, res) {
  try{
    const {password, token} = req.body;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { email } = decoded;
    console.log("email: ", email);
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS, 10)
    );
    // update password
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
      },
    });
    console.log("password updated");
    return res.status(200).send({ message: "Password updated successfully" });
  }catch(err){
    console.log("error in reset password: ", err);
    return res.status(400).send({ message: "Something went in reseting password" });
  }
}

export async function setPassword(req, res) {
  try{
    const email = req.user.email;
    const {currentPassword, newPassword} = req.body;
    console.log("email: ", email);
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    if (!currentPassword || !newPassword) {
      console.log("Invalid current password or new password");
      return res.status(400).send({ message: "Invalid current password or new password" });
    }
    // check if current password is correct
    const currentPasswordHash = user.password;
    const isMatch = await bcrypt.compare(currentPassword, currentPasswordHash);
    if (!isMatch) {
      console.log("Invalid current password");
      return res.status(400).send({ message: "Invalid current password" });
    }
    if(newPassword === currentPassword) {
      return res.status(400).send({ message: "New password cannot be same as current password" });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.SALT_ROUNDS, 10)
    );
    // update password
    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: hashedPassword,
      },
    });
    console.log("password updated");
    return res.status(200).send({ message: "Password updated successfully" });
  }catch(err){
    console.log("error in set password: ", err);
    return res.status(400).send({ message: "Something went wrong in seting password" });
  }
}

export const loginGoogle = (req, res) => {
  console.log("in google login: ", req.user.id);
  // ✅ Generate JWT Token for the user
  const token = jwt.sign(
    { id: req.user.id, email: req.user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" } // Token expires in 1 hr
  );
  // Set token in HTTP-only cookie
  res.cookie("authToken", token, {
    httpOnly: true, // Prevents access via JavaScript
    secure: process.env.NODE_ENV === "production", // Set secure flag in production (HTTPS)
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expires in 7 days (milliseconds)
    sameSite: "lax", // Adjust as needed for cross-site requests
  });

  // Redirect to the frontend without the token in the URL
  res.redirect(process.env.FRONTEND_URL);
};

export const getMe = (req, res) => {
  const token = req.cookies.authToken; // Get the token from the cookie

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    res.json({ user: decoded, token });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// how to implement JWT refresh tokens
