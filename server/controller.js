const express = require('express');
const postdb = require('./postgres/postdb.js');

module.exports = {
  getReviews: async (req, res) => {

    const data = await postdb.getReviews();
    console.log('req', req)
    res.send(
      {
        // product: 2,
        // page: 0,
        // count: 5,
        results: data.rows
      }
);
  },
}