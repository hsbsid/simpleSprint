const mongoose = require('mongoose');
const config = require('config');

const mongoURI = config.get('mongoURI');

const connectDB = async () => {
  try {
    //attempt connection to db
    await mongoose.connect(mongoURI);

    console.log('Connected to database..');
  } catch (err) {
    //log the error
    console.log('Could not connect to database:');
    console.log(err);

    //exit the process
    process.exit(1);
  }
};

module.exports = connectDB;
