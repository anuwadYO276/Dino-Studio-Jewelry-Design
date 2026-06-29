# 🧠 Dino Studio – System Requirements Document (SRD)

---

## 1. System Architecture

### 1.1 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+ (App Router) |
| Backend | Next.js API Routes |
| Database | MySQL |
| ORM | Prisma |
| Authentication | Custom OTP + JWT |
| Image Storage | Cloud Storage (S3 / Cloudinary) |
| Deployment | Vercel / VPS |
| Styling | Tailwind CSS |

### 1.2 Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│                   Client (Browser)               │
└─────────────────────┬───────────────────────────┘
                      │ HTTPS
┌─────────────────────▼───────────────────────────┐
│              Next.js Application                  │
│  ┌─────────────┐  ┌──────────────────────────┐  │
│  │  App Router │  │   API Routes (/api/*)    │  │
│  │  (Frontend) │  │   (Backend)              │  │
│  └─────────────┘  └────────────┬─────────────┘  │
└─────────────────────────────────┼────────────────┘
                                  │
          ┌───────────────────────┼──────────────────┐
          │                       │                  │
┌─────────▼──────┐  ┌───────────▼────┐  ┌─────────▼────────┐
│  PostgreSQL    │  │  OTP Provider  │  │  Cloud Storage   │
│  (Database)    │  │  (SMS/Email)   │  │  (Images)        │
└────────────────┘  └────────────────┘  └──────────────────┘
```

---

## 2. Authentication System

### 2.1 Login Flow

```
1. User enters email/phone
2. System generates OTP (6 digits)
3. OTP sent via email/SMS provider
4. User enters OTP
5. System validates OTP
6. JWT token issued (access + refresh)
7. User redirected based on role
```

### 2.2 Login Methods

| Method | Provider | Details |
|--------|----------|---------|
| Email OTP | SendGrid / Resend | 6-digit code, 5 min expiry |
| Phone OTP | Twilio / Thai SMS Gateway | 6-digit code, 5 min expiry |

### 2.3 Authorization (RBAC)

| Role | Permissions |
|------|-------------|
| admin | Full CRUD, user management, system settings |
| buyer | View catalog, filter, submit inquiry |

### 2.4 Token Management

| Property | Value |
|----------|-------|
| Access Token Expiry | 1 hour |
| Refresh Token Expiry | 7 days |
| OTP Expiry | 5 minutes |
| Max OTP Attempts | 3 per session |
| Rate Limit | 3 OTP requests per 10 min |

---

## 3. System Modules

### 3.1 Catalog Module

| Feature | Description | Access |
|---------|-------------|--------|
| View Products | แสดง product list (grid/list) | buyer, admin |
| Product Detail | แสดงรายละเอียด + variants + images | buyer, admin |
| Filter | Filter ตาม category/color/size/material/status | buyer, admin |
| Search | Full-text search by name/description | buyer, admin |

### 3.2 Product Module

| Entity | Role |
|--------|------|
| Product | Parent entity — represents a design |
| Variant | Child entity — represents a sellable SKU |

**Relationships:**
- 1 Product → Many Variants
- 1 Product → Many Images
- 1 Variant → Many Images (optional)

### 3.3 Admin Module

| Feature | Description |
|---------|-------------|
| Product CRUD | Create, Read, Update, Delete products |
| Variant CRUD | Manage variants under each product |
| Image Management | Upload, reorder, delete images |
| Visibility Control | Toggle product/variant active status |
| User Management | View/activate/deactivate buyer accounts |

### 3.4 Inquiry Module

| Feature | Description |
|---------|-------------|
| Submit Inquiry | Form: name, company, country, message, product ref |
| View Inquiries | Admin views all inquiries (list + detail) |
| Inquiry Status | Track: new → read → responded |
| Notification | Email notification to admin on new inquiry |

---

## 4. Filtering System

### 4.1 Filter Options

| Filter | Type | Values |
|--------|------|--------|
| Category | Multi-select | earring, bracelet, necklace, ring |
| Color | Multi-select | Dynamic from variants |
| Size | Multi-select | small, medium, large |
| Material | Multi-select | Dynamic from variants |
| Status | Single-select | new, seasonal, sale |

### 4.2 Filter Logic

```
1. Filters applied on Variant level
2. If any variant matches → Product is included
3. Results grouped by Product
4. Matching variants highlighted
5. Filters are combinable (AND logic between categories, OR within same category)
```

### 4.3 Sorting Options

| Sort | Direction |
|------|-----------|
| Newest first | DESC by created_at |
| Price (Low → High) | ASC by variant.price |
| Price (High → Low) | DESC by variant.price |
| Name (A-Z) | ASC by name |

---

## 5. API Specification

### 5.1 Auth APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/request-otp | ส่ง OTP ไปยัง email/phone |
| POST | /api/auth/verify-otp | ตรวจสอบ OTP และออก token |
| POST | /api/auth/refresh | Refresh access token |
| POST | /api/auth/logout | Invalidate token |

### 5.2 Product APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/products | List products (with filters) | buyer, admin |
| GET | /api/products/:id | Get product detail | buyer, admin |
| POST | /api/products | Create product | admin |
| PUT | /api/products/:id | Update product | admin |
| DELETE | /api/products/:id | Soft delete product | admin |

### 5.3 Variant APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/products/:id/variants | List variants | buyer, admin |
| POST | /api/products/:id/variants | Create variant | admin |
| PUT | /api/variants/:id | Update variant | admin |
| DELETE | /api/variants/:id | Soft delete variant | admin |

### 5.4 Image APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/images/upload | Upload image | admin |
| DELETE | /api/images/:id | Delete image | admin |
| PUT | /api/images/:id/reorder | Reorder image | admin |

### 5.5 Inquiry APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/inquiries | Submit inquiry | buyer |
| GET | /api/inquiries | List inquiries | admin |
| GET | /api/inquiries/:id | Get inquiry detail | admin |
| PUT | /api/inquiries/:id/status | Update inquiry status | admin |

---

## 6. Error Handling Strategy

### 6.1 Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": []
  }
}
```

### 6.2 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Input validation failed |
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| RATE_LIMITED | 429 | Too many requests |
| OTP_EXPIRED | 400 | OTP has expired |
| OTP_INVALID | 400 | Wrong OTP code |
| INTERNAL_ERROR | 500 | Unexpected server error |

---

## 7. Security Requirements

| Requirement | Implementation |
|-------------|---------------|
| HTTPS | Enforced on all routes |
| OTP Expiration | 5 minutes |
| JWT Secret | Environment variable, rotatable |
| Password | No passwords — OTP only |
| Rate Limiting | 3 OTP requests / 10 min per user |
| Input Validation | Zod schema validation on all inputs |
| SQL Injection | Prisma ORM (parameterized queries) |
| XSS Prevention | React auto-escaping + CSP headers |
| CORS | Restricted to allowed origins |
| Admin Routes | Middleware role check |

---

## 8. Third-party Integrations

| Service | Purpose | Provider Options |
|---------|---------|-----------------|
| Email OTP | ส่ง OTP ทาง email | Resend, SendGrid |
| SMS OTP | ส่ง OTP ทาง SMS | Twilio, ThaiBulkSMS |
| Image Storage | เก็บรูปสินค้า | Cloudinary, AWS S3 |
| Image CDN | Serve รูปเร็ว | Cloudinary CDN, CloudFront |
| Monitoring | Error tracking | Sentry |
| Analytics | Usage tracking | Vercel Analytics (optional) |

---

## 9. Performance Requirements

| Metric | Target |
|--------|--------|
| API Response Time | < 500ms (p95) |
| Page Load (FCP) | < 2 seconds |
| Image Load | Lazy load + WebP format |
| Database Query | < 100ms average |
| Concurrent Users | 50+ simultaneous |
| Image Upload | Max 5MB per file |
| Catalog Page Size | 20 items per page (paginated) |

---

## 10. Deployment Architecture

### 10.1 Environments

| Environment | Purpose | URL Pattern |
|-------------|---------|-------------|
| Development | Local dev | localhost:3000 |
| Staging | Testing | staging.dinostudio.com |
| Production | Live | catalog.dinostudio.com |

### 10.2 CI/CD Pipeline

```
1. Push to main → trigger build
2. Run lint + type check
3. Run tests
4. Build Next.js
5. Deploy to hosting
6. Run health check
```

### 10.3 Infrastructure

| Component | Service |
|-----------|---------|
| Hosting | Vercel / VPS (DigitalOcean) |
| Database | PlanetScale / Railway / Self-hosted MySQL |
| File Storage | Cloudinary / S3 |
| DNS | Cloudflare |
| SSL | Auto (Vercel) / Let's Encrypt |

---
