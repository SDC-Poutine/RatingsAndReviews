-- first review GET request
EXPLAIN ANALYZE SELECT *
FROM reviews
WHERE product_id = 2;
-- Planning Time: 0.062 ms
-- Execution Time: 5947.720 ms
SELECT *
FROM reviews_photos
WHERE review_id = 5;
--  Planning Time: 0.800 ms
--  Execution Time: 3436.075 ms
SELECT *
FROM characteristic_reviews
WHERE review_id = 4;
--  Planning Time: 0.068 ms
--  Execution Time: 5730.710 ms
SELECT *
FROM characteristics
WHERE product_id = 2;
--  Planning Time: 5.068 ms
--  Execution Time: 808.915 ms
-- indexing
CREATE INDEX characteristic_idIndex ON characteristic_reviews(characteristic_id);
-- characteristic_reviews
--  Planning Time: 0.076 ms
--  Execution Time: 1096.111 ms
CREATE INDEX review_idCIndex ON characteristic_reviews(review_id);
-- characteristic_reviews
--  Planning Time: 1.995 ms
--  Execution Time: 1.804 ms
CREATE INDEX review_idPIndex ON reviews_photos(review_id);
-- reviews_photos
--  Planning Time: 0.111 ms
--  Execution Time: 2245.778 ms

CREATE INDEX product_idIndex ON reviews(product_id);


-- GETREVIEWS FORMAT
SELECT reviews.id AS review_id,
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
    ) FILTER (
      WHERE reviews_photos.id IS NOT NULL
    ),
    '[]'
  ) AS photos
FROM reviews
  LEFT OUTER JOIN reviews_photos on reviews.id = reviews_photos.review_id
WHERE reviews.product_id = 2
GROUP BY reviews.id;
--  Planning Time: 0.560 ms
--  Execution Time: 1305.538 ms

    SELECT reviews.id AS review_id,
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
    GROUP BY reviews.id
    LIMIT 3;
--  Planning Time: 1.946 ms
--  Execution Time: 4554.418 ms