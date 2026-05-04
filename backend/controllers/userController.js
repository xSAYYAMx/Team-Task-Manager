import User from "../models/User.js";

export async function getUsers(_req, res) {
  const users = await User.find().select("name email role");
  res.json(users);
}
