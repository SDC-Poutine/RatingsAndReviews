const express = require('express');
const postdb = require('./postgres/postdb.js');

module.exports = {
  getReviews: async (req, res) => {
    const data = await postdb.getReviews();
    res.send(data.rows);
  },
}