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
    if(sort==='relevance') {
      sort = 'ORDER BY'
    } else if (sort==='newest') {
      sort = 'ORDER BY reviews.date DESC'
    } else if (sort==='helpful') {
      sort = 'ORDER BY reviews.helpfulness ASC'
    }
    console.log('line24', sort);

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
    WHERE reviews.product_id = ${product_id}
    GROUP BY reviews.id
    LIMIT ${count};`
    ;

    return await
      pool.query(query)
  }
}