const express = require('express');
const router = express.Router();
const controller = require('./controller.js')

router.get('/', controller.getReviews)

router.get('/meta', controller.getMeta)

router.post('/', controller.postReview)

router.put('/:review_id/helpful', controller.putHelpful)

router.put('/:review_id/report', controller.putReport)

module.exports = router;