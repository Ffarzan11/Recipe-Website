require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');
const session = require('express-session');
const userModel = require('./database');
const MongoDBSession = require('connect-mongodb-session')(session);
const app = express();
const port = 3000;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
//creating session collection
const store = new MongoDBSession({
  uri: process.env.MONGO_URL,
  collection: 'session',
});

//session setup
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send('An error occurred!');
});

const home = require('./router/home');
const recipe = require('./router/recipe');
const favorite = require('./router/favorite');
const chatbot = require('./router/chatbot');
const login = require('./router/login');
const register = require('./router/register');
const logout = require('./router/logout');
const about = require('./router/AboutUs');

app.use('/', home);
app.use('/recipe', recipe);
app.use('/favorite', favorite);
app.use('/chatbot', chatbot);
app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);
app.use('/about', about);

//registering user and storing to db
app.post('/register', async (req, res) => {
  try {
    const data = {
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      userName: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };

    // Insert the new user into the database
    await userModel.create(data);
    res.status(200);
    res.redirect('/login');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('An error occurred while registering the user');
  }
});

//authetication and logging in user
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email }); // check if user exists in the database

    // If no user found, return error
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Check if the provided password matches the one stored in the database
    if (password !== user.password) {
      return res.status(401).send('Incorrect password');
    }

    //starting a session
    req.session.user = {
      id: user.id,
      username: user.userName,
      email: user.email,
    };
    res.status(200).send('Login successful');
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).send('Error logging in user');
  }
});

//Logout functionality
app.post('/logout', (req, res) => {
  //destroy the user session
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Logout error!');
    }
    res.status(200).send('Logout successful');
    // res.redirect('/'); // redirect to home page
  });
});
app.get('/check-login', (req, res) => {
  if (req.session && req.session.user) {
    // User is logged in, send response with loggedIn: true
    res.setHeader('Cache-Control', 'no-store');
    res.json({ loggedIn: true });
  } else {
    // User is not logged in, send response with loggedIn: false
    res.setHeader('Cache-Control', 'no-store');
    res.json({ loggedIn: false });
  }
});

app.get('/favoriteMeals', async (req, res) => {
  const userID = req.session.user.id;
  try {
    const user = await userModel.findById(userID);
    if (!user) {
      return res.status(404).send('User not found');
    }
    if (user.favorite) {
      res.json({
        hasFav: true,
        favorites: user.favorite,
      });
    } else {
      res.json({
        hasFav: false,
        favorites: 'no favorites',
      });
    }
  } catch (error) {
    console.log('error in getting favorites ' + error);
  }
});

app.post('/favorites', async (req, res) => {
  const { recipeId, recipeName, recipeImgSrc } = req.body;
  const userId = req.session.user.id;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (!user.favorite) {
      user.favorite = [];
    }
    const favoriteIndex = user.favorite.findIndex((fav) => fav.recipe === recipeName);

    if (favoriteIndex !== -1) {
      // If the recipe already exists in favorites, update its image, and id
      user.favorite[favoriteIndex].image = recipeImgSrc;
      user.favorite[favoriteIndex].id = recipeId;
    } else {
      // If the recipe doesn't exist in favorites, add it as a new object
      user.favorite.push({ id: recipeId, recipe: recipeName, image: recipeImgSrc });
    }
    await user.save();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.status(500).send('database error!');
  }
});

app.post('/deleteFavorite', async (req, res) => {
  const { recipeId } = req.body;
  const userId = req.session.user.id;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    const favoriteIndex = user.favorite.findIndex((fav) => fav.id === recipeId);
    if (favoriteIndex === -1) {
      return res.status(404).send('Favorite not found');
    }
    user.favorite.splice(favoriteIndex, 1);
    await user.save();
    return res.status(200).send('Favorite deleted successfully');
  } catch (err) {
    console.error(err);
    return res.status(500).send('database error!');
  }
});

app.post('/feedback', async (req, res) => {
  const { recipeName, feedback } = req.body;
  const userId = req.session.user.id;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    if (!user.feedback) {
      user.feedback = [];
    }
    const feedbackIndex = user.feedback.findIndex((feedback) => feedback.recipe === recipeName);
    if (feedbackIndex !== -1) {
      user.feedback[feedbackIndex].recipe_review = feedback;
    } else {
      user.feedback.push({ recipe: recipeName, recipe_review: feedback });
    }
    await user.save();
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.status(500).send('database error!');
  }
});

app.post('/generate', (req, res) => {
  const { role, userMessage } = req.body;
  console.log(userMessage);
  async function run() {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 500,
        },
      });
      const message = userMessage;
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();
      return res.status(200).json({ responseText: text });
    } catch (err) {
      console.error('Error in generating response:', err);
      return res.status(500).json({ error: 'Error generating response' });
    }
  }
  run();
});

app.listen(port, () => {
  console.log(`express listening on port ${port}`);
});
