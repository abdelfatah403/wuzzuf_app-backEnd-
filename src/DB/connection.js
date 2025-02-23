import mongoose from "mongoose";


const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    throw new Error("Connection failed!");
  }
};


export default connect;