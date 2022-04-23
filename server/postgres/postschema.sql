-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table characteristic_reviews
--
-- ---
DROP DATABASE IF EXISTS reviews;

CREATE DATABASE reviews;

\c reviews;

-- ---
-- Table reviews
--
-- ---

DROP TABLE IF EXISTS reviews CASCADE;

CREATE TABLE reviews (
  id SERIAL NOT NULL UNIQUE,
  product_id INTEGER NOT NULL,
  rating INTEGER NOT NULL,
  date BIGINT NOT NULL,
  summary VARCHAR(255) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name VARCHAR(255) NOT NULL,
  reviewer_email VARCHAR(255) NOT NULL,
  response VARCHAR(1000) NOT NULL,
  helpfulness INTEGER NOT NULL,
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS characteristic_reviews CASCADE;

CREATE TABLE characteristic_reviews (
  id SERIAL NOT NULL UNIQUE,
  characteristic_id INTEGER NOT NULL,
  review_id INTEGER NOT NULL,
  value DECIMAL NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table characteristics
--
-- ---

DROP TABLE IF EXISTS characteristics CASCADE;

CREATE TABLE characteristics (
  id SERIAL NOT NULL UNIQUE,
  product_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);

-- ---
-- Table reviews_photos
--
-- ---

DROP TABLE IF EXISTS reviews_photos;

CREATE TABLE reviews_photos (
  id SERIAL NOT NULL UNIQUE,
  review_id INTEGER NOT NULL,
  url VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
);



-- ---
-- Foreign Keys
-- ---

ALTER TABLE characteristic_reviews ADD FOREIGN KEY (characteristic_id) REFERENCES characteristics (id);
ALTER TABLE characteristic_reviews ADD FOREIGN KEY (review_id) REFERENCES reviews (id);
ALTER TABLE reviews_photos ADD FOREIGN KEY (review_id) REFERENCES reviews (id);

-- ---
-- Table Properties
-- ---

-- ALTER TABLE characteristic_reviews ENGINE=InnoDB NOT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE characteristics ENGINE=InnoDB NOT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE reviews_photos ENGINE=InnoDB NOT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE reviews ENGINE=InnoDB NOT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

-- INSERT INTO characteristic_reviews (id,characteristic_id,review_id,value) VALUES
-- (,,,);
-- INSERT INTO characteristics (id,product_id,name) VALUES
-- (,,);
-- INSERT INTO reviews_photos (id,review_id,url) VALUES
-- (,,);
-- INSERT INTO reviews (id,product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness) VALUES
-- (,,,,,,,,,,,);
