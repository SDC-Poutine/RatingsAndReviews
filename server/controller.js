const express = require('express');
const postdb = require('./postgres/postdb.js');

module.exports = {
  getReviews: async (req, res) => {
    const page = +req.query.page;
    const count = +req.query.count;
    const sort = req.query.sort;
    const product_id = +req.query.product_id;

    const data = await postdb.getReviews(page, count, sort, product_id);
    console.log('req.body', req.body)
    console.log('req.params', req.params)
    console.log('req.query', req.query)
    res.send(
      {
        // product: 2,
        // page: 0,
        // count: 5,
        product: product_id,
        count: count,
        sort: sort,
        results: data.rows
      }
    );
  },
}