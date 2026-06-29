import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DB_SERVER || "localhost",
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "anuwadp000@gmail.com" },
    update: {},
    create: {
      email: "anuwadp000@gmail.com",
      name: "Admin",
      role: "admin",
      status: "active",
    },
  });
  console.log("Admin user created:", admin.id, admin.email);

  // Create a sample buyer
  const buyer = await prisma.user.upsert({
    where: { email: "buyer@example.com" },
    update: {},
    create: {
      email: "buyer@example.com",
      name: "Sample Buyer",
      company: "Test Jewelry Co.",
      country: "Thailand",
      role: "buyer",
      status: "active",
    },
  });
  console.log("Buyer user created:", buyer.id, buyer.email);

  // Create sample products
  const product1 = await prisma.product.create({
    data: {
      name: "Golden Elegance Earring",
      description: "Handcrafted 18K gold earring with natural diamond accents. Perfect for special occasions.",
      category: "earring",
      collection: "Royal Collection 2024",
      status: "new_arrival",
      variants: {
        create: [
          {
            sku: "GE-EAR-001-GS",
            color: "Gold",
            size: "small",
            material: "18K Gold",
            price: 45000,
            minOrder: 5,
          },
          {
            sku: "GE-EAR-001-GM",
            color: "Gold",
            size: "medium",
            material: "18K Gold",
            price: 55000,
            minOrder: 5,
          },
        ],
      },
    },
  });
  console.log("Product created:", product1.name);

  const product2 = await prisma.product.create({
    data: {
      name: "Silver Moon Necklace",
      description: "Sterling silver necklace with crescent moon pendant. Minimalist design for everyday wear.",
      category: "necklace",
      collection: "Minimal Line",
      status: "new_arrival",
      variants: {
        create: [
          {
            sku: "SM-NCK-001-S925",
            color: "Silver",
            size: "free_size",
            material: "925 Sterling Silver",
            price: 12500,
            minOrder: 10,
          },
        ],
      },
    },
  });
  console.log("Product created:", product2.name);

  const product3 = await prisma.product.create({
    data: {
      name: "Diamond Solitaire Ring",
      description: "Classic solitaire ring with 0.5ct natural diamond. Available in white and rose gold.",
      category: "ring",
      collection: "Royal Collection 2024",
      status: "new_arrival",
      variants: {
        create: [
          {
            sku: "DS-RNG-001-WG",
            color: "White Gold",
            size: "small",
            material: "18K White Gold",
            price: 89000,
            minOrder: 3,
          },
          {
            sku: "DS-RNG-001-RG",
            color: "Rose Gold",
            size: "medium",
            material: "18K Rose Gold",
            price: 92000,
            minOrder: 3,
          },
        ],
      },
    },
  });
  console.log("Product created:", product3.name);

  const product4 = await prisma.product.create({
    data: {
      name: "Pearl Bracelet Set",
      description: "Freshwater pearl bracelet with 14K gold clasp. Elegant and timeless.",
      category: "bracelet",
      collection: "Pearl Series",
      status: "seasonal",
      variants: {
        create: [
          {
            sku: "PB-BRC-001-WH",
            color: "White Pearl",
            size: "medium",
            material: "14K Gold + Freshwater Pearl",
            price: 28000,
            minOrder: 5,
          },
          {
            sku: "PB-BRC-001-PK",
            color: "Pink Pearl",
            size: "medium",
            material: "14K Gold + Freshwater Pearl",
            price: 32000,
            minOrder: 5,
          },
        ],
      },
    },
  });
  console.log("Product created:", product4.name);

  console.log("\n✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
