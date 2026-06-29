# 🔌 Dino Studio — API Curl Examples

Base URL: `http://localhost:3000`

---

## วิธีใช้งาน

1. เริ่มจาก Request OTP → Verify OTP จะได้ `accessToken`
2. นำ `accessToken` ไปใส่ใน Header `Authorization: Bearer <token>` ทุก request

---

## 1. Authentication

### Request OTP (Email)

```bash
curl -X POST http://localhost:3000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d "{\"identifier\": \"anuwadp000@gmail.com\", \"type\": \"email\"}"
```

### Request OTP (Phone)

```bash
curl -X POST http://localhost:3000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d "{\"identifier\": \"0812345678\", \"type\": \"phone\"}"
```

### Verify OTP (ได้ token กลับมา)

```bash
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"identifier\": \"anuwadp000@gmail.com\", \"code\": \"123456\", \"type\": \"email\"}"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "user": {
      "id": "uuid",
      "email": "anuwadp000@gmail.com",
      "role": "admin"
    }
  }
}
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\": \"YOUR_REFRESH_TOKEN\"}"
```

### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 2. Products

### List Products (พร้อม filter)

```bash
curl -X GET "http://localhost:3000/api/products?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Filter parameters (ทั้งหมด optional):**

| Parameter | ตัวอย่าง | คำอธิบาย |
|-----------|---------|----------|
| category | `ring,earring` | ประเภท (comma-separated) |
| material | `18K Gold,เงิน` | วัสดุ (comma-separated) |
| size | `small,medium` | ขนาด: small, medium, large, free_size |
| status | `new_arrival,sale` | สถานะ: new_arrival, seasonal, sale |
| search | `diamond` | ค้นหาจากชื่อ/คำอธิบาย |
| sort | `newest` | เรียง: newest, price_asc, price_desc, name_asc |
| page | `1` | หน้า |
| limit | `20` | จำนวนต่อหน้า |

**ตัวอย่างใช้หลาย filter:**

```bash
curl -X GET "http://localhost:3000/api/products?category=ring,earring&material=18K+Gold&size=small&status=new_arrival&sort=price_asc&page=1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### ค้นหาสินค้า (Search + Filter)

```bash
# ค้นหาจากชื่อ/คำอธิบาย
curl -X GET "http://localhost:3000/api/products?search=diamond" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# ค้นหา + filter ประเภท
curl -X GET "http://localhost:3000/api/products?search=gold&category=ring" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# filter หลายสี (comma-separated)
curl -X GET "http://localhost:3000/api/products?color=Gold,Silver,Rose+Gold" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# filter หลายวัสดุ + หลายประเภท
curl -X GET "http://localhost:3000/api/products?material=18K+Gold,925+Sterling+Silver&category=ring,earring" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# รวมทุก filter: สี + วัสดุ + ขนาด + ประเภท + สถานะ + เรียงลำดับ
curl -X GET "http://localhost:3000/api/products?color=Gold,Silver&material=18K+Gold&size=small,medium&category=ring,necklace&status=new_arrival&sort=price_asc&page=1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**หมายเหตุ:** ทุก filter ใส่หลายค่าได้โดยคั่นด้วย comma (`,`)

| Logic | คำอธิบาย |
|-------|----------|
| ภายในหมวดเดียวกัน | **OR** — เช่น `color=Gold,Silver` = ทองหรือเงิน |
| ระหว่างหมวด | **AND** — เช่น `color=Gold&category=ring` = แหวนที่เป็นสีทอง |

### Get Product Detail

```bash
curl -X GET http://localhost:3000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Product (Admin only)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "{\"name\": \"Gold Ring\", \"description\": \"18K gold ring with diamond\", \"category\": \"ring\", \"collection\": \"Summer 2024\", \"status\": \"new_arrival\"}"
```

**category values:** `earring`, `bracelet`, `necklace`, `ring`, `pendant`, `set`
**status values:** `new_arrival`, `seasonal`, `sale`, `discontinued`

### Update Product (Admin only)

```bash
curl -X PUT http://localhost:3000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "{\"name\": \"Updated Name\", \"status\": \"sale\"}"
```

### Delete Product (Admin only — soft delete)

```bash
curl -X DELETE http://localhost:3000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 3. Variants

### List Variants ของ Product

