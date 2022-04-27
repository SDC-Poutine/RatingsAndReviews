-- GET REVIEWS
EXPLAIN ANALYZE
SELECT reviews.id AS review_id,
  reviews.reported,
  reviews.rating,
  reviews.summary,
  reviews.recommend,
  NULLIF(reviews.response, 'null') as response,
  reviews.body,
  (to_timestamp(reviews.date / 1000)) as date,
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
WHERE reviews.product_id = 1000011
GROUP BY reviews.id
ORDER BY reviews.helpfulness DESC, reviews.date DESC
LIMIT 5;

-- GET META
EXPLAIN ANALYZE
SELECT json_build_object(
    'product_id',
    (
      SELECT product_id
      FROM reviews
      WHERE product_id = 1000011
      GROUP BY product_id
    ),
    'ratings',
    (
      SELECT json_object_agg(rating, count)
      FROM (
          SELECT rating,
            count(rating) AS count
          FROM reviews
          WHERE product_id = 1000011
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
          WHERE product_id = 1000011
          GROUP BY recommend
        ) rec
    ),
    'characteristics',
    (
      SELECT json_object_agg(i.name, idVal)
      FROM (
          SELECT c.product_id,
            c.name,
            json_build_object(
              'id',
              cr.characteristic_id,
              'value',
              avg(cr.value)
            ) as idVal
          FROM characteristics c
            LEFT JOIN characteristic_reviews cr on c.id = cr.characteristic_id
          WHERE product_id = 1000011
          GROUP BY c.product_id,
            c.name,
            cr.characteristic_id
        ) i
    )
  ) as meta;