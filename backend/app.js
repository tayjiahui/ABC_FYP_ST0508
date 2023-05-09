// includes
const express = require('express');
const cors = require('cors');
const path = require('path');

// init
const app = express();
const PORT = process.env.PORT || 3000;

// setup app
app.use(cors());
app.use(express.json());

// set up for frontend
// app.use("/", express.static('../frontend/public'));
// app.use("/", express.static('../frontend-react/build'));

// for multer in case
// makes image file public
// app.use('/images', express.static('images'));

// display server running
app.get('/', (req, res) => {
  res.send(`Server running on port ${PORT}`)
});

// setting main routes
const mainRoutes = require('./routes/mainRoutes');
app.use('/api', mainRoutes);

// route for react
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname + '../../../frontend-react/build/index.html'))
// });

// 404 handler
app.use((req, res, next) => {
  res.status(404).send({ "error": "Sorry can't find that!" })
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ error: err.message });
});


module.exports = app;