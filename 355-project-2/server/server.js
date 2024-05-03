const express = require('express');
const app = express();

const port = 3000;

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

app.use('/', home);
app.use('/recipe', recipe);
app.use('/favorite', favorite);
app.use('/chatbot', chatbot);
app.use('/login', login);
app.use('/register', register);


app.listen(port, () => {
  console.log(`express listening on port ${port}`);
});
