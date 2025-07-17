const mongoose = require('mongoose');

const connect_db = async () => {
  try {
    await  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('MongoDb connection successful')
  })
  } catch (error) {
    console.log('Error in MongoDb connection' + error);
  }
}

module.exports =  connect_db;