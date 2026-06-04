# 📰 IndoTimesMedia — Enterprise Backend CMS & API

Enterprise-grade backend CMS and API system for a digital newspaper platform, built with Node.js, Express, TypeScript, PostgreSQL, Prisma, and Redis.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Client Layer                       │
│              (Frontend App / Admin Panel)                │
└────────────────────────┬────────────────────────────────┘
                         │
                    HTTP/HTTPS
                         │
┌────────────────────────▼────────────────────────────────┐
│                   Nginx (Reverse Proxy)                  │
│            Rate Limiting • Gzip • Security Headers       │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│                  Express.js Application                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Middleware Layer                                 │   │
│  │  Helmet • CORS • Rate Limiter • Auth • Validate  │   │
│  └──────────────────┬───────────────────────────────┘   │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │  API Modules (Feature-Based Architecture)        │   │
│  │  Auth │ Articles │ Categories │ Media │ Comments  │   │
│  │  Newsletter │ Analytics │ SEO                     │   │
│  └──────────────────┬───────────────────────────────┘   │
│  ┌──────────────────▼───────────────────────────────┐   │
│  │  Service Layer (Business Logic)                   │   │
│  └──────────────────┬───────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
┌───────▼──────┐ ┌────▼─────┐ ┌────▼──────┐
│  PostgreSQL  │ │  Redis   │ │ Cloudinary │
│  (Prisma)    │ │  Cache   │ │ / S3       │
└──────────────┘ └──────────┘ └───────────┘
```

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js 20 LTS |
| Framework | Express.js 4 |
| Language | TypeScript 5 |
| Database | PostgreSQL 16 |
| ORM | Prisma 6 |
| Cache | Redis 7 (ioredis) |
| Auth | JWT + bcrypt |
| File Storage | Cloudinary + S3-compatible |
| API Docs | Swagger/OpenAPI 3.0 |
| Validation | Zod |
| Logging | Winston |
| Container | Docker + Docker Compose |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (optional)

### Quick Start (Docker)

```bash
# 1. Clone the repository
git clone https://github.com/your-org/indo-times-media.git
cd indo-times-media

# 2. Create environment file
cp .env.example .env

# 3. Start all services
docker compose up -d

# 4. Run database migrations
docker compose exec app npx prisma migrate dev

# 5. Seed the admin account
docker compose exec app npm run seed:admin

# 6. Access the API
# API: http://localhost:5000/api/health
# Docs: http://localhost:5000/api/docs
# MinIO Console: http://localhost:9001
```

### Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Create environment file
cp .env.example .env
# Edit .env with your database/redis URLs

# 3. Generate Prisma client
npx prisma generate

# 4. Run database migrations
npx prisma migrate dev

# 5. Seed admin + default categories
npm run seed:admin

# 6. Start development server
npm run dev
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/login` | ❌ | Admin login |
| POST | `/api/v1/auth/refresh-token` | ❌ | Refresh access token |
| POST | `/api/v1/auth/logout` | ✅ | Logout |
| GET | `/api/v1/auth/me` | ✅ | Get admin profile |

### Categories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/categories` | ✅ | Create category |
| GET | `/api/v1/categories` | ❌ | List categories |
| GET | `/api/v1/categories/:id` | ❌ | Get category |
| PUT | `/api/v1/categories/:id` | ✅ | Update category |
| DELETE | `/api/v1/categories/:id` | ✅ | Delete category |

### Articles
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/articles` | ✅ | Create article |
| GET | `/api/v1/articles` | ❌ | List published articles |
| GET | `/api/v1/articles/admin` | ✅ | List all articles (admin) |
| GET | `/api/v1/articles/:id` | ❌ | Get article by ID |
| GET | `/api/v1/articles/slug/:slug` | ❌ | Get article by slug |
| PUT | `/api/v1/articles/:id` | ✅ | Update article |
| PATCH | `/api/v1/articles/:id/publish` | ✅ | Publish article |
| PATCH | `/api/v1/articles/:id/draft` | ✅ | Revert to draft |
| DELETE | `/api/v1/articles/:id` | ✅ | Delete article |
| GET | `/api/v1/articles/search?q=` | ❌ | Search articles |
| GET | `/api/v1/articles/filter` | ❌ | Filter articles |

### Media
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/media/upload` | ✅ | Upload file |
| GET | `/api/v1/media` | ✅ | Media library |
| GET | `/api/v1/media/:id` | ✅ | Get media item |
| DELETE | `/api/v1/media/:id` | ✅ | Delete media |

