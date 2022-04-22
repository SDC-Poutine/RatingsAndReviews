const express = require('express');
const reviews = require('./routes.js');
const app = express();
const port = 3000;



// app.get('/', (req, res) => {
//   res.send('In server')
// })

app.use('/reviews', reviews);

app.listen(port, () => {
  console.log(`listening on port: ${port}`)
})