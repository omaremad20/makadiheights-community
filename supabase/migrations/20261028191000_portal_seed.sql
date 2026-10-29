-- Makadi Heights Community Portal — seed data extracted from the source documents
-- in Storage bucket `makadiheights-data`. See docs/DATA_SOURCES.md for the
-- source-to-field mapping and the conflicts resolved below.

-- ---------------------------------------------------------------------------
-- Site settings
-- ---------------------------------------------------------------------------
insert into public.site_settings (key, value, description) values
  ('community_email', 'community.management@makadiheights.com', 'Active Community Management email (replaces the discontinued customer-care addresses)'),
  ('community_hours', '8:30 AM – 4:30 PM', 'Community Management working hours (Homeowner Manual; Security Awareness)'),
  ('hotline', '16595', 'Makadi Heights hotline (CIB transfer details footer; May 2025 announcement)'),
  ('info_email', 'info@makadiheights.com', 'General information email (CIB transfer details footer; May 2025 announcement)'),
  ('website', 'https://www.makadiheights.com', 'Official website (CIB transfer details footer)');

-- ---------------------------------------------------------------------------
-- Documents (storage_path = exact object name in makadiheights-data)
-- ---------------------------------------------------------------------------
insert into public.documents (id, title, category, description, language, storage_path, file_type, portal_href, sort_order) values
  ('homeowner-manual', 'Homeowner Manual', 'Community Guidelines', 'Department roles, community rules, entry and exit permits, and the pets policy.', 'English & Arabic', 'mh-manual-final.pdf', 'pdf', '/departments', 10),
  ('departments-index', 'Department Index 2026', 'Contacts', 'Phone numbers and emails for every Makadi Heights department.', 'English & Arabic', 'departments-index-2026.docx', 'docx', '/departments', 20),
  ('commercial-index', 'It''s All in Town — Commercial Index', 'Commercial', 'Shops, restaurants and services across Makadi Heights and where to find them.', 'English', 'commercial-index.pdf', 'pdf', '/commercial', 30),
  ('commercial-phones', 'Commercial Index — Phone Numbers 2026', 'Commercial', 'Phone numbers and locations of businesses in Makadi Heights.', 'English', 'commercial-index-phone-numbers-2026.docx', 'docx', '/commercial', 40),
  ('bank-details', 'CIB Bank Transfer Details', 'Payments', 'Account numbers, IBANs and SWIFT code for payments to Makadi Heights.', 'English', 'cib-transfer-details-bank-account-info.docx', 'docx', '/banking', 50),
  ('shuttle-schedule', 'Shuttle Bus Schedule — Winter Update', 'Transport', 'Shuttle times between Makadi Heights and Hurghada, including the Friday adjustment.', 'English & Arabic', 'shuttle-bus-schedule-mkh-winter-update.pdf', 'pdf', '/shuttle', 60),
  ('security-awareness', 'Security Awareness', 'Safety', 'Security guidelines and emergency numbers for residents.', 'Arabic & English', 'security-awareness-.pdf', 'pdf', '/security', 70),
  ('serenity-beach-access', 'Serenity Beach Access', 'Serenity', 'Beach access, facilities, resident discounts and beach rules at Serenity Alpha Hotel.', 'English', 'serenity-beach-access.pdf', 'pdf', '/serenity', 80),
  ('serenity-menu', 'Serenity Menu 2026', 'Serenity', 'Food and beverage menu curated for Makadi Heights guests at Serenity Hotels.', 'English', 'makadi-heights-menu-serenity-hotel-2026.pdf', 'pdf', '/serenity#menu', 90),
  ('price-beach-clubhouse', '2026 Price List — Beach & Clubhouse (Pack for 2)', 'Membership', 'Beach and Clubhouse membership prices for two, additional members and daily tickets (VAT excluded).', 'English', 'beach-and-clubshouse-pack-for-one.pdf', 'pdf', '/membership', 100),
  ('price-clubhouse-only', '2026 Price List — Clubhouse Only & Pack for 1', 'Membership', 'Clubhouse-only pack for two, and pack-for-one prices with and without beach access (VAT excluded).', 'English', 'clubhouse-only-pack-for-two-and-one-and-beach-access-pack-for-one.pdf', 'pdf', '/membership', 110),
  ('delegation-form', 'Entrance Permission (Delegation Form)', 'Forms', 'Authorise a person to enter your unit. Fill it in online and download it as a PDF.', 'English & Arabic', 'mkh-delegation-form.docx', 'docx', '/forms/delegation', 120),
  ('tenant-form', 'Move-in Permit (Tenant Form)', 'Forms', 'Register a tenant''s details for a rental. Fill it in online and download it as a PDF.', 'English & Arabic', 'mkh-tenant-form.docx', 'docx', '/forms/tenant', 130),
  ('penalties-list', 'Penalties List', 'Rules & Regulations', 'Fines for violations of the Makadi Heights community rules.', 'Arabic & English', 'mkh-penalties-list.docx', 'docx', '/rules/penalties', 140),
  ('tenant-rules', 'Tenants'' Rules and Regulations', 'Rules & Regulations', 'Obligations for tenants renting a unit in Makadi Heights.', 'Arabic & English', 'mkh-tenant-rules-and-regulations.docx', 'docx', '/rules#tenant-rules', 150),
  ('announcement-may-2025', 'Community Announcement — May 2025', 'Announcements', 'Answers to homeowner questions, the 2025 events calendar and community updates.', 'English', 'makadi-heights-community-announcement-may-2025.pdf', 'pdf', '/announcements/may-2025', 160);

