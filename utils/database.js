import mongoose from "mongoose";

let isConnected = false; // track connection status

export const connectDB = async () => {
  mongoose.set("strictQuery", true); // sets mongoose options

  // check connection
  if (isConnected) {
    console.log("MongoDB is already Connected");
    return;
  }

  // try connecting
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "share_prompt",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // flip flag to true
    isConnected = true;
    console.log("MongoDB Connected!");
  } catch (error) {
    console.log(error);
  }
};
