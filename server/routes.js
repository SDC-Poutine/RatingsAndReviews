const express = require('express');
const router = express.Router();
const controller = require('./controller.js')

router.get('/', controller.getReviews)

router.get('/meta', (req, res) => {
  res.send('gets all review meta');
})

router.post('/', (req, res) => {
  res.send('post a review');
})

router.put('/:review_id/helpful', (req, res) => {
  // router.put('/helpful', (req, res) => {
  res.send('mark review helpful');
})

router.put('/:review_id/report', (req, res) => {
  // router.put('/report', (req, res) => {
  res.send('report a review');
})

module.exports = router;