-- ---------------------------------------------------------------------------
-- Departments — contacts from Department Index 2026 (authoritative for contacts);
-- roles and hours from the Homeowner Manual.
-- ---------------------------------------------------------------------------
insert into public.departments (id, name, summary, responsibilities, working_hours, notes, sort_order) values
  ('community-management', 'Community Management',
   'Supports homeowners in every possible way to ensure customer satisfaction.',
   array[
     'Applying the Makadi Heights community rules and regulations to all community users',
     'Handling complaints and escalations in a timely manner',
     'Clubhouse memberships',
     'Issuing permits for the security gates',
     'Inquiries or issues related to the contract',
     'Resale and rental processes',
     'Planning the yearly entertainment and activities plan',
     'Announcements of new rules, activities and services',
     'Ensuring adequate services from facility management, security, tenants and operators'
   ],
   '8:30 AM – 4:30 PM', null, 10),
  ('security', 'Security Department',
   'Operates 24 hours a day to keep residents and their property safe.',
   array[
     'Access control at the security gates and ID checks',
     'Visitor, supplier and contractor entry',
     'CCTV monitoring of the streets while respecting residents'' privacy',
     'Enforcing traffic and safety rules, including the 30 km/h speed limit',
     'Emergency line for urgent situations'
   ],
   '24/7', null, 20),
  ('maintenance', 'Facility & Maintenance Department',
   'Maintains all facilities and public infrastructure networks, in line with on-site safety regulations.',
   array[
     'Protecting and maintaining public utility areas and facilities',
     'Move-in installations (electrical fixtures, furniture, air conditioning)',
     'Internal technical maintenance (plumber, carpenter, electrician, aluminium technician, AC, painter)',
     'Private pool maintenance',
     'Building maintenance',
     'Landscape (softscape and hardscape), including private landscaping and garden maintenance contracts on request'
   ],
   '8:30 AM – 4:30 PM', 'Landscape enquiries use the same contacts (Homeowner Manual).', 30),
  ('home-renovation', 'Home Renovation Department',
   'Responsible for all external and internal alterations, modifications and additional options for units.',
   array[
     'Reviewing architectural alteration requests for the unit or property',
     'Approving external works carried out by owners, together with Community Management',
     'Creative ideas, designs and additional options for existing and newly handed-over units',
     'Furnishing services, quoted separately based on the design'
   ],
   '8:30 AM – 4:30 PM', 'Alterations may be subject to insurance and admin fees.', 40),
  ('handover', 'Handover Department',
   'Coordinates with the Construction Department to monitor the progress of units.',
   array[
     'Monitoring unit construction progress',
     'Ensuring completion aligns with the contract terms and Orascom Development''s quality standards'
   ],
   '9:00 AM – 4:00 PM', null, 50),
  ('property-management', 'Property Management (Rentals)',
   'Makes renting your unit as easy as possible.',
   array[
     'Renting your property and handling the rental agreement on your behalf',
     'Check-in and check-out, contracts and forms',
     'Housekeeping supervision, maintenance and rent collection',
     'Regular statements for utilities and services payments',
     'Receiving rental notifications with residents'' names, ID photos and length of stay'
   ],
   '8:30 AM – 4:30 PM', null, 60),
  ('finance', 'Town Finance Department',
   'Handles payments and financial services for residents.',
   array[
     'Electricity recharging and meter installations',
     'Public services, water consumption and private landscape maintenance payments',
     'Clubhouse memberships, entrance tickets and clubhouse sports academies',
     'Private pool maintenance fees',
     'Resale procedures (by appointment, at least 3 days in advance, before 1:00 PM)',
     'Home modification insurance payments',
     'Any other payments related to residents'
   ],
   '8:30 AM – 4:30 PM', 'Payment by cash, Visa, bank transfer or online.', 70),
  ('sales', 'Sales Department', null, '{}', null,
   'Sales offices: Cairo — Nile City Towers, North Tower, 12th Floor, 2005 A Corniche El Nil; Heliopolis — 22 Salah Salem St, Ard Al Golf; Makadi Heights — Makadi Heights Mall, Makadi Bay, Hurghada, Red Sea.', 80),
  ('resale', 'Re-Sale Department', null, '{}', null, null, 90),
  ('sales-operations', 'Sales Operations Department', 'Ownership transfers (assignments).',
   array['Resale and assignment procedures, also available at the Cairo office in Nile City Towers'],
   null, null, 100);

insert into public.department_contacts (department_id, kind, value, label, sort_order) values
  ('community-management', 'phone', '+201222259900', null, 1),
  ('community-management', 'email', 'community.management@makadiheights.com', null, 2),
  ('security', 'phone', '+201288000308', '24/7 emergency', 1),
  ('security', 'email', 'security@makadiheights.com', null, 2),
  ('maintenance', 'phone', '+201271888816', null, 1),
  ('maintenance', 'email', 'makadi.maintenance@makadiheights.com', null, 2),
  ('home-renovation', 'phone', '+201275987727', null, 1),
  ('home-renovation', 'email', 'home.renovation@makadiheights.com', null, 2),
  ('handover', 'phone', '+201282031269', null, 1),
  ('handover', 'email', 'handover@makadiheights.com', null, 2),
  ('property-management', 'phone', '+201270344448', null, 1),
  ('property-management', 'email', 'pmd@makadiheights.com', null, 2),
  ('finance', 'phone', '+201206533399', null, 1),
  ('finance', 'phone', '+201280109875', null, 2),
  ('finance', 'email', 'makadi.collection@makadiheights.com', null, 3),
  ('sales', 'email', 'sales@orascomdh.com', null, 1),
  ('resale', 'phone', '+201000251333', null, 1),
  ('resale', 'email', 'ahmed.hamdy@orascomhd.com', null, 2),
  ('sales-operations', 'phone', '+201275987618', null, 1),
  ('sales-operations', 'email', 'salesoperations@makadiheights.com', null, 2);

