const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const app = express();
const cors = require('cors');
const cron = require('node-cron');
const mongoURI = process.env.ATLAS_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection;

cron.schedule('0 0 * * *', routes.rainCheck); 
database.on('error', (error) => {
  console.log(error)
});

database.once('connected', () => {
  console.log('Database Connected');
});

app.use(cors());
app.use(express.json());

app.listen(4000, () => {
  console.log(`Example app listening on port ${4000}`)
});

app.use('/api', routes.router);
