# 🗄 Database Schema – Dino Studio (MySQL)

---

## 1. Entity Relationship Diagram

```
┌──────────┐       ┌───────────┐       ┌──────────┐
│  Users   │       │ Products  │───1:N─│ Variants │
└──────────┘       └─────┬─────┘       └──────────┘
                         │ 1:N
                   ┌─────▼─────┐
                   │  Images   │
                   └───────────┘

┌──────────┐       ┌───────────┐
│  Users   │──1:N──│ Inquiries │
└──────────┘       └───────────┘
```

---

## 2. Tables

### 2.1 Users

```sql
CREATE TABLE users (
  id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email       VARCHAR(255) UNIQUE,
  phone       VARCHAR(20) UNIQUE,
  name        VARCHAR(255),
  company     VARCHAR(255),
  country     VARCHAR(100),
  role        ENUM('admin', 'buyer') NOT NULL DEFAULT 'buyer',
  status      ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  last_login  TIMESTAMP NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email (email),
  INDEX idx_users_phone (phone),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.2 OTP Tokens

```sql
CREATE TABLE otp_tokens (
  id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id     CHAR(36) NOT NULL,
  code        VARCHAR(6) NOT NULL,
  type        ENUM('email', 'phone') NOT NULL,
  expires_at  TIMESTAMP NOT NULL,
  is_used     BOOLEAN NOT NULL DEFAULT FALSE,
  attempts    INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_otp_user_id (user_id),
  INDEX idx_otp_expires (expires_at),
  CONSTRAINT fk_otp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.3 Products

```sql
CREATE TABLE products (
  id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  category    ENUM('earring', 'bracelet', 'necklace', 'ring', 'pendant', 'set') NOT NULL,
  collection  VARCHAR(100),
  status      ENUM('new', 'seasonal', 'sale', 'discontinued') NOT NULL DEFAULT 'new',
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_products_category (category),
  INDEX idx_products_status (status),
  INDEX idx_products_active (is_active),
  INDEX idx_products_collection (collection)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.4 Variants

```sql
CREATE TABLE variants (
  id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  product_id  CHAR(36) NOT NULL,
  sku         VARCHAR(50) UNIQUE NOT NULL,
  color       VARCHAR(50),
  size        ENUM('small', 'medium', 'large', 'free-size'),
  material    VARCHAR(100),
  price       DECIMAL(10, 2) NOT NULL,
  min_order   INT DEFAULT 1,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_variants_product (product_id),
  INDEX idx_variants_sku (sku),
  INDEX idx_variants_color (color),
  INDEX idx_variants_size (size),
  INDEX idx_variants_material (material),
  INDEX idx_variants_active (is_active),
  CONSTRAINT fk_variant_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.5 Images

```sql
CREATE TABLE images (
  id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  product_id  CHAR(36) NOT NULL,
  variant_id  CHAR(36) NULL,
  url         TEXT NOT NULL,
  alt_text    VARCHAR(255),
  sort_order  INT DEFAULT 0,
  is_primary  BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_images_product (product_id),
  INDEX idx_images_variant (variant_id),
  INDEX idx_images_primary (is_primary),
  CONSTRAINT fk_image_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_image_variant FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.6 Inquiries

```sql
CREATE TABLE inquiries (
  id          CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id     CHAR(36) NULL,
  product_id  CHAR(36) NULL,
  variant_id  CHAR(36) NULL,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255),
  company     VARCHAR(255),
  country     VARCHAR(100),
  message     TEXT NOT NULL,
  status      ENUM('new', 'read', 'responded', 'closed') NOT NULL DEFAULT 'new',
  admin_notes TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_inquiries_user (user_id),
  INDEX idx_inquiries_product (product_id),
  INDEX idx_inquiries_status (status),
  INDEX idx_inquiries_created (created_at),
  CONSTRAINT fk_inquiry_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_inquiry_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  CONSTRAINT fk_inquiry_variant FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.7 Sessions (Refresh Tokens)

```sql
CREATE TABLE sessions (
  id            CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id       CHAR(36) NOT NULL,
  refresh_token TEXT NOT NULL,
  user_agent    TEXT,
  ip_address    VARCHAR(45),
  expires_at    TIMESTAMP NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_sessions_user (user_id),
  INDEX idx_sessions_expires (expires_at),
  CONSTRAINT fk_session_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 3. Relationships Summary

| Parent | Child | Relationship | On Delete |
|--------|-------|-------------|-----------|
| users | otp_tokens | 1:N | CASCADE |
| users | inquiries | 1:N | SET NULL |
| users | sessions | 1:N | CASCADE |
| products | variants | 1:N | CASCADE |
| products | images | 1:N | CASCADE |
| products | inquiries | 1:N | SET NULL |
| variants | images | 1:N (optional) | SET NULL |
| variants | inquiries | 1:N (optional) | SET NULL |

---

## 4. Indexes Summary

| Table | Index | Purpose |
|-------|-------|---------|
| users | email, phone | Quick lookup for login |
| products | category, status, is_active | Filter queries |
| variants | product_id, sku, color, size, material | Filter + join queries |
| images | product_id, variant_id | Image loading |
| inquiries | user_id, product_id, status, created_at | Admin listing + filtering |
| otp_tokens | user_id, expires_at | OTP validation |
| sessions | user_id, expires_at | Token management |

---

## 5. Soft Delete Strategy

ใช้ `is_active` field แทนการลบจริง สำหรับ Products และ Variants:
- `is_active = TRUE` → แสดงในระบบ
- `is_active = FALSE` → ซ่อนจากระบบ (soft deleted)

สำหรับ Users ใช้ `status`:
- `status = 'active'` → ใช้งานได้
- `status = 'inactive'` → ถูก deactivate

---

## 6. Database Maintenance

```sql
-- ลบ expired OTP tokens (run daily via cron/event scheduler)
DELETE FROM otp_tokens WHERE expires_at < DATE_SUB(NOW(), INTERVAL 1 DAY);

-- ลบ expired sessions (run daily)
DELETE FROM sessions WHERE expires_at < NOW();

-- Enable MySQL Event Scheduler
SET GLOBAL event_scheduler = ON;

-- Scheduled event: cleanup expired OTPs
CREATE EVENT IF NOT EXISTS cleanup_expired_otps
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM otp_tokens WHERE expires_at < DATE_SUB(NOW(), INTERVAL 1 DAY);

-- Scheduled event: cleanup expired sessions
CREATE EVENT IF NOT EXISTS cleanup_expired_sessions
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM sessions WHERE expires_at < NOW();
```

---