-- ---------------------------------------------------------------------------
-- Commercial directory
--   names/categories/groups/areas: commercial-index.pdf
--   phones: commercial-index-phone-numbers-2026.docx (cross-checked with commercial.json)
--   map links: commercial.json
-- ---------------------------------------------------------------------------
insert into public.business_groups (id, name, description, sort_order) values
  ('daily-essentials', 'Daily Essentials', 'Groceries, medicine and staying connected', 10),
  ('eat-drink', 'Eat & Drink', 'From the first coffee of the day to drinks at night', 20),
  ('health-wellbeing', 'Health & Wellbeing', 'Clinics, training and self-care', 30),
  ('shopping', 'Shopping', 'Fashion, tech, pets and more', 40),
  ('for-your-home', 'For Your Home', 'Maintenance, cooling and home care', 50),
  ('out-about', 'Out & About', 'Ways to explore and get around', 60);

insert into public.businesses (id, name, group_id, category, area, description, map_url, notes, sort_order) values
  ('bestway', 'Bestway', 'daily-essentials', 'Supermarket', 'Mall', null, 'https://maps.app.goo.gl/RdT6X4P81iA5Qfsh9', null, 10),
  ('makadi-heights-pharmacy', 'Makadi Heights Pharmacy', 'daily-essentials', 'Pharmacy', 'Mall', null, null, 'Source number has 12 digits (011142429857) — verify.', 20),
  ('orange', 'Orange', 'daily-essentials', 'Mobile & Internet', 'Mall', null, 'https://maps.app.goo.gl/L5v6JymKKro6BGGx8', null, 30),
  ('drop-spot', 'Drop Spot', 'daily-essentials', 'Delivery Drop-off', 'Clubhouse', 'Handles all delivery drop-offs in Makadi Heights.', null, 'Listed as "Internal Transportation (Drop Spot)" in the phone index.', 40),
  ('hope-and-grill', 'Hope and Grill', 'eat-drink', 'Restaurant & Cafe', 'Mall', null, 'https://maps.app.goo.gl/LxFrnWfiGsqgHrpm7', 'Listed as "Grill House by Hope" in the phone index.', 10),
  ('layalena', 'Layalena', 'eat-drink', 'Oriental Restaurant', 'Promenade', null, 'https://maps.app.goo.gl/4YE5CFTj3QBEc2eeA', null, 20),
  ('neiloo-seafood', 'Neiloo Seafood', 'eat-drink', 'Seafood Restaurant', 'Promenade', null, 'https://maps.app.goo.gl/oA195uVqUNo1vJTC9', null, 30),
  ('better-buns', 'Better Buns', 'eat-drink', 'Burgers', 'Promenade', null, null, null, 40),
  ('nutri-vibe', 'Nutri Vibe', 'eat-drink', 'Healthy Food', 'Promenade', null, 'https://maps.app.goo.gl/ytjrAcKJT5HCtVSM9', 'Same number is listed for Ignite in both phone sources.', 50),
  ('bready', 'Bready', 'eat-drink', 'Artisanal Bakery', 'Promenade', null, 'https://maps.app.goo.gl/wZsRFwcDcWwmdyWW9', null, 60),
  ('kaldi', 'Kaldi by Jacobs', 'eat-drink', 'Coffee Shop', 'Promenade', null, 'https://maps.app.goo.gl/PybzJxosgSuH9TVi8', 'Map link was stored in the phone field of commercial.json.', 70),
  ('mulliri', 'Mulliri', 'eat-drink', 'Coffee Shop', 'Promenade', null, null, null, 80),
  ('hope-coffee', 'Hope Coffee', 'eat-drink', 'Coffee Shop', 'Mall', null, null, null, 90),
  ('time-out', 'Time Out', 'eat-drink', 'Snacks', 'The Park', null, null, null, 100),
  ('bus-stop', 'Bus Stop', 'eat-drink', 'Bar & Restaurant', 'Mall', null, 'https://maps.app.goo.gl/6pNYMDxbZyT5Eo2U8', null, 110),
  ('movenpick', 'Mövenpick', 'eat-drink', 'Ice Cream', 'Promenade', null, null, null, 120),
  ('on-call-clinic', 'On Call Clinic', 'health-wellbeing', 'Medical Clinic', 'Mall', null, null, 'Listed as "Makadi Heights Clinic" in the phone index.', 10),
  ('prima-salon', 'Prima Salon', 'health-wellbeing', 'Hair & Beauty Salon', 'Mall', null, 'https://maps.app.goo.gl/BHsbY6zGW4uk6yWt8', null, 20),
  ('ignite', 'Ignite', 'health-wellbeing', 'Gym & Performance Training', 'Clubhouse', null, 'https://maps.app.goo.gl/NjwRPzGAdZvoB7RV6', null, 30),
  ('fabrik', 'Fabrik', 'shopping', 'Clothing & Leather Bags', 'Promenade', null, 'https://maps.app.goo.gl/T7CjQULmtb8G7rx7A', 'Listed as "Fabric Wear" in the phone index.', 10),
  ('btech', 'B.TECH', 'shopping', 'Electronics & Appliances', 'Mall', null, 'https://maps.app.goo.gl/p3vtL5sjEg84dQDc7', null, 20),
  ('the-pet-mart', 'The Pet Mart Egypt', 'shopping', 'Pet Supplies', 'Mall', 'Listed with Top Vet clinic.', 'https://maps.app.goo.gl/g55dSFi5VneegYdQ6', null, 30),
  ('bazar-sakara', 'Bazar Sakara', 'shopping', 'Wine & Spirits', 'Mall', null, null, null, 40),
  ('smokology', 'Smokology', 'shopping', 'Smoke Shop', 'Mall', null, null, null, 50),
  ('rechote', 'Rechote', 'shopping', 'Home Accessories', 'Q2', null, null, 'Only listed in the phone index (not in the commercial index PDF or commercial.json).', 60),
  ('carrier', 'Carrier', 'for-your-home', 'Air Conditioning', 'Promenade', null, null, 'Phone index lists the location as Q3.', 10),
  ('la-casa', 'La Casa', 'for-your-home', 'Home Services', 'Promenade', 'Housekeeping and car wash.', null, null, 20),
  ('best-home', 'Best Home', 'for-your-home', 'Dry Clean Services', 'Mall', null, null, 'Listed as "Best Home Laundry" in the phone index.', 30),
  ('makadi-horse-club', 'Makadi Horse Club', 'out-about', 'Horse Riding', 'Horse Club', 'On the road outside Makadi Heights.', null, null, 10),
  ('vbs', 'VBS', 'out-about', 'Golf Cart Rental', 'Promenade', null, 'https://maps.app.goo.gl/T2Mj9QKwJbh5BsTG9', null, 20),
  ('crystal-safari', 'Crystal Safari', 'out-about', 'Desert Safari', 'Mall', null, null, null, 30),
  ('bike-spot', 'Bike Spot', 'out-about', 'Bike Rental', 'Clubhouse', 'At the Clubhouse parking.', null, null, 40),
  ('go-bus', 'Go Bus', 'out-about', 'Intercity Bus Travel', 'Mall', null, 'https://maps.app.goo.gl/JGF8svT3rFWGYY8Z9', null, 50);

