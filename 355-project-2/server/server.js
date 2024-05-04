require('dotenv').config();
const express = require('express');
const mongo = require('mongoose');

const app = express();
const port = 3000;
const schema = mongo.Schema;

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send('An error occurred!');
});

//database connection
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
  favorite: {
    type: Array,
    default: [],
  },
  feedback: [
    {
      recipe: String,
      recipe_review: String,
    },
  ],
});

const userModel = mongo.model('users', userSchema);

//testing db
app.get('/getUsers', async (req, res) => {
  const userdata = await userModel.find();
  res.json(userdata);
});

const home = require('./router/home');
const recipe = require('./router/recipe');
const favorite = require('./router/favorite');
const chatbot = require('./router/chatbot');
const login = require('./router/login');
const register = require('./router/register');
const { default: mongoose } = require('mongoose');

app.use('/', home);
app.use('/recipe', recipe);
app.use('/favorite', favorite);
app.use('/chatbot', chatbot);
app.use('/login', login);
app.use('/register', register);

app.listen(port, () => {
  console.log(`express listening on port ${port}`);
});
