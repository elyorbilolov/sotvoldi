const mongoose = require("mongoose");

const connectDB = async () => {
  const connecting = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB connect to: ${connecting.connection.host}`);
};

module.exports = connectDB;
