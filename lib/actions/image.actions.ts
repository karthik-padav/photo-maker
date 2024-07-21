"use server";

import Image from "../models/image.model";
import User from "../models/user.model";
import { ObjectId } from "mongodb";

import { connectToDB } from "../mongoose";

export async function updateImage({
  imageURL,
  email,
}: {
  imageURL: string;
  email: string;
}) {
  try {
    await connectToDB();
    console.log({ imageURL, email }, "asdasdasd");
    const img = await Image.create({ email, imageURL });
    await User.findOneAndUpdate(
      { email },
      { $addToSet: { photos: img._id } },
      { new: true }
    );
  } catch (error: any) {
    console.log(error.message, "error.message");
    throw new Error(`Failed to create/update: ${error.message}`);
  }
}

export async function fetchImages({ imageIds }: { imageIds?: Array<string> }) {
  try {
    await connectToDB();
    let filter: { [key: string]: any } = {};
    if (imageIds?.length)
      filter["_id"] = { $in: imageIds.map((i: string) => new ObjectId(i)) };
    return await Image.find(filter);
  } catch (error) {
    console.error("Error fetching SVG:", error);
    throw error;
  }
}
