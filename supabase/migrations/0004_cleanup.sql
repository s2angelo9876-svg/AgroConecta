-- ===========================================================
-- AgroConecta - Limpieza y re-seed
-- Aplicar después de 0001, 0002 y 0003.
-- Borra todos los datos de prueba de tablas de aplicación.
-- NO toca auth.users — solo limpia perfiles, productos, etc.
-- ===========================================================

BEGIN;

-- Borrar en orden de FK para respetar dependencias
DELETE FROM public.messages;
DELETE FROM public.conversations;
DELETE FROM public.matches;
DELETE FROM public.favorites;
DELETE FROM public.notifications;
DELETE FROM public.orders;
DELETE FROM public.verification_docs;
DELETE FROM public.products;
DELETE FROM public.demands;
DELETE FROM public.reviews;
DELETE FROM public.farmer_profiles;
-- Conservar solo el admin (si existe)
DELETE FROM public.profiles WHERE role IS DISTINCT FROM 'admin';
DELETE FROM public.testimonials;
DELETE FROM public.faqs;
DELETE FROM public.site_settings;

-- Re-seedear CMS (no requiere auth.users)
INSERT INTO public.faqs (question, answer, order_index, published) VALUES
  ('¿Cómo publico mi cosecha?', 'Ve a "Publicar cosecha", completa el formulario con producto, cantidad, precio, fecha y ubicación. La publicación es gratuita.', 1, true),
  ('¿Tiene algún costo usar AgroConecta?', 'No. La publicación y búsqueda son gratuitas.', 2, true),
  ('¿Cómo pago mi compra?', 'Directamente al agricultor: tarjeta, Yape, Plin o transferencia. AgroConecta no procesa pagos.', 3, true),
  ('¿Cómo verifico mi identidad?', 'Al registrarte como agricultor sube tu PPA del MIDAGRI o recibo de agua de riego. Un administrador revisa en menos de 24h.', 4, true),
  ('¿Puedo usar AgroConecta desde el celular?', 'Sí. La web es responsive. Próximamente lanzaremos una PWA y aplicación móvil.', 5, true);

INSERT INTO public.testimonials (author_name, author_role, content, rating, published) VALUES
  ('Restaurante Sol Naciente', 'Restaurante en Ica', 'Desde AgroConecta compramos directamente al agricultor. La calidad y frescura son notables, y el precio mucho mejor.', 5, true),
  ('Hotel Paracas', 'Hotel en Pisco', 'Recibimos palta y tomate de primer nivel cada semana.', 5, true),
  ('Exportadora Andina', 'Empresa agroindustrial', 'Encontramos proveedores confiables y verificados en minutos.', 4, true),
  ('Doña Rosa', 'Compradora en Chincha', 'Por fin una plataforma para el agricultor pequeño. Vendo mi cosecha de cebolla sin intermediarios y gano más.', 5, true);

INSERT INTO public.site_settings (key, value) VALUES
  ('contact_email', '"contacto@agroconecta.com"'),
  ('contact_phone', '"+51 987 654 321"'),
  ('response_time', '"Respondemos en menos de 24 horas"'),
  ('social', '{"instagram":"@agroconecta","facebook":"agroconecta","whatsapp":"+51987654321"}');

COMMIT;

-- ===========================================================
-- DATOS DE USUARIO (después de esta limpieza, ejecuta):
-- ===========================================================
-- 1. Authentication > Users > Add user (crea los siguientes usuarios):
--    a) admin@agroconecta.pe  (auto_confirm = ON, password cualquiera)
--    b) juan@agroconecta.pe    (auto_confirm = ON)
--    c) maria@agroconecta.pe   (auto_confirm = ON)
--    d) carlos@agroconecta.pe  (auto_confirm = ON)
--
-- 2. Después de crearlos en Auth UI, ejecuta este SQL
--    reemplazando los UUIDs por los reales que muestra Auth UI:

/*
-- Admin (promueve a admin)
UPDATE public.profiles SET role = 'admin' WHERE id = 'UUID_ADMIN';

-- Agricultores: actualiza role + inserta farmer_profile
UPDATE public.profiles SET role = 'agricultor' WHERE id IN ('UUID_JUAN','UUID_MARIA','UUID_CARLOS');

INSERT INTO public.farmer_profiles (user_id, farm_name, location, lat, lng, rating, reviews_count, verified, verification_status, member_since, bio)
VALUES
  ('UUID_JUAN',  'Finca San Juan',   'Pisco, Ica',   -13.71, -76.20, 4.8, 24, true, 'verified', '2024-01-15', 'Productor de hortalizas desde hace 15 años.'),
  ('UUID_MARIA', 'Quinta María',     'Chincha, Ica', -13.45, -76.13, 4.6, 18, true, 'verified', '2024-03-20', 'Cultivos orgánicos certificados.'),
  ('UUID_CARLOS','Viñedos Carlos',   'Ica',          -14.06, -75.73, 4.9, 31, true, 'verified', '2023-11-10', 'Frutas premium para exportación.');

-- Productos de ejemplo
INSERT INTO public.products (farmer_id, name, quantity, unit, price, harvest_date, quality, location, description, image_url, status)
VALUES
  ('UUID_JUAN',  'Palta Hass', 500, 'kg', 4.50, '2026-07-12', 'Premium', 'Ica',    'Palta Hass de exportación.', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80', 'active'),
  ('UUID_JUAN',  'Tomate',      300, 'kg', 2.80, '2026-07-10', 'Primera', 'Pisco',  'Tomate fresco con abono orgánico.', 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', 'active'),
  ('UUID_JUAN',  'Maíz Amarillo', 1000, 'kg', 1.20, '2026-07-15', 'Primera', 'Chincha','Maíz duro seleccionado.', 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80', 'active'),
  ('UUID_MARIA', 'Limón',       800, 'kg', 2.00, '2026-08-01', 'Primera', 'Ica',    'Limón sutil con alto jugo.', 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80', 'active'),
  ('UUID_MARIA', 'Cebolla Roja',2000, 'kg', 1.50, '2026-07-20', 'Segunda', 'Chincha','Cebolla curada.', 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=800&q=80', 'active'),
  ('UUID_CARLOS','Mango',       600, 'kg', 3.20, '2026-08-05', 'Premium', 'Ica',    'Mango dulce sin fibra.', 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80', 'active'),
  ('UUID_CARLOS','Uva Red Globe',1200,'kg', 5.00, '2026-08-10', 'Premium', 'Ica',    'Uva de mesa exportación.', 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80', 'active'),
  ('UUID_MARIA', 'Zanahoria',   400, 'kg', 1.80, '2026-07-25', 'Primera', 'Pisco',  'Zanahoria dulce y crocante.', 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=800&q=80', 'active');
*/