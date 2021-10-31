const express = require('express');
const app = express();

//db
const connectDB = require('./config/db');
connectDB();

//bodyparser
app.use(express.json({ extended: false }));

//routes
app.get('/', (req, res) => {
  res.send('Welcome to my server');
});

app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));

//start app on port 3000 (or prod server port)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server started on ' + PORT));
