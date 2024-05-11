require('dotenv').config();
const mongo = require('mongoose');
const { default: mongoose } = require('mongoose');
const schema = mongo.Schema;
const MONGOURL = process.env.MONGO_URL;
mongo
  .connect(MONGOURL)
  .then(() => {
    console.log('db connected');
  })
  .catch((error) => {
    console.log(error);
  });

const userSchema = new schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  favorite: [
    {
      recipe: String,
      image: String,
    },
  ],
  feedback: [
    {
      recipe: String,
      recipe_review: String,
    },
  ],
});

const userModel = mongo.model('users', userSchema);
module.exports = userModel;
