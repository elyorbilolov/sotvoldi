const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/userModel");
const Poster = require("./models/posterModel");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const posters = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/posters.json`, "utf-8")
);

const importDate = async () => {
  try {
    await User.create(users);
    await Poster.create(posters);

    console.log("Data imported to DB...");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Poster.deleteMany();

    console.log("Data deleted...");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importDate();
} else if (process.argv[2] === "-d") {
  deleteData();
}
