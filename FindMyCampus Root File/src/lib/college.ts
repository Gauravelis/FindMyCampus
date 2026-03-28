import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  // add your fields here
});

export const College =
  mongoose.models.College || mongoose.model("College", CollegeSchema);