insert into public.business_phones (business_id, phone, label, sort_order) values
  ('bestway', '01289403344', null, 1),
  ('makadi-heights-pharmacy', '011142429857', null, 1),
  ('orange', '16110', 'Hotline', 1),
  ('drop-spot', '01228891918', null, 1),
  ('layalena', '01554480565', null, 1),
  ('neiloo-seafood', '01214389328', null, 1),
  ('better-buns', '01201122210', null, 1),
  ('nutri-vibe', '01227556870', null, 1),
  ('bus-stop', '01094634994', null, 1),
  ('on-call-clinic', '01207690550', null, 1),
  ('on-call-clinic', '01222822820', null, 2),
  ('prima-salon', '01226321302', null, 1),
  ('ignite', '01061977777', null, 1),
  ('ignite', '01227556870', null, 2),
  ('btech', '19966', 'Hotline', 1),
  ('smokology', '01111122225', null, 1),
  ('rechote', '01202213888', null, 1),
  ('la-casa', '01507002984', null, 1),
  ('best-home', '01220615917', null, 1),
  ('makadi-horse-club', '01157205818', null, 1),
  ('vbs', '01099243649', null, 1),
  ('crystal-safari', '01000041651', null, 1),
  ('bike-spot', '01015404440', null, 1),
  ('go-bus', '19567', 'Hotline', 1);

-- ---------------------------------------------------------------------------
-- Bank accounts (cib-transfer-details-bank-account-info.docx)
-- ---------------------------------------------------------------------------
insert into public.bank_accounts (id, bank_name, account_holder, currency, account_number, iban, swift_code, branch_address, sort_order) values
  ('cib-egp', 'CIB', 'Makadi Heights for Tourist Development', 'EGP', '100009887738', 'EG030010005000000100009887738', 'CIBEEGCX050', 'Marina Abu Tig - El Gouna - Hurghada', 10),
  ('cib-usd', 'CIB', 'Makadi Heights for Tourist Development', 'USD', '100039853781', 'EG500010005000000100039853781', 'CIBEEGCX050', 'Marina Abu Tig - El Gouna - Hurghada', 20),
  ('cib-eur', 'CIB', 'Makadi Heights for Tourist Development', 'EUR', '100039853838', 'EG630010005000000100039853838', 'CIBEEGCX050', 'Marina Abu Tig - El Gouna - Hurghada', 30),
  ('cib-gbp', 'CIB', 'Makadi Heights for Tourist Development', 'GBP', '100011725109', 'EG840010005000000100011725109', 'CIBEEGCX050', 'Marina Abu Tig - El Gouna - Hurghada', 40);

-- ---------------------------------------------------------------------------
-- Shuttle bus (shuttle-bus-schedule-mkh-winter-update.pdf)
-- ---------------------------------------------------------------------------
insert into public.shuttle_stops (id, direction, name, detail, sort_order) values
  ('mh-makadi-heights', 'makadi_to_hurghada', 'Makadi Heights', 'In front of the Clubhouse', 1),
  ('mh-the-beach', 'makadi_to_hurghada', 'The Beach', 'At the Parking Gate', 2),
  ('mh-senzo-mall', 'makadi_to_hurghada', 'Senzo Mall', 'At the second gate', 3),
  ('mh-kawther', 'makadi_to_hurghada', 'Kawther', 'In front of Bestway', 4),
  ('mh-sheraton', 'makadi_to_hurghada', 'Sheraton St.', 'In front of WE Telecom', 5),
  ('mh-el-sakala', 'makadi_to_hurghada', 'El-Sakala Square', null, 6),
  ('hm-el-sakala', 'hurghada_to_makadi', 'El-Sakala Square', null, 1),
  ('hm-sheraton', 'hurghada_to_makadi', 'Sheraton St.', null, 2),
  ('hm-el-kawther', 'hurghada_to_makadi', 'El Kawther', null, 3),
  ('hm-senzo-mall', 'hurghada_to_makadi', 'Senzo Mall', null, 4),
  ('hm-the-beach', 'hurghada_to_makadi', 'The Beach', null, 5),
  ('hm-makadi', 'hurghada_to_makadi', 'Makadi', null, 6);

