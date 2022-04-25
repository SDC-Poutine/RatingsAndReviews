const express = require('express');
const postdb = require('./postgres/postdb.js');

module.exports = {
  getReviews: async (req, res) => {
    const page = +req.query.page || 0;
    const count = +req.query.count || 5;
    const sort = req.query.sort;
    const product_id = req.query.product_id;

    const data = await postdb.getReviews(page, count, sort, product_id);
    res.send(
      {
        product: product_id,
        page: page,
        count: count,
        sort: sort,
        results: data.rows
      }
    );
  },

  getMeta: async (req, res) => {
    const product_id = req.query.product_id;

    const data = await postdb.getMeta(product_id);
    res.send(data.rows[0].meta);
  },

  postReview: async (req, res) => {
    console.log('req.body', req.body)
    const post = await postdb.postReview();
    res.send('post a review');
  },

  putHelpful: async (req, res) => {
    const review_id = req.params.review_id;
    const data = await postdb.putHelpful(review_id);
    res.send('Review marked helpful!')
  },

  putReport: async (req, res) => {
    const review_id = req.params.review_id;
    const data = await postdb.putReport(review_id);
    res.send('Review reported!')
  }
}