### Comments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/comments` | ❌ | Submit comment |
| GET | `/api/v1/comments` | ✅ | List all comments |
| GET | `/api/v1/comments/article/:id` | ❌ | Get article comments |
| PATCH | `/api/v1/comments/:id/approve` | ✅ | Approve comment |
| PATCH | `/api/v1/comments/:id/reject` | ✅ | Reject comment |
| DELETE | `/api/v1/comments/:id` | ✅ | Delete comment |

### Newsletter
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/newsletter/subscribe` | ❌ | Subscribe |
| POST | `/api/v1/newsletter/unsubscribe` | ❌ | Unsubscribe |
| GET | `/api/v1/newsletter/subscribers` | ✅ | List subscribers |
| GET | `/api/v1/newsletter/export` | ✅ | Export CSV |

### Analytics
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/analytics/dashboard` | ✅ | Dashboard metrics |
| GET | `/api/v1/analytics/popular` | ✅ | Popular articles |
| GET | `/api/v1/analytics/views` | ✅ | Views breakdown |
| GET | `/api/v1/analytics/traffic` | ✅ | Traffic stats |

### SEO
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/seo/sitemap.xml` | ❌ | XML Sitemap |
| GET | `/api/v1/seo/robots.txt` | ❌ | Robots.txt |
| GET | `/api/v1/seo/article/:slug/meta` | ❌ | Article SEO metadata |

---

## 🔒 Security Features

- **Helmet** — HTTP security headers
- **CORS** — Configurable origin whitelist
- **Rate Limiting** — Global + per-endpoint limits
- **JWT Auth** — Access + refresh token rotation
- **Token Blacklist** — Redis-backed logout
- **bcrypt** — Password hashing (12 rounds)
- **Zod Validation** — Input validation on all endpoints
- **XSS Protection** — Input sanitization via `xss` library
- **SQL Injection Protection** — Prisma parameterized queries
- **File Validation** — MIME type + size limits

---

## 📖 API Documentation

Interactive Swagger documentation is available at:

```
http://localhost:5000/api/docs
```

Raw OpenAPI spec:
```
http://localhost:5000/api/docs.json
```

---

## 🐳 Docker

### Development
```bash
docker compose up -d
```

### Production
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Services
| Service | Port | Description |
|---------|------|-------------|
| App | 5000 | Express API server |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache |
| MinIO | 9000/9001 | S3-compatible storage |
| Nginx | 80 | Reverse proxy (production) |

---

## 📁 Project Structure

```
├── prisma/              # Database schema and migrations
├── src/
│   ├── config/          # Environment, database, redis, cloud configs
│   ├── middleware/       # Auth, rate limiting, validation, upload, cache
│   ├── modules/         # Feature-based API modules
│   │   ├── auth/        # Authentication
│   │   ├── articles/    # Article management
│   │   ├── categories/  # Category management
│   │   ├── media/       # File upload management
│   │   ├── comments/    # Comment moderation
│   │   ├── newsletter/  # Newsletter management
│   │   ├── analytics/   # Analytics dashboard
│   │   └── seo/         # SEO services
│   ├── utils/           # Shared utilities
│   ├── types/           # TypeScript type definitions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── docker/              # Docker configuration files
├── docker-compose.yml   # Development orchestration
└── docker-compose.prod.yml  # Production overrides
```

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run seed:admin` | Create admin account + default categories |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:studio` | Open Prisma Studio GUI |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

---

## 📄 License

MIT
