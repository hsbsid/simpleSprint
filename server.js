const express = require('express');
const app = express();
const path = require('path');

//db
const connectDB = require('./config/db');
connectDB();

//bodyparser
app.use(express.json({ extended: false }));

//routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/boards', require('./routes/api/boards'));

//serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));
  app.get('*', (re, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

//start app on port 3000 (or production server port)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server started on ' + PORT));
