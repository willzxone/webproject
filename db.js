const mongoose = require("mongoose");
const config = require("./config");
const dbURL = config.db.uri;
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(‘MongoDB Atlas connected’);
  })
  .catch((err) => {
    console.error(`MongoDB Atlas connection error: ${err}`);
  });
const db = {};
db.mongoose = mongoose;
module.exports = db;