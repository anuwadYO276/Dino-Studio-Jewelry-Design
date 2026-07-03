import { z } from "zod";

// Auth validators
export const requestOtpSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  type: z.enum(["email", "phone"]),
});

export const verifyOtpSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  code: z.string().length(6, "OTP must be 6 digits"),
  type: z.enum(["email", "phone"]),
});

// Product validators
export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  category: z.enum(["earring", "bracelet", "necklace", "ring", "pendant", "set"]),
  collection: z.string().max(100).optional(),
  status: z.enum(["new_arrival", "seasonal", "sale", "discontinued"]).optional(),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Variant validators
export const createVariantSchema = z.object({
  sku: z.string().min(1).max(50),
  color: z.string().max(50).optional(),
  size: z.enum(["small", "medium", "large", "free_size"]).optional(),
  material: z.string().max(100).optional(),
  price: z.number().positive(),
  minOrder: z.number().int().min(1).optional(),
  isActive: z.boolean().optional(),
});

export const updateVariantSchema = createVariantSchema.partial();

// Inquiry validators
export const createInquirySchema = z.object({
  productId: z.string().uuid().optional(),
  variantId: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  email: z.string().email().optional(),
  company: z.string().max(255).optional(),
  country: z.string().max(100).optional(),
  message: z.string().min(1),
});

export const updateInquiryStatusSchema = z.object({
  status: z.enum(["new_inquiry", "read", "responded", "closed"]),
  adminNotes: z.string().optional(),
});

// Filter validators
export const productFilterSchema = z.object({
  category: z.string().optional(),
  collection: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  material: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "name_asc"]).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});
