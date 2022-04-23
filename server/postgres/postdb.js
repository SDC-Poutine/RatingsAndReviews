const { Pool, Client } = require('pg');
require('dotenv').config();

const credentials = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
};

const pool = new Pool(credentials)
pool.connect();

module.exports = {
  getReviews: async () => {
    return await
      pool.query(
`    SELECT reviews.id AS review_id,
        reviews.rating,
        reviews.summary,
        reviews.recommend,
        reviews.response,
        reviews.body,
        reviews.date,
        reviews.reviewer_name,
        reviews.helpfulness,
        COALESCE(
          JSON_agg(
            json_build_object(
              'id',
              reviews_photos.id,
              'url',
              reviews_photos.url
            )
      ORDER BY reviews_photos.id
          ) FILTER(
            WHERE reviews_photos.id IS NOT NULL
          ),
          '[]'
        ) AS photos
      FROM reviews
        LEFT OUTER JOIN reviews_photos on reviews.id = reviews_photos.review_id
      WHERE reviews.product_id = 2
      GROUP BY reviews.id;`
    )
  }
}