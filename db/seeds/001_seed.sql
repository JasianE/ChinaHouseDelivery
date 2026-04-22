INSERT INTO restaurants (name)
VALUES ('Sheppard'), ('Bloor'), ('Eglinton')
ON CONFLICT (name) DO NOTHING;

INSERT INTO days (service_date)
VALUES ('2026-04-21'), ('2026-04-22')
ON CONFLICT (service_date) DO NOTHING;

INSERT INTO delivery_drivers (name, restaurant_id)
SELECT v.name, r.id
FROM (
  VALUES
    ('Dennis', 'Bloor'),
    ('Alice', 'Bloor'),
    ('Maya', 'Sheppard'),
    ('Jamal', 'Eglinton')
) AS v(name, restaurant_name)
JOIN restaurants r ON r.name = v.restaurant_name
ON CONFLICT (name, restaurant_id) DO NOTHING;

WITH driver AS (
  SELECT id FROM delivery_drivers WHERE name = 'Dennis'
), day1 AS (
  SELECT id FROM days WHERE service_date = '2026-04-21'
), day2 AS (
  SELECT id FROM days WHERE service_date = '2026-04-22'
)
INSERT INTO delivery_runs (day_id, driver_id)
SELECT day1.id, driver.id FROM day1, driver
UNION ALL
SELECT day2.id, driver.id FROM day2, driver
ON CONFLICT (day_id, driver_id) DO NOTHING;

WITH run1 AS (
  SELECT r.id
  FROM delivery_runs r
  JOIN days d ON d.id = r.day_id
  JOIN delivery_drivers dd ON dd.id = r.driver_id
  WHERE d.service_date = '2026-04-21'
    AND dd.name = 'Dennis'
  LIMIT 1
), run2 AS (
  SELECT r.id
  FROM delivery_runs r
  JOIN days d ON d.id = r.day_id
  JOIN delivery_drivers dd ON dd.id = r.driver_id
  WHERE d.service_date = '2026-04-22'
    AND dd.name = 'Dennis'
  LIMIT 1
)
INSERT INTO delivery_orders (run_id, order_number, address_value, status)
SELECT run1.id, 1, '17 somers', 'in_progress'::order_status FROM run1
UNION ALL
SELECT run2.id, 2, '19 somers', 'completed'::order_status FROM run2
ON CONFLICT (order_number, run_id) DO NOTHING;
