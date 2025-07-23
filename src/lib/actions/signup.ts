"use server";

import connectToDatabase from "@/lib/db/connection";
import { User } from "@/lib/db/models/user";

export async function handleSignUp(email: string, password: string) {
  await connectToDatabase();

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    console.log("USER ALREADY EXISTS");
    return;
  }

  const newUser = await User.create({
    email,
    password: password,
    name: email.split("@")[0],
    isEmailVerified: true,
    avatar:
      "https://res.cloudinary.com/theowl/image/upload/w_256,h_256,c_fill/13d292bb-a2ba-4a89-9f85-ededeb790bc1.png",
  });

  try {
    await newUser.save();
  } catch (error) {
    console.log("Error saving the user: \n");
    console.error(error);
  }

  console.log("USER SAVED");
}