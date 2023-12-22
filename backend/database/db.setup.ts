import mongoose from "mongoose";
const { MONGO_URI } = process.env;
if (!MONGO_URI)
    throw new Error("MONGO_URI not defined");
mongoose.connect(MONGO_URI);