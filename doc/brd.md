# 💎 Dino Studio – Private Jewelry Catalog System
# Business Requirements Document (BRD)

---

## 1. Project Overview

ระบบแสดงสินค้าเครื่องประดับแบบ Private Access สำหรับลูกค้า Wholesale พร้อมระบบ Admin จัดการสินค้า  
แทนที่ PDF Catalog แบบเดิมด้วย Web-based Digital Catalog ที่สวยงามและใช้งานง่าย

---

## 2. Business Goals

| # | Goal | Measurement |
|---|------|-------------|
| 1 | จำกัดการเข้าถึงเฉพาะผู้ได้รับอนุญาต | 0% unauthorized access |
| 2 | แทนที่ PDF catalog ด้วย web catalog | ลด PDF distribution 100% |
| 3 | เพิ่มยอด inquiry จากลูกค้า B2B | เพิ่ม inquiry 30% ใน 3 เดือนแรก |
| 4 | ให้ admin จัดการสินค้าได้เอง | ไม่ต้องพึ่ง developer |
| 5 | สร้างภาพลักษณ์ luxury brand ผ่าน digital | UX/UI ระดับ premium |

---

## 3. Target Users

### 3.1 Buyers (End Users)
| User Type | Description |
|-----------|-------------|
| Wholesale Buyers | ซื้อจำนวนมากเพื่อขายต่อ |
| Jewelry Stores | ร้านเครื่องประดับที่สั่งสินค้า |
| Distributors | ตัวแทนจำหน่าย |

### 3.2 Admin (Internal Users)
| User Type | Description |
|-----------|-------------|
| Owner | เจ้าของร้าน – full access |
| Sales / Product Team | ทีมขายและจัดการสินค้า |

---

## 4. Core Business Features

### 4.1 Authentication & Access Control
- Private login ด้วย Email OTP หรือ Phone OTP
- เฉพาะ user ที่ได้รับอนุญาตเท่านั้นที่เข้าถึงระบบได้
- Role-based access (Admin / Buyer)

### 4.2 Product Catalog
- แสดงสินค้าแบบ grid/list view
- รูปภาพคุณภาพสูง
- รองรับ responsive design

### 4.3 Filter & Search System
- Filter ตาม Category, Color, Size, Material, Status
- ค้นหาด้วย keyword

### 4.4 Product Variants
- 1 Product มีได้หลาย Variants (สี / ขนาด / วัสดุ)
- แต่ละ Variant มี SKU และราคาเฉพาะ

### 4.5 Inquiry System
- Buyer ส่ง inquiry สอบถามสินค้าได้
- Admin ได้รับ notification

### 4.6 Admin Management
- CRUD Products & Variants
- จัดการรูปภาพ
- ควบคุม visibility ของสินค้า

---

## 5. Product Structure

```
Product (Design Model)
├── Name, Description, Category, Collection
├── Variant 1 (SKU-001) → Color: Gold, Size: M, Material: 18K
├── Variant 2 (SKU-002) → Color: Silver, Size: S, Material: 925
└── Images[]
```

---

## 6. Scope

### 6.1 In Scope
- Private catalog website
- OTP authentication
- Product & variant management
- Filter system
- Inquiry form
- Admin dashboard
- Image upload & management

### 6.2 Out of Scope (Phase 1)
- E-commerce / Payment gateway
- Shopping cart & checkout
- Inventory management
- Multi-language support
- Mobile app (native)
- Shipping & logistics

---

## 7. Non-functional Requirements

| Requirement | Target |
|-------------|--------|
| Page Load Time | < 3 seconds |
| Concurrent Users | 50+ simultaneous |
| Uptime | 99.5% |
| Image Load | Optimized / lazy load |
| Mobile Responsive | ✅ Required |
| Browser Support | Chrome, Safari, Firefox (latest 2 versions) |
| Security | HTTPS, JWT, OTP expiration |

---

## 8. Assumptions & Constraints

### Assumptions
- ลูกค้ามี email หรือเบอร์โทรสำหรับรับ OTP
- Admin มีความสามารถใช้ web browser ขั้นพื้นฐาน
- รูปภาพสินค้าถ่ายพร้อมก่อน upload
- Internet connection ของ user มีความเสถียร

### Constraints
- Budget จำกัด — ใช้ open-source tools เป็นหลัก
- ต้อง launch ภายใน timeline ที่กำหนด
- OTP provider ต้องรองรับเบอร์ไทย

---

## 9. Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| OTP provider downtime | High | Low | Fallback provider / retry mechanism |
| Image storage full | Medium | Medium | Cloud storage with auto-scaling |
| Unauthorized access attempt | High | Medium | Rate limiting, OTP expiration |
| Slow page load (heavy images) | Medium | High | Image optimization, CDN |
| Admin error (delete product) | Medium | Medium | Soft delete, confirmation dialog |

---

## 10. Success Criteria

| # | Criteria | How to Measure |
|---|----------|----------------|
| 1 | Only authorized users can access | 0 unauthorized access incidents |
| 2 | Filter works accurately | QA test all filter combinations |
| 3 | Admin can manage products without dev | Admin completes CRUD independently |
| 4 | System feels like luxury digital catalog | User feedback score ≥ 4/5 |
| 5 | Inquiry submission works | 100% inquiry stored & notified |

---

## 11. Timeline (Estimated)

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1: Design & Setup | 1 week | Wireframe, DB schema, project setup |
| Phase 2: Core Development | 2-3 weeks | Auth, Catalog, Filter, Admin CRUD |
| Phase 3: Polish & Testing | 1 week | UI polish, testing, bug fixes |
| Phase 4: Deployment | 2-3 days | Production deployment, monitoring |

---
