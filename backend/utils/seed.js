import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const users = [
  {
    name: "Admin User",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Sayyam User",
    email: "sayyam@gmail.com",
    password: "user123",
    role: "member"
  },
  {
    name: "Gaurav Sharma",
    email: "gaurav@gmail.com",
    password: "user123",
    role: "member"
  },
  {
    name: "Utkarsh Singh",
    email: "utkarsh@gmail.com",
    password: "user123",
    role: "member"
  },
  {
    name: "Arjun Verma",
    email: "arjun@gmail.com",
    password: "user123",
    role: "member"
  }
];

async function seed() {
  const uri = process.env.MONGO_URI || "";
  if (!uri) {
    throw new Error("MONGO_URI is missing");
  }

  await mongoose.connect(uri);

  for (const user of users) {
    const existing = await User.findOne({ email: user.email });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await User.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role
      });
      console.log(`Created ${user.role}: ${user.email}`);
    } else {
      console.log(`Skipped existing user: ${user.email}`);
    }
  }

  await mongoose.disconnect();
  console.log("Seed complete");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
