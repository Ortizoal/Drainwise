-- Seed: Run this in Supabase SQL Editor AFTER creating at least one auth user.
-- Replace 'YOUR_USER_ID' with an actual auth.users UUID from your Supabase project.
-- Or sign up via the app first, then run this with that user's ID.

-- Districts
INSERT INTO districts (name, region) VALUES
  ('Accra Metropolitan', 'Greater Accra'),
  ('La Dade Kotopon', 'Greater Accra'),
  ('Ledzokuku', 'Greater Accra'),
  ('Krowor', 'Greater Accra'),
  ('Okaikwei North', 'Greater Accra'),
  ('Ablekuma West', 'Greater Accra'),
  ('Ablekuma North', 'Greater Accra'),
  ('Ayawaso East', 'Greater Accra'),
  ('Ayawaso West', 'Greater Accra'),
  ('Tema Metropolitan', 'Greater Accra')
ON CONFLICT DO NOTHING;

-- Sample reports (replace 'YOUR_USER_ID' with an actual auth user UUID)
-- These span Accra's flood-prone zones with varying severities
INSERT INTO reports (user_id, lat, lng, description, drain_category, severity, status, upvotes, created_at) VALUES
  ('YOUR_USER_ID', 5.5500, -0.2100, 'Drain completely blocked with silt and trash behind Kwame Nkrumah Circle market', 'roadside', 'critical', 'submitted', 12, NOW() - INTERVAL '3 days'),
  ('YOUR_USER_ID', 5.5550, -0.2150, 'Open drain along the school fence overflowing, children cannot pass', 'residential', 'severe', 'verified', 8, NOW() - INTERVAL '2 days'),
  ('YOUR_USER_ID', 5.5650, -0.2300, 'Kaneshie Market drain choked with plastic waste, water flooding stalls', 'market', 'critical', 'in_progress', 24, NOW() - INTERVAL '5 days'),
  ('YOUR_USER_ID', 5.5750, -0.2000, 'Drain collapsed near the mosque, raw sewage exposed', 'residential', 'critical', 'submitted', 15, NOW() - INTERVAL '1 day'),
  ('YOUR_USER_ID', 5.5600, -0.1800, 'Oxford Street drain grate stolen, deep hole open on pedestrian walkway', 'roadside', 'severe', 'submitted', 6, NOW() - INTERVAL '12 hours'),
  ('YOUR_USER_ID', 5.5400, -0.2400, 'Drain behind the petrol station not desilted in 2 years', 'other', 'moderate', 'submitted', 3, NOW() - INTERVAL '7 days'),
  ('YOUR_USER_ID', 5.5800, -0.2050, 'Water flooding the main road after every rain, drain size insufficient', 'roadside', 'severe', 'verified', 10, NOW() - INTERVAL '4 days'),
  ('YOUR_USER_ID', 5.5480, -0.1950, 'Blocked drain causing sewage to back up into compound', 'residential', 'critical', 'in_progress', 18, NOW() - INTERVAL '2 days'),
  ('YOUR_USER_ID', 5.5360, -0.2250, 'Small drain behind the chop bar needs desilting', 'residential', 'minor', 'resolved', 2, NOW() - INTERVAL '10 days'),
  ('YOUR_USER_ID', 5.5900, -0.1900, 'Drain at the taxi rank completely full, drivers cannot park', 'roadside', 'moderate', 'submitted', 5, NOW() - INTERVAL '1 day'),
  ('YOUR_USER_ID', 5.5300, -0.2000, 'Drain collapsed after last heavy rain, needs urgent repair', 'roadside', 'severe', 'submitted', 7, NOW() - INTERVAL '6 hours'),
  ('YOUR_USER_ID', 5.5600, -0.2350, 'Market drain overflows every evening, foul smell unbearable', 'market', 'moderate', 'verified', 4, NOW() - INTERVAL '3 days'),
  ('YOUR_USER_ID', 5.5450, -0.2150, 'Drain covered with concrete slab but slab is broken, child fell in last week', 'residential', 'critical', 'submitted', 22, NOW() - INTERVAL '2 days'),
  ('YOUR_USER_ID', 5.5750, -0.2250, 'Contractor dumped construction waste into the drain', 'roadside', 'severe', 'in_progress', 9, NOW() - INTERVAL '4 days'),
  ('YOUR_USER_ID', 5.5380, -0.1880, 'Drain behind the church needs regular desilting, currently blocked', 'other', 'minor', 'submitted', 1, NOW() - INTERVAL '8 days'),
  ('YOUR_USER_ID', 5.5700, -0.2100, 'Neighbors dumping rubbish directly into the drain', 'residential', 'moderate', 'submitted', 11, NOW() - INTERVAL '1 day'),
  ('YOUR_USER_ID', 5.5200, -0.2300, 'Drain from the abattoir discharging blood and waste into street', 'other', 'critical', 'submitted', 30, NOW() - INTERVAL '12 hours'),
  ('YOUR_USER_ID', 5.5850, -0.2000, 'Drain grating missing along the highway access road', 'roadside', 'severe', 'verified', 14, NOW() - INTERVAL '2 days'),
  ('YOUR_USER_ID', 5.5580, -0.1780, 'Flood water enters the pharmacy every time it rains', 'market', 'moderate', 'in_progress', 6, NOW() - INTERVAL '6 days'),
  ('YOUR_USER_ID', 5.5250, -0.2100, 'Main gutter along the road needs desilting before rainy season', 'roadside', 'moderate', 'submitted', 3, NOW() - INTERVAL '3 days');
