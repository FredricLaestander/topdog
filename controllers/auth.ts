import { User } from "../models/user";

export async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ name, age });
  } catch (error) {}
}
