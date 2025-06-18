"use server"

import connectToDatabase from "@/lib/db/connection";
import {User} from "@/lib/db/models/user";

export default async function handleSignUp(email: string, password: string) {
  await connectToDatabase()

  const existingUser = await User.findOne({email: email})
  if (existingUser) {
    console.log("USER ALREADY EXISTS")
    return;
  }

  const newUser = await User.create({
    email,
    password: password,
    name: email.split("@")[0],
    isEmailVerified: true
  });

  try {
    await newUser.save();
  } catch (error) {
    console.log("Error saving the user: \n")
    console.error(error);
  }

  console.log("USER SAVED");

}