const express = require('express');
const reviews = require('./routes.js');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use('/reviews', reviews);

app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})