insert into public.shuttle_trips (id, direction, period, sort_order) values
  ('mh-1', 'makadi_to_hurghada', 'AM', 1),
  ('mh-2', 'makadi_to_hurghada', 'AM', 2),
  ('mh-3', 'makadi_to_hurghada', 'PM', 3),
  ('mh-4', 'makadi_to_hurghada', 'PM', 4),
  ('mh-5', 'makadi_to_hurghada', 'PM', 5),
  ('hm-1', 'hurghada_to_makadi', 'PM', 1),
  ('hm-2', 'hurghada_to_makadi', 'PM', 2),
  ('hm-3', 'hurghada_to_makadi', 'PM', 3),
  ('hm-4', 'hurghada_to_makadi', 'AM', 4);

insert into public.shuttle_trip_times (trip_id, stop_id, departure) values
  ('mh-1', 'mh-makadi-heights', '10:00'), ('mh-1', 'mh-the-beach', '10:10'),
  ('mh-2', 'mh-makadi-heights', '10:30'), ('mh-2', 'mh-senzo-mall', '10:50'), ('mh-2', 'mh-kawther', '11:15'), ('mh-2', 'mh-sheraton', '11:30'), ('mh-2', 'mh-el-sakala', '11:45'),
  ('mh-3', 'mh-makadi-heights', '2:15'), ('mh-3', 'mh-the-beach', '2:30'), ('mh-3', 'mh-senzo-mall', '2:50'), ('mh-3', 'mh-kawther', '3:15'), ('mh-3', 'mh-sheraton', '3:30'), ('mh-3', 'mh-el-sakala', '3:45'),
  ('mh-4', 'mh-makadi-heights', '6:15'), ('mh-4', 'mh-senzo-mall', '6:45'), ('mh-4', 'mh-kawther', '7:00'), ('mh-4', 'mh-sheraton', '7:15'), ('mh-4', 'mh-el-sakala', '7:30'),
  ('mh-5', 'mh-makadi-heights', '10:00'), ('mh-5', 'mh-senzo-mall', '10:20'), ('mh-5', 'mh-kawther', '10:35'), ('mh-5', 'mh-sheraton', '10:55'), ('mh-5', 'mh-el-sakala', '11:05'),
  ('hm-1', 'hm-el-sakala', '12:45'), ('hm-1', 'hm-sheraton', '1:00'), ('hm-1', 'hm-el-kawther', '1:15'), ('hm-1', 'hm-senzo-mall', '1:30'), ('hm-1', 'hm-the-beach', '1:50'), ('hm-1', 'hm-makadi', '2:00'),
  ('hm-2', 'hm-el-sakala', '4:00'), ('hm-2', 'hm-sheraton', '4:15'), ('hm-2', 'hm-el-kawther', '4:30'), ('hm-2', 'hm-senzo-mall', '4:45'), ('hm-2', 'hm-the-beach', '5:10'), ('hm-2', 'hm-makadi', '5:35'),
  ('hm-3', 'hm-el-sakala', '09:00'), ('hm-3', 'hm-sheraton', '09:15'), ('hm-3', 'hm-el-kawther', '09:30'), ('hm-3', 'hm-senzo-mall', '09:45'), ('hm-3', 'hm-makadi', '10:00'),
  ('hm-4', 'hm-el-sakala', '01:00'), ('hm-4', 'hm-sheraton', '01:15'), ('hm-4', 'hm-el-kawther', '01:30'), ('hm-4', 'hm-senzo-mall', '01:45'), ('hm-4', 'hm-makadi', '02:00');

-- ---------------------------------------------------------------------------
-- Emergency contacts (security-awareness-.pdf); department rows reuse department phones
-- ---------------------------------------------------------------------------
insert into public.emergency_contacts (id, service, phone, department_id, availability, is_emergency, sort_order) values
  ('security-emergencies', 'Security Emergencies', null, 'security', '24/7', true, 1),
  ('police', 'Police', '122', null, '24/7', true, 2),
  ('ambulance', 'Ambulance', '123', null, '24/7', true, 3),
  ('fire', 'Fire Department', '180', null, '24/7', true, 4),
  ('clinic', 'Makadi Heights Clinic', '01110047815', null, '24/7', true, 5),
  ('maintenance', 'Maintenance Department', null, 'maintenance', '8:30 AM – 4:30 PM', false, 6),
  ('community-management', 'Community Management', null, 'community-management', '8:30 AM – 4:30 PM', false, 7);

