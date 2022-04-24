const express = require('express');
const router = express.Router();
const controller = require('./controller.js')

router.get('/', controller.getReviews)

router.get('/meta', controller.getMeta)

router.post('/', controller.postReview)

router.put('/:review_id/helpful', (req, res) => {
  // router.put('/helpful', (req, res) => {
  res.send('mark review helpful');
})

router.put('/:review_id/report', (req, res) => {
  // router.put('/report', (req, res) => {
  res.send('report a review');
})

module.exports = router;