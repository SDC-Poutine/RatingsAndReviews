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

    const query = `
    SELECT reviews.id AS review_id,
    reviews.reported,
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
    return await
      pool.query(query, value)
  },

  getMeta: async (product_id) => {
    const query = `SELECT json_build_object(
      'product_id',
      (${product_id}),
      'ratings',
      (
        SELECT json_object_agg(rating, count)
        FROM (
            SELECT rating,
              count(rating) AS count
            FROM reviews
            WHERE product_id = $1
            GROUP BY rating
          ) a
      ),
      'recommended',
      (
        SELECT json_object_agg(
            CAST(
              CASE
                WHEN recommend = 'true' THEN 1
                ELSE 0
              END as bit
            ),
            reccount
          )
        FROM (
            SELECT recommend,
              count(recommend) as reccount
            FROM reviews
            WHERE product_id = $1
            GROUP BY recommend
          ) rec
      ),
      'characteristics',
      (
        SELECT json_object_agg(name, data)
        FROM (
            SELECT name,
              data
            FROM (
                SELECT DISTINCT name,
                  id,
                  product_id
                FROM characteristics
                WHERE product_id = $1
              ) a
              LEFT OUTER JOIN (
                SELECT id,
                  json_build_object('id', id, 'value', avg) as data
                FROM(
                    SELECT characteristic_id as id,
                      avg(value) as avg
                    FROM characteristic_reviews
                    GROUP BY characteristic_id
                    ORDER BY id
                  ) obj
              ) obj ON a.id = obj.id
          ) f
      )
    ) as meta;
`;

    const value = [product_id]
    return await
      pool.query(query, value)
  },
  postReview: async (data) => {
    // post params
    const product_id = data.product_id;
    const rating = data.rating;
    const summary = data.summary;
    const body = data.body;
    const recommend = data.recommend;
    const reviewer_name = data.name;
    const reviewer_email = data.email;
    const photos = data.photos;
    const characteristics = data.characteristics;

    // need in query to insert
    // const date = GETDATE()
    const reported = false;
    // const response = data.response;
    const helpfulness = 0;

    console.log('product_id: ', product_id, 'rating: ',rating, 'summary: ',summary, 'body: ', body, 'recommend: ',recommend, 'reported: ',reported, 'reviewer_name: ',reviewer_name, 'email: ',reviewer_email, 'helpfulness: ',helpfulness, 'photos: ',photos, 'characteristics: ',characteristics)
    return await console.log('');
  },
  putHelpful: async (review_id) => {
    const query = `
    UPDATE reviews
    SET helpfulness = helpfulness + 1
    WHERE id=$1;
    `
    const value = [review_id]
    return await
      pool.query(query, value)
  },
  putReport: async (review_id) => {
    const query = `
    UPDATE reviews
    SET reported = true
    WHERE id=$1;
    `
    const value = [review_id]
    return await
      pool.query(query, value)
  }
}