-- ---------------------------------------------------------------------------
-- Content sections
-- ---------------------------------------------------------------------------
insert into public.content_sections (id, page, title, intro, items, tone, sort_order) values
  -- Security Awareness
  ('security-overview', 'security', 'Your safety is our priority',
   'At the Makadi Heights Security Department, we are committed to ensuring a safe and peaceful living environment for all residents. To achieve this, we kindly ask for your cooperation in adhering to the following security measures.',
   '{}', 'default', 1),
  ('security-access', 'security', 'Access control guidelines', null, array[
    'Please present the ID card issued by Makadi Heights Management upon request.',
    'All homeowners are required to submit copies of IDs for household staff (housekeepers, guards, drivers, gardeners, etc.).',
    'Individuals holding keys to residential or commercial units must have written or email authorisation from the respective unit owner.',
    'Always ensure that doors, windows and gates are securely locked when leaving your home, even for a short time.',
    'Keep your unit keys in a safe place at all times.',
    'Report any lost or stolen access items to the management office immediately.',
    'Avoid sharing access details with unauthorised individuals.'
  ], 'default', 2),
  ('security-visitors', 'security', 'Visitor and supplier management', null, array[
    'Notify the security team in advance of any expected visitors or suppliers.',
    'Visitors are required to sign in at the gate.',
    'Suppliers, maintenance staff and contractors will only be allowed entry with prior approval from the resort management.',
    'If renting out your unit, you must send copies of IDs or passports of tenants to the Community Management team at least 48 hours before their arrival.'
  ], 'default', 3),
  ('security-parcels', 'security', 'Parcel and delivery safety', null, array[
    'Confirm delivery schedules with shipping companies and inform the security team of expected packages.',
    'Only accept packages from authorised personnel.',
    'If you are unavailable, request that your package be held at the security office.'
  ], 'default', 4),
  ('security-vehicles', 'security', 'Vehicle safety tips', null, array[
    'Adhere to the speed limit within the resort (30 km/h).',
    'Follow the correct traffic directions and observe road signs to avoid accidents.',
    'Ensure that minors below the legal driving age do not operate vehicles.',
    'All cars and motorcycles must be properly licensed.',
    'Keep car music at a moderate volume to avoid disturbing others.',
    'Always wear a seatbelt when riding in a moving vehicle.',
    'Park your vehicle only in spaces designated for your unit.',
    'Ensure the handbrake is engaged and the gear is in the correct position, especially on slopes.',
    'Lock your vehicle and avoid leaving valuables, such as bags or electronics, visible inside.',
    'Avoid parking near fire hydrants or building entrances.'
  ], 'default', 5),
  ('security-suspicious', 'security', 'Reporting suspicious activities', null, array[
    'Stay vigilant about your surroundings. Report any unfamiliar individuals or unusual behaviour to the security team.',
    'When reporting, provide details such as physical descriptions or vehicle information.',
    'Do not confront suspicious individuals directly; leave this to the trained security team.'
  ], 'warning', 6),
  ('security-emergency-note', 'security', 'In an emergency',
   'For emergencies such as fires or medical issues, contact the security team for immediate assistance while reaching out to emergency services.',
   '{}', 'warning', 7),
  ('security-feedback', 'security', 'Feedback and suggestions',
   'Share your feedback or suggest improvements to our security measures by email.',
   '{}', 'default', 8),

  -- Serenity Beach Access
  ('serenity-intro', 'serenity', 'Makadi Heights partners with Serenity Alpha Hotel',
   'As part of our ongoing efforts to elevate the Makadi Heights lifestyle and enhance our residents'' beach experience, we''re thrilled to announce our new partnership with Serenity Alpha Hotel, giving Makadi Heights homeowners and Clubhouse members access to the hotel''s beautiful beach and exceptional facilities.',
   '{}', 'default', 1),
  ('serenity-access', 'serenity', 'Access details', null, array[
    'Clubhouse members: complimentary beach access all year round.',
    'Non-member homeowners: EGP 750 per person from April to October.',
    'Non-member homeowners: EGP 500 per person from November to March.',
    'Non-member payment is made directly at the hotel.',
    'A valid Homeowner Card must be presented for access.',
    'A checkpoint will be available at the beach entrance to verify memberships and collect entry fees.'
  ], 'default', 2),
  ('serenity-facilities', 'serenity', 'Facilities and services', null, array[
    'Towels and sunbeds are provided by Serenity Hotel.',
    'A Makadi Heights representative will be available on-site to assist with any inquiries.',
    'A complimentary 6-seater golf car is available for pick-up and drop-off between the parking area and the beach.'
  ], 'default', 3),
  ('serenity-facility-discounts', 'serenity', 'Facilities discounts',
   'Present your valid Homeowner Card to enjoy:', array[
    '20% off at Serenity Spa',
    '10% off at Serenity Water Park & Theme Park',
    '10% off at Serenity Fun Planet',
    '15% off day-use rooms'
  ], 'default', 4),
  ('serenity-fnb-discounts', 'serenity', 'Food & beverage discounts',
   'Discounts are already applied to a special menu curated for Makadi Heights guests.', array[
    '20% off at Celestia',
    '10% off at Aurora',
    '10% off at Baywatch, Sunstone, Stardust, TAO, Pool Bars & Serenity Gourmet Restaurants'
  ], 'default', 5),
  ('serenity-rules', 'serenity', 'Beach rules & regulations', null, array[
    'Beach hours: from 8:00 AM until sunset.',
    'Food and beverages from outside are not permitted.',
    'Pets are not allowed.',
    'Parents must supervise children at all times.',
    'Topless sunbathing is not allowed.',
    'Reserving sunbeds is prohibited.',
    'Swimming is at your own risk.',
    'The hotel is not responsible for any losses, damages, injuries or fatalities.'
  ], 'warning', 6),

  -- Membership notes (2026 price lists)
  ('membership-notes', 'membership', 'Membership notes', null, array[
    'Clubhouse membership includes beach access at Serenity Beach.',
    'Members are entitled to special rates on food & beverage at Serenity Hotel.',
    'Serenity Hotel offers exclusive special offers for members on the spa, Aqua Park, Fun Planet and day-use rooms.',
    'All members must follow and comply with the beach rules and regulations of Serenity.',
    'Memberships cannot be transferred from one person to another.',
    'Owners of two different units cannot be added on the same application form.'
  ], 'notice', 1),
  ('membership-courts', 'membership', 'Courts',
   'Football, tennis and padel courts are available. Call for reservations.', array[
    'Football court', 'Tennis court', 'Padel court'
  ], 'default', 2),

  -- Shuttle
  ('shuttle-friday', 'shuttle', 'Friday afternoon adjustment',
   'Please be informed that we have made a slight adjustment to the Friday afternoon shuttle bus schedule.', array[
    'The trip that departs from El-Sakala Square at 12:45 PM and arrives in Makadi at 2:15 PM will be delayed by 45 minutes due to Friday prayer time.',
    'Accordingly, all trips scheduled between 12:45 PM and 2:15 PM on Fridays will be shifted by 45 minutes.',
    'All other trips will continue to operate at their usual times.'
  ], 'notice', 1),

  -- Penalties notes (translated from the Arabic original)
  ('penalties-note', 'penalties', 'Please note',
   null, array[
    'For repeated violations, the penalty is doubled and all services to the unit are suspended until the violation is removed.',
    'If a guest or visitor breaks the rules, the owner receives a warning. If the violation is repeated, the penalty is added to the owner''s unit.'
  ], 'warning', 1),

  -- Tenants' Rules and Regulations (translated from the Arabic original)
  ('tenant-rules', 'tenant-rules', 'Tenants'' Rules and Regulations',
   'These regulations complement the contract between the unit owner and the tenant and are binding on both parties.', array[
    'The tenant must follow all community regulations handed to the unit owner, as well as the penalties list.',
    'The tenant and everyone residing with them must preserve the project''s facilities, public areas and residential equipment, and must compensate Makadi Heights for any damage resulting from their misuse.',
    'The unit may be used for residential purposes only, in an appropriate manner and without disturbing neighbours or harming others. If the unit is used for any other purpose, the company has the right to address the breach in any way, including terminating the unit''s sale contract with the client and closing the violating activity, in addition to informing the government authorities.',
    'The tenant must not occupy any spaces or common areas outside the unit (roofs, building entrances, stairs, corridors, gardens and public green spaces), even temporarily, with any belongings, or use them for personal purposes in any form.',
    'Posters or advertisements must not be stuck on walls or public doors inside the project.',
    'The tenant must not exceed the speed limit set within the project (30 km/h) and must follow the road signs in the main and secondary streets and the traffic instructions. Failure to comply means the tenant pays the penalty set in the penalties list issued by Community Management.',
    'The tenant must not occupy private parking spaces.',
    'The tenant must notify Community Management whenever belongings are moved into or out of the unit, after submitting proof of tenancy, so that a permit can be issued.',
    'The tenant must notify Community Management of the names and identity documents of their drivers and workers to obtain resort entry permits, and is responsible for them and their actions while they are present.',
    'No modifications to façades or balconies are allowed.',
    'External air-conditioning units or satellite dishes must not be installed without the necessary permits from Community Management.',
    'No animals or birds of any kind may be kept in the unit except house pets (dogs, cats and ornamental birds). These must be licensed and vaccinated as required by the veterinary authorities, must not disturb or threaten neighbours, passers-by or workers, and must not be left outside the unit or in roads or corridors unless accompanied by an adult who can control them, following the rules set for pet owners (collar, muzzle, leash, cage).',
    'The tenant has no right to object to the policies or services provided by the company in any way; this right belongs to the owner and cannot be delegated to the tenant.',
    'The tenant may only deal with Community Management once the lease contract has been submitted to Community Management, with the owner present when the contract is registered in the case of a long-term lease.',
    'These regulations complement the contract between the unit owner and the tenant, are binding on both parties in full, and may not be violated.'
  ], 'default', 1);

