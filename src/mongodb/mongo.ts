import "dotenv/config";
import { connect } from "mongoose";

const connectToDB = async () => {
  connect(process.env.MONGO_URI!);
};

export default connectToDB;
