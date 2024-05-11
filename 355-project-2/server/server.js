require('dotenv').config();
const express = require('express');
const session = require('express-session');
const userModel = require('./database');
const MongoDBSession = require('connect-mongodb-session')(session);
const app = express();
const port = 3000;

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

app.use('/', home);
app.use('/recipe', recipe);
app.use('/favorite', favorite);
app.use('/chatbot', chatbot);
app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);

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

    // Redirect the user back to the homepage
    //res.redirect('/login');
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
    res.status(200);
    res.redirect('/'); // redirect to home page
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

app.listen(port, () => {
  console.log(`express listening on port ${port}`);
});