-- ---------------------------------------------------------------------------
-- Membership pricing (VAT excluded; app adds 14% once)
-- ---------------------------------------------------------------------------
insert into public.membership_settings (id, vat_rate, currency, reservations_phone) values (true, 0.14, 'EGP', '+201225810499');

insert into public.membership_packages (id, name, access, people_included, allows_additional_members, description, source_document_id, sort_order) values
  ('beach-clubhouse-2', 'Beach & Clubhouse — Pack for 2', 'beach_and_clubhouse', 2, true, 'Clubhouse membership with beach access for two people.', 'price-beach-clubhouse', 10),
  ('clubhouse-only-2', 'Clubhouse Only — Pack for 2', 'clubhouse_only', 2, true, 'Clubhouse membership for two people, beach access excluded.', 'price-clubhouse-only', 20),
  ('beach-clubhouse-1', 'Beach & Clubhouse — Pack for 1', 'beach_and_clubhouse', 1, false, 'Clubhouse membership with beach access for one person.', 'price-clubhouse-only', 30),
  ('clubhouse-only-1', 'Clubhouse Only — Pack for 1', 'clubhouse_only', 1, false, 'Clubhouse membership for one person, beach access excluded.', 'price-clubhouse-only', 40);

insert into public.membership_prices (package_id, duration_key, duration_label, base_price, additional_member_price, sort_order) values
  ('beach-clubhouse-2', '1y', '1 Year', 24300, 3675, 1),
  ('beach-clubhouse-2', '6m', '6 Months', 16700, 3000, 2),
  ('beach-clubhouse-2', '3m', '3 Months', 12750, 2600, 3),
  ('beach-clubhouse-2', '1m', '1 Month', 8550, 2100, 4),
  ('beach-clubhouse-2', '10d', '10 Days', 5200, 1350, 5),
  ('beach-clubhouse-2', '1w', '1 Week', 3650, 950, 6),
  ('clubhouse-only-2', '1y', '1 Year', 12150, 1800, 1),
  ('clubhouse-only-2', '6m', '6 Months', 8400, 1500, 2),
  ('clubhouse-only-2', '3m', '3 Months', 6550, 1250, 3),
  ('clubhouse-only-2', '1m', '1 Month', 4250, 1050, 4),
  ('clubhouse-only-2', '10d', '10 Days', 2600, 650, 5),
  ('clubhouse-only-2', '1w', '1 Week', 1800, 450, 6),
  ('beach-clubhouse-1', '1y', '1 Year', 15750, null, 1),
  ('beach-clubhouse-1', '6m', '6 Months', 10650, null, 2),
  ('beach-clubhouse-1', '3m', '3 Months', 8250, null, 3),
  ('beach-clubhouse-1', '1m', '1 Month', 5450, null, 4),
  ('beach-clubhouse-1', '10d', '10 Days', 3300, null, 5),
  ('beach-clubhouse-1', '1w', '1 Week', 2300, null, 6),
  ('clubhouse-only-1', '1y', '1 Year', 7900, null, 1),
  ('clubhouse-only-1', '6m', '6 Months', 5450, null, 2),
  ('clubhouse-only-1', '3m', '3 Months', 4150, null, 3),
  ('clubhouse-only-1', '1m', '1 Month', 3500, null, 4),
  ('clubhouse-only-1', '10d', '10 Days', 2062, null, 5),
  ('clubhouse-only-1', '1w', '1 Week', 1150, null, 6);

