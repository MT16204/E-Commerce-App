import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import { ENV } from "../config/env.js";
import { Review } from "../models/review.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and travelers.",
    price: 149.99,
    stock: 50,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500",
    ],
    averageRating: 4.5,
    totalReviews: 128,
  },
  {
    name: "Smart Watch Series 5",
    description:
      "Advanced fitness tracking, heart rate monitor, GPS, and water-resistant design. Stay connected with notifications and apps on your wrist.",
    price: 299.99,
    stock: 35,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500",
    ],
    averageRating: 4.7,
    totalReviews: 256,
  },
  {
    name: "Leather Crossbody Bag",
    description:
      "Handcrafted genuine leather bag with adjustable strap. Features multiple compartments and elegant design perfect for daily use.",
    price: 89.99,
    stock: 25,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
    ],
    averageRating: 4.3,
    totalReviews: 89,
  },
  {
    name: "Running Shoes - Pro Edition",
    description:
      "Lightweight running shoes with responsive cushioning and breathable mesh upper. Designed for performance and comfort during long runs.",
    price: 129.99,
    stock: 60,
    category: "Shoes",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 342,
  },
  {
    name: "Bestselling Mystery Novel",
    description:
      "A gripping psychological thriller that will keep you on the edge of your seat. New York Times bestseller with over 1 million copies sold.",
    price: 24.99,
    stock: 100,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
    ],
    averageRating: 4.8,
    totalReviews: 1243,
  },
  {
    name: "Portable Bluetooth Speaker",
    description:
      "Waterproof wireless speaker with 360-degree sound, 12-hour battery life, and durable design. Perfect for outdoor adventures.",
    price: 79.99,
    stock: 45,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500",
    ],
    averageRating: 4.4,
    totalReviews: 167,
  },
  {
    name: "Classic Denim Jacket",
    description:
      "Timeless denim jacket with vintage wash and comfortable fit. A wardrobe essential that pairs perfectly with any outfit.",
    price: 69.99,
    stock: 40,
    category: "Fashion",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500",
    ],
    averageRating: 4.2,
    totalReviews: 95,
  },
  {
    name: "Yoga Mat Pro",
    description:
      "Extra-thick non-slip yoga mat with carrying strap. Eco-friendly material provides excellent cushioning and grip for all yoga styles.",
    price: 49.99,
    stock: 75,
    category: "Sports",
    images: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500",
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500",
    ],
    averageRating: 4.5,
    totalReviews: 203,
  },
  {
    name: "Mechanical Keyboard RGB",
    description:
      "Gaming keyboard with customizable RGB lighting, mechanical switches, and programmable keys. Built for gamers and typing enthusiasts.",
    price: 119.99,
    stock: 30,
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    ],
    averageRating: 4.7,
    totalReviews: 421,
  },
  {
    name: "Coffee Table Book Collection",
    description:
      "Stunning photography book featuring architecture and design from around the world. Hardcover edition with 300+ pages of inspiration.",
    price: 39.99,
    stock: 55,
    category: "Books",
    images: [
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500",
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 134,
  },
  {
    name: "Modern Velvet Sofa",
    description:
      "Elegant 3-seater sofa with velvet upholstery and gold-finished legs. Add a touch of luxury to your living room.",
    price: 599.99,
    stock: 10,
    category: "Furniture",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500"],
    averageRating: 4.8,
    totalReviews: 45,
  },
  {
    name: "Matte Lipstick Set",
    description:
      "A collection of 5 long-lasting matte lipsticks in essential shades for every occasion.",
    price: 35.0,
    stock: 100,
    category: "Cosmetics",
    images: [
      "https://images.unsplash.com/photo-1635011340525-87de5b4f170e?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 210,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB");

    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({
      "paymentResult.id": {
        $in: ["demo_payment_1", "demo_payment_2", "demo_payment_3"],
      },
    });
    console.log("🗑️  Cleared existing data");

    const insertedProducts = await Product.insertMany(
      products.map((p) => ({ ...p, averageRating: 0, totalReviews: 0 }))
    );
    console.log(`✅ Seeded ${insertedProducts.length} products`);

    for (const product of insertedProducts) {
      const originalData = products.find((p) => p.name === product.name);
      const targetCount = originalData.totalReviews;
      const targetAvg = originalData.averageRating;

      const reviews = [];
      let ratingPool = Math.round(targetAvg * targetCount);

      for (let i = 0; i < targetCount; i++) {
        const isLast = i === targetCount - 1;
        let rating;

        if (isLast) {
          rating = Math.min(5, Math.max(1, ratingPool));
        } else {
          rating = Math.min(
            5,
            Math.max(1, Math.round(targetAvg + (Math.random() - 0.5)))
          );
          ratingPool -= rating;
        }

        reviews.push({
          productId: product._id,
          userId: new mongoose.Types.ObjectId(),
          orderId: new mongoose.Types.ObjectId(),
          rating,
        });
      }

      await Review.insertMany(reviews);

      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const avg = totalRating / reviews.length;

      await Product.findByIdAndUpdate(product._id, {
        totalReviews: reviews.length,
        averageRating: Math.round(avg * 10) / 10,
      });

      console.log(
        `  ✅ ${product.name}: ${reviews.length} reviews, avg ${Math.round(avg * 10) / 10}`
      );
    }

    // ✅ Seed demo user data
    const demoUser = await User.findOne({ email: "demo@novastore.com" });

    if (demoUser) {
      await Cart.create({
        user: demoUser._id,
        clerkId: demoUser.clerkId,
        items: [],
      });
      console.log("✅ Demo cart created");

      const p1 = insertedProducts[0]; 
      const p2 = insertedProducts[3]; 
      const p3 = insertedProducts[1]; 

      await Order.insertMany([
        {
          user: demoUser._id,
          clerkId: demoUser.clerkId,
          orderItems: [{
            product: p1._id,
            name: p1.name,
            price: p1.price,
            quantity: 1,
            image: p1.images[0],
          }],
          shippingAddress: {
            fullName: "Demo User",
            streetAddress: "123 Nova Street",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            phoneNumber: "0123456789",
          },
          paymentResult: { id: "demo_payment_1", status: "succeeded" },
          totalPrice: p1.price + 10,
          status: "delivered",
        },
        {
          user: demoUser._id,
          clerkId: demoUser.clerkId,
          orderItems: [{
            product: p2._id,
            name: p2.name,
            price: p2.price,
            quantity: 2,
            image: p2.images[0],
          }],
          shippingAddress: {
            fullName: "Demo User",
            streetAddress: "123 Nova Street",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            phoneNumber: "0123456789",
          },
          paymentResult: { id: "demo_payment_2", status: "succeeded" },
          totalPrice: p2.price * 2 + 10,
          status: "shipped",
        },
        {
          user: demoUser._id,
          clerkId: demoUser.clerkId,
          orderItems: [{
            product: p3._id,
            name: p3.name,
            price: p3.price,
            quantity: 1,
            image: p3.images[0],
          }],
          shippingAddress: {
            fullName: "Demo User",
            streetAddress: "123 Nova Street",
            city: "San Francisco",
            state: "CA",
            zipCode: "94105",
            phoneNumber: "0123456789",
          },
          paymentResult: { id: "demo_payment_3", status: "succeeded" },
          totalPrice: p3.price + 10,
          status: "pending",
        },
      ]);
      console.log("✅ Demo orders created (delivered/shipped/pending)");
    } else {
      console.log("⚠️  Demo user not found — tạo demo@novastore.com trên Clerk trước");
    }

    await mongoose.connection.close();
    console.log("\n✅ Seeding completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding:", error);
    process.exit(1);
  }
};

seedDatabase();