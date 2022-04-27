SELECT json_build_object(
    'ratings',
    json_object_agg('test1', 'test2')
  );
--RATINGS
SELECT json_object_agg(rating, count)
FROM (
    SELECT rating,
      count(rating) AS count
    FROM reviews
    WHERE product_id = 2
    GROUP BY rating
  ) a;
--RECOMMENDED
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
    WHERE product_id = 2
    GROUP BY recommend
  ) rec;
--CHARACTERISTICS
-- characteristics trial/error
SELECT json_build_object('id', id, 'value', avg)
FROM(
    SELECT characteristic_id as id,
      avg(value) as avg
    FROM characteristic_reviews
    GROUP BY characteristic_id
    ORDER BY id
  ) a
SELECT json_object_agg(name, charRev)
FROM (
    SELECT *
    FROM characteristics
      LEFT OUTER JOIN characteristic_reviews ON characteristics.id = characteristic_reviews.characteristic_id
    WHERE product_id = 1;
)
SELECT DISTINCT name,
  id
FROM characteristics
WHERE product_id = 1;
-- CHARACTERISTICS final form
SELECT json_object_agg(name, data)
FROM (
    SELECT name,
      data
    FROM (
        SELECT DISTINCT name,
          id,
          product_id
        FROM characteristics
        WHERE product_id = 2
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
  ) f;
-- fisrt META COMBINED
SELECT json_build_object(
    'product_id',
    ('test'),
    'ratings',
    (
      SELECT json_object_agg(rating, count)
      FROM (
          SELECT rating,
            count(rating) AS count
          FROM reviews
          WHERE product_id = 5
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
          WHERE product_id = 5
          GROUP BY recommend
        ) rec
    ),
    'characteristics',
    (
      SELECT name,
        data
      FROM (
          SELECT DISTINCT name,
            id,
            product_id
          FROM characteristics
          WHERE product_id = 5
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
    )
  ) as meta;
-- join first
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
  --

EXPLAIN ANALYZE
  SELECT json_build_object(
      'product_id',
      (SELECT product_id FROM reviews WHERE product_id=1000011 GROUP BY product_id),
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
        SELECT json_object_agg(i.name, idVal )
        FROM
        (SELECT c.product_id, c.name, json_build_object('id', cr.characteristic_id, 'value', avg(cr.value))as idVal
        FROM characteristics c
        LEFT JOIN characteristic_reviews cr
        on c.id=cr.characteristic_id
        WHERE product_id = 1000011
        GROUP BY c.product_id, c.name, cr.characteristic_id)i
      )
    ) as meta;