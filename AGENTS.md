# AgroConecta — Notas para el agente

## Stack
- Next.js 15 (App Router) + React 19 + TypeScript + Tailwind v4
- Supabase (Auth, DB Postgres con RLS, Storage)
- Resend (emails), Decolecta (DNI/RENIEC)
- Zod para validación de Server Actions

## Setup local
1. Clonar e instalar: `npm install`
2. Crear `.env.local` (ver `.env.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `AUTH_SECRET` (ya no se usa, Supabase Auth maneja sesiones)
   - `DECOLECTA_API_KEY` (Fase 4)
   - `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (Fase 6)
3. En Supabase Dashboard:
   - SQL Editor → correr `supabase/migrations/0001_init_schema.sql`, `0002_rls_policies.sql`, `0003_storage.sql` (en orden)
   - Authentication → Sign In → desactivar "Confirm email" y "Secure email change"
   - Storage → verificar que existe el bucket `verification-docs` (privado)
   - Authentication → Users → crear admin y ejecutar `update public.profiles set role='admin' where id='UUID';`
4. `npm run dev` → http://localhost:3000

## Estructura
- `src/app/` — rutas (App Router)
- `src/components/` — componentes UI
- `src/lib/supabase/` — clientes (browser, server, admin)
- `src/lib/actions/` — Server Actions por dominio (auth, products, kyc, admin, cms, storage, demo)
- `src/lib/` — utilidades (safe-action wrapper, rate-limit, sentry, email, schemas)
- `src/data/` — datos mock estáticos (mock farmers, conversaciones)
- `src/hooks/` — hooks compartidos (useCurrentUser)
- `supabase/migrations/` — SQL versionado

## Convenciones
- Toda Server Action usa `safeAction(schema, handler)` con Zod y `.strict()`
- Mensajes de error genéricos al cliente; log técnico al servidor (vía Sentry)
- Rate limiting por IP en Server Actions críticas (5/min login, 3/10min register)
- Campos sensibles (`role`, `is_admin`, `verification_status`) bloqueados en validación cliente + RLS en DB

## Roles y permisos
- `agricultor`: publica, ve sus publicaciones, puede verificar identidad
- `comprador`: busca y guarda favoritos
- `admin`: todo + moderación en `/admin`

## Rutas principales
- Públicas: `/`, `/buscar`, `/producto/[id]`, `/agricultor/[id]`, `/mapa`, `/equipo`, `/login`, `/registro`, `/privacidad`, `/terminos`
- Protegidas: `/publicar`, `/mis-publicaciones`, `/verificar`, `/favoritos`, `/mensajes`, `/perfil`
- Admin: `/admin`, `/admin/verificaciones`, `/admin/publicaciones`, `/admin/faqs`, `/admin/testimonials`

## Pendiente para producción (post-demo)
- Sustituir rate limit en memoria por Upstash + Redis
- Activar Cloudflare Turnstile (configurar claves `NEXT_PUBLIC_TURNSTILE_SITE_KEY` y `TURNSTILE_SECRET_KEY`)
- Configurar `SENTRY_DSN` para tracking de errores
- Configurar dominio propio y DNS
- Habilitar HTTPS forzado en hosting (Vercel lo hace automático)
- Sustituir imágenes de Unsplash por almacenamiento propio
- Implementar pasarela de pagos (Culqi o Izipay) en Fase real del proyecto
- Implementar chat en tiempo real con Supabase Realtime / Pusher (modelo de datos ya está en Supabase)
- Activar `OpenGraph image` con `app/opengraph-image.tsx` (placeholder ya va con metadata)
- Habilitar subida real de fotos en productos (actualmente solo preview cliente)

## QA — checklist de pruebas manuales
Ejecutar en `npm.cmd run dev` (con Turbopack) antes de cada deploy.

### Funcional
- [ ] Registro con email nuevo → entra a /publicar (agricultor) o / (comprador)
- [ ] Login con email/password válidos → sesión iniciada
- [ ] Login con password incorrecta → error genérico
- [ ] Publicar cosecha → aparece en /buscar con badge "Agricultor Verificado" si lo es
- [ ] Eliminar publicación desde /mis-publicaciones
- [ ] Marcar favorito desde ProductCard
- [ ] Recupero de contraseña: /recuperar-password recibe email
- [ ] KYC: entrar como agricultor → /verificar → DNI lookup → subir doc → entra como admin
- [ ] Admin: aprobar/rechazar verificación → email sale (si Resend configurado)

### Seguridad
- [ ] 6 logins fallidos consecutivos muestran "Demasiados intentos"
- [ ] Cookies tienen flag HttpOnly (DevTools > Application > Cookies)
- [ ] `curl -I http://localhost:3000` muestra HSTS, CSP, X-Frame-Options DENY
- [ ] `/sitemap.xml` lista páginas (incluye /admin? — debería NO incluirlo)
- [ ] `/robots.txt` bloquea /api/, /admin, /verificar, /publicar
- [ ] Intentar crear producto con `role: 'admin'` en payload → rechazado por Zod

### RLS
- [ ] Como usuario A, intentar crear producto con `farmer_id = usuario_B.id` → falla
- [ ] Como usuario no admin, intentar acceder a /admin → muestra "Acceso restringido"
- [ ] Storage: intentar subir a `verification-docs/otro_usuario/` → falla

### Performance
- [ ] Páginas con fetch DB (/buscar, /agricultor/[id], /producto/[id]) muestran loading.tsx
- [ ] `npm.cmd run build` termina sin errores
- [ ] Imágenes usan `next/image` con sizes correctos

---

## 🎬 Script de presentación (5-7 min)

Credenciales pre-creadas en `scripts/seed-demo.mjs`:

| Email | Password | Rol | Estado |
|---|---|---|---|
| `admin@agroconecta.pe` | `Admin1234` | admin | Sin publicar |
| `juan@agroconecta.pe` | `demo1234` | agricultor | **Verificado**, 4 productos |
| `maria@agroconecta.pe` | `demo1234` | agricultor | **Pendiente** KYC, 2 productos |
| `lucia@agroconecta.pe` | `demo1234` | comprador | — |

### Flujo recomendado (orden cronológico)

**0-1 min: Home pública**
1. Abre http://localhost:3000 → hero, beneficios
2. `/buscar` → 6 productos con filtros
3. `/mapa` → 3 pines; click en uno → tooltip

**1-2 min: Agricultor verificado**
4. Cmd+K → "Ver todos los agricultores" (search demo)
5. Login `juan@agroconecta.pe` / `demo1234`
6. /perfil → Configuración → modal
7. Logout

**2-3 min: Admin**
8. Login `admin@agroconecta.pe` / `Admin1234`
9. /perfil → "Panel de administración"
10. /admin → dashboard con KPIs
11. /admin/verificaciones → 1 pendiente (María)
12. "Ver documento" → "Aprobar"
13. /admin/publicaciones → tabla con 6 productos
14. Pausa uno → desaparece de /buscar

**3-4 min: KYC en vivo**
15. Logout admin → Login `maria@agroconecta.pe` / `demo1234`
16. /verificar → "Verificado" (recién aprobada)
17. /publicar → publicar nueva
18. /mis-publicaciones → eliminar

**4-5 min: Comprador**
19. Logout María → Login `lucia@agroconecta.pe` / `demo1234`
20. Producto → "Comprar ahora" → Yape → "Ir a confirmación"
21. /gracias → mensaje personalizado
22. ❤️ otro producto → /favoritos

**5-7 min: Features premium**
23. Cmd+K → "preguntas" → FAQs
24. Footer con redes sociales
25. OpenGraph image (compartir en WhatsApp y ver preview)

---

## 🚀 Despliegue a Vercel

### Variables de entorno requeridas

**Públicas (visibles al cliente):**
| Variable | Ejemplo |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://tu-proyecto.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJ... |
| `NEXT_PUBLIC_APP_URL` | `https://agroconecta-pe.vercel.app` |

**Secretas (server-only, marcar Sensitive):**
| Variable | Notas |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Bypasea RLS |
| `DECOLECTA_API_KEY` | Para KYC |
| `RESEND_API_KEY` | Para emails |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` hasta verificar dominio |

**Opcionales:** `SENTRY_DSN`, `TURNSTILE_*`

### Configuración obligatoria en Supabase antes de deploy

1. **Authentication → Sign In/Up → desactivar "Confirm email"**
2. **Authentication → URL Configuration → Redirect URLs** agregar tu dominio de Vercel
3. **SQL Editor** → correr en orden: `0001_init_schema.sql`, `0002_rls_policies.sql`, `0003_storage.sql`
4. **Authentication → Users → Add user** para crear tu admin con "Auto Confirm User"
5. **SQL**: `update profiles set role='admin' where email='admin@agroconecta.pe';`
6. (Opcional) Ejecutar `node scripts/seed-demo.mjs` localmente para poblar la DB

### Pasos en Vercel

1. Conectar repo en vercel.com → Add New Project → importar
2. Framework: Next.js (auto)
3. Build: `next build` (default)
4. Variables de entorno: pegar todas las de arriba
5. Deploy → primer build ~1-2 min