insert into public.day_tickets (id, label, price, tax_included, note, sort_order) values
  ('with-beach', 'Daily ticket with beach access', 600, true, '1 ticket per person', 1),
  ('without-beach', 'Daily ticket without beach access', 450, true, '1 ticket per person', 2);

-- ---------------------------------------------------------------------------
-- Penalties (translated from the Arabic original of mkh-penalties-list.docx)
-- ---------------------------------------------------------------------------
insert into public.penalties (id, category, description, amount_egp, amount_suffix, qualifier, review_note, sort_order) values
  (1, 'Damage or misuse of community facilities and public spaces', 'Damage to assets and property', 1000, '+', null, 'The source prints "1,000 +". This most likely means 1,000 EGP plus the cost of the damage; please confirm.', 1),
  (2, 'Damage or misuse of community facilities and public spaces', 'Misuse of public and common areas', 500, null, null, null, 2),
  (3, 'Damage or misuse of community facilities and public spaces', 'Misuse of swimming pools (not following the usage instructions)', 500, null, null, null, 3),
  (4, 'Damage or misuse of community facilities and public spaces', 'Misuse of courts, sports areas and the Clubhouse', 500, null, null, null, 4),
  (5, 'Damage or misuse of community facilities and public spaces', 'Throwing garbage or cigarettes in the streets or in non-designated places', 500, null, null, null, 5),
  (6, 'Damage or misuse of community facilities and public spaces', 'Installing satellite dishes in non-designated places', 1000, null, null, null, 6),
  (7, 'Damage or misuse of community facilities and public spaces', 'Misuse of green areas (plants and greenery)', 500, null, null, null, 7),
  (8, 'Damage or misuse of community facilities and public spaces', 'Misuse of balconies, corridors and roads', 1000, null, null, null, 8),
  (9, 'Damage or misuse of community facilities and public spaces', 'Leaving garbage bags in corridors or in non-designated places', 500, null, null, null, 9),
  (10, 'Damage or misuse of community facilities and public spaces', 'Installing external devices (such as air conditioners or cameras) without prior approval from management', 5000, null, null, null, 10),
  (11, 'Damage or misuse of community facilities and public spaces', 'Filming inside the compound or in public facilities for promotion, advertising or social media without prior permission from Community Management, as this breaks the regulations and the residents'' privacy', 3000, null, null, null, 11),
  (12, 'Damage or misuse of community facilities and public spaces', 'Photographing or recording units or people without their owners'' consent; this is an invasion of privacy and is treated as a direct violation of the community regulations', 3000, null, null, null, 12),
  (13, 'Traffic and parking violations (cars and motorcycles)', 'Minors driving (persons under the legal driving age)', 5000, null, null, null, 13),
  (14, 'Traffic and parking violations (cars and motorcycles)', 'Exceeding the speed limit or racing (speed limit 30 km/h)', 2000, null, null, null, 14),
  (15, 'Traffic and parking violations (cars and motorcycles)', 'Obstructing roads (motorcycles, golf carts or contractor vehicles)', 500, null, null, 'The bilingual source''s English column says "Trucks"; the Arabic original says "contractor vehicles".', 15),
  (16, 'Traffic and parking violations (cars and motorcycles)', 'Breaking parking rules for cars or motorcycles, or driving against the traffic direction', 500, null, null, 'The English column of the source reads "Parking Penalty — Not driving in the correct direction"; translated here from the Arabic original.', 16),
  (17, 'Traffic and parking violations (cars and motorcycles)', 'Driving vehicles in non-designated areas (e.g. the Mall walkway)', 500, null, null, null, 17),
  (18, 'Other violations', 'Leaving dogs off-leash or unrestrained', 1000, null, null, null, 18),
  (19, 'Other violations', 'Leaving dogs off-leash or unrestrained and endangering the safety of others', 7000, null, 'In accordance with the law', null, 19),
  (20, 'Other violations', 'Unauthorised modifications, including interior or exterior changes to unit façades', 7000, null, null, null, 20),
  (21, 'Other violations', 'Renting the unit without notifying the company (resort management)', 5000, null, null, null, 21),
  (22, 'Other violations', 'Verbal or physical assault on any person or employee in the residential community', 3000, null, 'In accordance with the law', null, 22),
  (23, 'Other violations', 'Use of the T9 swimming pools by people who do not live in the building', 500, null, null, null, 23),
  (24, 'Other violations', 'Not keeping to the agreed timing (start and end) of unit modifications or fit-out works with the Engineering Department, or leaving debris in alleys and streets during interior works carried out by the owner', 2000, null, null, 'Arabic "بمعرفة العميل" is translated as "carried out by the owner"; the source''s English column reads "with owner''s knowledge".', 24),
  (25, 'Other violations', 'Noise and disturbance inside the residential community', 500, null, null, null, 25),
  (26, 'Other violations', 'Not wearing proper swimwear inside the swimming pools', 1000, null, null, null, 26),
  (27, 'Other violations', 'Pet waste and litter', 500, null, null, null, 27),
  (28, 'Other violations', 'Dogs barking at night and disturbing neighbours', 500, null, null, null, 28),
  (29, 'Other violations', 'Using the unit for commercial purposes', 7000, null, null, null, 29);
