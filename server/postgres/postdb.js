const { Pool } = require('pg');
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
  getReviews: async (page, count, sort, product_id) => {
    console.log('IM IN THE DBBBBB', page, count, sort, product_id)
    let sorting;
    if (sort === 'relevance') {
      sorting = 'reviews.helpfulness DESC, reviews.date'
    } else if (sort === 'newest') {
      sorting = 'reviews.date'
    } else if (sort === 'helpfulness') {
      sorting = 'reviews.helpfulness'
    }


    // console.log('line24', sort);

    const query = `
    SELECT reviews.id AS review_id,
      reviews.rating,
      reviews.summary,
      reviews.recommend,
      NULLIF(reviews.response, 'null') as response,
      reviews.body,
      (to_timestamp(reviews.date/1000)) as date,
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
    WHERE reviews.product_id = $2
    GROUP BY reviews.id
    ORDER BY ${sorting} DESC
    LIMIT $1
    ;`
      ;

    const value = [count, product_id]

    console.log('line58', count)

    return await
      pool.query(query, value)
  },
  getMeta: '',
  postReview: async () => {
    return await console.log('test');
    // const query = ``;
    // return await pool.query()
  }
}