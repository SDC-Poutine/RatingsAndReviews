\c reviews;

\COPY reviews FROM '/Users/kimmie/HR/Atelier Project/reviews.csv' delimiter ',' csv header;

\COPY characteristics FROM '/Users/kimmie/HR/Atelier Project/characteristics.csv' delimiter ',' csv header;

\COPY reviews_photos FROM '/Users/kimmie/HR/Atelier Project/reviews_photos.csv' delimiter ',' csv header;

\COPY characteristic_reviews FROM '/Users/kimmie/HR/Atelier Project/characteristic_reviews.csv' delimiter ',' csv header;
