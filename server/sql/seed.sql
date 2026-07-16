-- Run after schema.sql. Mirrors the mock data that was in lib/products.ts.

insert into products (slug, name, category, subcategory, price, compare_at_price, description, details, swatches, badge, rating, review_count)
values
  ('silk-press-bundle', 'Silk Press Bundle', 'hair', 'Human Hair Bundles', 45000, 58000,
   '100% virgin human hair, double-wefted for fullness and a natural silk-press finish that holds through humidity.',
   array['100% virgin human hair', 'Double-wefted', '12–24 inch options', 'Dyeable & heat-safe up to 180°C'],
   '[{"name":"Natural Black","hex":"#1A1210"},{"name":"Dark Brown","hex":"#3B2418"},{"name":"Honey Blonde","hex":"#B8863B"}]',
   'Bestseller', 4.8, 214),

  ('hd-lace-closure-wig', 'HD Lace Closure Wig', 'hair', 'Wigs', 85000, null,
   'Pre-plucked HD lace closure wig with a natural hairline and breathable cap construction.',
   array['4x4 HD lace closure', 'Pre-plucked hairline', '150% density', 'Adjustable elastic band'],
   '[{"name":"Natural Black","hex":"#1A1210"},{"name":"Chestnut","hex":"#6B3A28"}]',
   'New', 4.6, 98),

  ('braiding-hair-jumbo', 'Jumbo Braiding Hair', 'hair', 'Braiding Hair', 3500, null,
   'Kanekalon-blend braiding hair, low-shine finish, holds tight coils without slipping.',
   array['Kanekalon blend', '82 inches per pack', 'Low shine', 'Flame-retardant fiber'],
   '[{"name":"Jet Black","hex":"#0F0B0A"},{"name":"Burgundy","hex":"#7A2333"},{"name":"Ash Brown","hex":"#5A4636"}]',
   null, 4.5, 340),

  ('matte-velvet-lipstick', 'Matte Velvet Lipstick', 'cosmetics', 'Lips', 6500, null,
   'Long-wear matte lipstick with a whipped, non-drying texture built for melanin-rich skin tones.',
   array['8-hour wear', 'Non-drying formula', 'Vitamin E enriched', 'Vegan & cruelty-free'],
   '[{"name":"Terracotta","hex":"#B8663F"},{"name":"Berry Wine","hex":"#7A2333"},{"name":"Rosewood","hex":"#9A4A4A"},{"name":"Nude Cocoa","hex":"#8B5A3C"}]',
   'Bestseller', 4.9, 512),

  ('hydrating-foundation', 'Hydrating Skin-Tint Foundation', 'cosmetics', 'Face', 12000, null,
   'Buildable, lightweight foundation with hyaluronic acid — deep, true-to-tone shade range.',
   array['24-shade range', 'SPF 20', 'Hyaluronic acid', 'Natural satin finish'],
   '[{"name":"Deep Espresso","hex":"#3B2418"},{"name":"Warm Amber","hex":"#8B5A3C"},{"name":"Golden Caramel","hex":"#B8863B"},{"name":"Rich Ebony","hex":"#1A1210"}]',
   null, 4.7, 189),

  ('edge-control-gel', 'Strong Hold Edge Control', 'cosmetics', 'Hair Styling', 4200, null,
   'Flake-free edge control with 24-hour hold and a satin (not greasy) finish.',
   array['24-hour hold', 'No white residue', 'Castor oil enriched', '2.5 oz jar'],
   '[{"name":"Classic","hex":"#2B1B14"}]',
   'Low Stock', 4.4, 276),

  ('curl-defining-cream', 'Curl Defining Cream', 'hair', 'Hair Care', 7800, null,
   'Moisture-rich curl cream that defines coils and kinks without weighing hair down.',
   array['For 3A–4C curl types', 'Shea butter base', 'Sulfate-free', '8 oz tub'],
   '[{"name":"Classic","hex":"#5A4636"}]',
   null, 4.6, 152),

  ('brow-sculpting-pomade', 'Brow Sculpting Pomade', 'cosmetics', 'Eyes', 5200, null,
   'Waterproof brow pomade for precise, natural-looking definition that lasts all day.',
   array['Waterproof', 'Angled brush included', 'Smudge-proof', '4 shade options'],
   '[{"name":"Ash Brown","hex":"#5A4636"},{"name":"Espresso","hex":"#2B1B14"},{"name":"Charcoal Black","hex":"#1A1210"}]',
   null, 4.5, 87)
on conflict (slug) do nothing;