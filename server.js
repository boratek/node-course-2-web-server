const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

// Partials
hbs.registerPartials(__dirname + '/views/partials');

// Helpers
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// Templates
app.set('view engine', 'hbs');


// Middleware
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} | ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log');
    }
  });

  next();
});

// Middleware for maintenance mode
// Uncomment to enable maintenance mode
// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     pageTitle: 'Maintenance Page',
//     currentYear: new Date().getFullYear()
//   });
// });

// Static templates
app.use(express.static(__dirname + '/public'));

// Routing
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Hello Express and Hbs!',
    currentYear: new Date().getFullYear()
  });
});

app.get('/alice', (req, res) => {
  res.send({
    name: 'Alice',
    likes: ['art', 'trees', 'rabbits']
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    currentYear: new Date().getFullYear()
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Can not handle request'
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
