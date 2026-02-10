import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

// Sample product data - matches frontend products
const products = [
  {
    name: "Eternal Grace Necklace",
    price: 189.99,
    category: "Necklaces",
    description: "A delicate handcrafted necklace featuring a teardrop pendant with intricate filigree work. Perfect for both everyday elegance and special occasions.",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    details: [
      "18K gold-plated brass",
      "Adjustable chain length: 16-18 inches",
      "Hypoallergenic",
      "Handcrafted with care"
    ],
    stockQuantity: 50
  },
  {
    name: "Celestial Stud Earrings",
    price: 79.99,
    category: "Earrings",
    description: "Minimalist star-shaped studs that catch the light beautifully. These versatile earrings add a touch of sparkle to any outfit.",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    details: [
      "Sterling silver with cubic zirconia",
      "Post back closure",
      "Diameter: 8mm",
      "Tarnish-resistant coating"
    ],
    stockQuantity: 100
  },
  {
    name: "Infinity Love Ring",
    price: 129.99,
    category: "Rings",
    description: "A timeless symbol of eternal love, this delicate infinity ring is perfect for stacking or wearing alone as a statement piece.",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    details: [
      "14K rose gold plated",
      "Available in sizes 5-9",
      "Width: 2mm",
      "Nickel-free"
    ],
    stockQuantity: 75
  },
  {
    name: "Pearl Drops Earrings",
    price: 149.99,
    category: "Earrings",
    description: "Elegant freshwater pearl drops suspended from delicate gold hooks. These earrings exude sophistication and timeless beauty.",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    details: [
      "Genuine freshwater pearls",
      "14K gold-filled hooks",
      "Pearl size: 10-11mm",
      "Length: 1.5 inches"
    ],
    stockQuantity: 60
  },
  {
    name: "Moonstone Pendant",
    price: 199.99,
    category: "Necklaces",
    description: "A mystical moonstone centerpiece surrounded by a halo of micro-pave crystals, creating an ethereal glow against your skin.",
    imageUrl: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80",
    details: [
      "Natural moonstone (8mm)",
      "Sterling silver setting",
      "Chain length: 18 inches",
      "Lobster clasp closure"
    ],
    stockQuantity: 40
  },
  {
    name: "Vintage Rose Bracelet",
    price: 169.99,
    category: "Bracelets",
    description: "Inspired by Victorian gardens, this bracelet features hand-carved rose motifs with subtle antique finishing.",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    details: [
      "Antique gold plating",
      "Adjustable length: 7-8 inches",
      "Toggle clasp",
      "Hand-engraved details"
    ],
    stockQuantity: 45
  },
  {
    name: "Geometric Cuff Bangle",
    price: 139.99,
    category: "Bracelets",
    description: "Modern and bold, this architectural cuff makes a statement with clean lines and a sophisticated matte finish.",
    imageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    details: [
      "Brushed brass with matte coating",
      "Width: 15mm",
      "Adjustable opening",
      "Tarnish-resistant"
    ],
    stockQuantity: 80
  },
  {
    name: "Diamond Halo Ring",
    price: 299.99,
    category: "Rings",
    description: "A stunning centerpiece surrounded by a brilliant halo of pavé-set stones. Perfect for engagements or as a luxurious treat.",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    details: [
      "Cubic zirconia stones",
      "14K white gold plated",
      "Available in sizes 5-9",
      "Total carat weight: 2.5ct equivalent"
    ],
    stockQuantity: 30
  },
  {
    name: "Layered Chain Necklace",
    price: 159.99,
    category: "Necklaces",
    description: "Three delicate chains of varying lengths create a perfectly layered look. Minimalist yet impactful.",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    details: [
      "Triple-layer design",
      "14K gold vermeil",
      "Lengths: 14, 16, 18 inches",
      "Spring ring clasps"
    ],
    stockQuantity: 65
  },
  {
    name: "Sapphire Teardrop Earrings",
    price: 219.99,
    category: "Earrings",
    description: "Rich blue sapphire-colored stones in an elegant teardrop setting. These earrings add a pop of color and luxury.",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
    details: [
      "Synthetic sapphire",
      "Sterling silver setting",
      "Stone size: 12x8mm",
      "French hook backs"
    ],
    stockQuantity: 55
  },
  {
    name: "Twisted Band Ring",
    price: 99.99,
    category: "Rings",
    description: "A unique twisted design that catches light from every angle. Perfect for everyday wear or special occasions.",
    imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
    details: [
      "Sterling silver",
      "Width: 3mm",
      "Available in sizes 5-9",
      "High-polish finish"
    ],
    stockQuantity: 90
  },
  {
    name: "Charm Bracelet Set",
    price: 179.99,
    category: "Bracelets",
    description: "Customize your story with this delicate chain bracelet featuring three interchangeable charms representing love, hope, and dreams.",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    details: [
      "14K gold-plated chain",
      "Includes 3 charms",
      "Length: 7.5 inches",
      "Lobster clasp closure"
    ],
    stockQuantity: 70
  }
];

/**
 * Seed Database with Products
 */
const seedProducts = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('🌱 Starting database seed...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert new products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${createdProducts.length} products`);

    // Display created products
    console.log('\n📦 Seeded Products:');
    createdProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - $${product.price}`);
    });

    console.log('\n✨ Database seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed function
seedProducts();
