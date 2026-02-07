-- Initial Pricing Data for Fleet Management
-- Values match the VehicleType Enum: SEDAN, HATCHBACK, SUV, LUXURY

-- this deletes the tables and creates new entries
DELETE FROM vehicle_pricing;

INSERT INTO vehicle_pricing (vehicle_type, price_per_km, price_per_day, base_price, created_at, updated_at) 
VALUES ('HATCHBACK', 8.00, 400.00, 150.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO vehicle_pricing (vehicle_type, price_per_km, price_per_day, base_price, created_at, updated_at) 
VALUES ('SEDAN', 12.50, 600.00, 250.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO vehicle_pricing (vehicle_type, price_per_km, price_per_day, base_price, created_at, updated_at) 
VALUES ('SUV', 18.00, 1000.00, 500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO vehicle_pricing (vehicle_type, price_per_km, price_per_day, base_price, created_at, updated_at) 
VALUES ('LUXURY', 45.00, 3500.00, 1500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);