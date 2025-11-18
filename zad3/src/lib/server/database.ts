import mongoose from "mongoose";
import { MONGO_URI } from "$env/static/private"
import { productModel } from "$lib/model/Product";
let isConnected = false;

export const connectMongo = async () => {
  if (isConnected) {
    console.log("Succesfully connected to mongodb")
  }

  try {
    await mongoose.connect(MONGO_URI)
    console.log("Succesfully connected to mongodb")
  } catch (e) {
    console.log("connection failed ", e);
    throw new Error("FAIL");
  }

}