```bash
curl -X GET http://localhost:3000/api/products/PRODUCT_ID/variants \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Variant (Admin only)

```bash
curl -X POST http://localhost:3000/api/products/PRODUCT_ID/variants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "{\"sku\": \"GR-001-GOLD-M\", \"color\": \"Gold\", \"size\": \"medium\", \"material\": \"18K Gold\", \"price\": 45000, \"minOrder\": 5}"
```

**size values:** `small`, `medium`, `large`, `free_size`

### Update Variant (Admin only)

```bash
curl -X PUT http://localhost:3000/api/variants/VARIANT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "{\"price\": 48000, \"color\": \"Rose Gold\"}"
```

### Delete Variant (Admin only — soft delete)

```bash
curl -X DELETE http://localhost:3000/api/variants/VARIANT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 4. Images

### Upload Image (Admin only)

```bash
curl -X POST http://localhost:3000/api/images/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@./ring-photo.jpg" \
  -F "productId=PRODUCT_ID" \
  -F "isPrimary=true" \
  -F "altText=Gold Ring Front View"
```

**Form-data parameters:**

| Parameter | Required | คำอธิบาย |
|-----------|----------|----------|
| file | ✅ | ไฟล์รูป (JPEG, PNG, WebP, GIF สูงสุด 5MB) |
| productId | ✅ | ID ของสินค้า |
| variantId | ❌ | ID ของ variant (ถ้าต้องการผูกรูปกับ variant) |
| isPrimary | ❌ | `true` = รูปหลักแสดงหน้า catalog |
| altText | ❌ | คำอธิบายรูป |

**อัพโหลดรูปผูกกับ variant:**

```bash
curl -X POST http://localhost:3000/api/images/upload \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@./gold-variant.jpg" \
  -F "productId=PRODUCT_ID" \
  -F "variantId=VARIANT_ID" \
  -F "isPrimary=false" \
  -F "altText=Gold variant close-up"
```

### Delete Image (Admin only)

```bash
curl -X DELETE http://localhost:3000/api/images/IMAGE_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Reorder Image (Admin only)

```bash
curl -X PUT http://localhost:3000/api/images/IMAGE_ID/reorder \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "{\"sortOrder\": 2}"
```

**หมายเหตุ:** `sortOrder` เริ่มจาก 0 — ตัวเลขน้อยแสดงก่อน

---

## 5. Inquiries

### Submit Inquiry (Buyer)

```bash
curl -X POST http://localhost:3000/api/inquiries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "{\"name\": \"John\", \"email\": \"john@company.com\", \"company\": \"Jewelry Co.\", \"country\": \"Thailand\", \"message\": \"สนใจสั่งแหวนทอง 50 วง\", \"productId\": \"PRODUCT_ID\", \"variantId\": \"VARIANT_ID\"}"
```

### List Inquiries (Admin only)

```bash
curl -X GET "http://localhost:3000/api/inquiries?status=new_inquiry&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**status values:** `new_inquiry`, `read`, `responded`, `closed`

### Get Inquiry Detail (Admin only)

```bash
curl -X GET http://localhost:3000/api/inquiries/INQUIRY_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Update Inquiry Status (Admin only)

```bash
curl -X PUT http://localhost:3000/api/inquiries/INQUIRY_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d "{\"status\": \"responded\", \"adminNotes\": \"ส่งใบเสนอราคาแล้ว\"}"
```

---

## 6. Admin Dashboard Stats

```bash
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 4,
    "totalVariants": 7,
    "totalInquiries": 0,
    "newInquiries": 0
  }
}
```

---

## Error Response Format

ทุก API เมื่อเกิด error จะ return format นี้:

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid authorization token",
    "details": []
  }
}
```

**Error codes:** `VALIDATION_ERROR` (400), `UNAUTHORIZED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `RATE_LIMITED` (429), `OTP_EXPIRED` (400), `OTP_INVALID` (400), `INTERNAL_ERROR` (500)

---

## Test Users (Seeded)

| Email | Role |
|-------|------|
| anuwadp000@gmail.com | admin |
| buyer@example.com | buyer |

---

## หมายเหตุ

- ใช้ OTP login เท่านั้น (ไม่มี password)
- Access token หมดอายุใน 1 ชั่วโมง
- Refresh token หมดอายุใน 7 วัน
- OTP หมดอายุใน 5 นาที (ขอได้สูงสุด 3 ครั้ง / 10 นาที)
- Delete เป็น soft delete (ซ่อนจากระบบ ไม่ลบจริง)
