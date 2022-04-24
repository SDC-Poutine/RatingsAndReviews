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
    res.send('gets all review meta');
  },
  postReview: async (req, res) => {
    const post = await postdb.postReview();
    res.send('post a review');
  }


}