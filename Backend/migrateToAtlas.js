const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const products = [
    {
        name: "Premium Velvet Sofa",
        description: "Luxury velvet sofa with ergonomic design and premium comfort for your living room.",
        category: "Furniture",
        subCategory: "Sofa",
        images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800"],
        rentPrice: 1299,
        securityDeposit: 3000,
        tenureOptions: [3, 6, 12, 24],
        stock: 15,
        brand: "UrbanLiving",
        rating: 4.8,
        reviews: 124,
        isFeatured: true,
        specifications: {
            "Material": "Velvet",
            "Color": "Emerald Green",
            "Dimensions": "84\"W x 34\"D x 30\"H",
            "Seating Capacity": "3 Seater"
        },
        features: ["Premium Velvet Fabric", "Sturdy Wooden Frame", "High-Density Foam", "Easy to Clean"]
    },
    {
        name: "Smart Inverter Refrigerator",
        description: "Energy-efficient 250L double-door refrigerator with smart cooling technology.",
        category: "Appliances",
        subCategory: "Fridge",
        images: ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800"],
        rentPrice: 899,
        securityDeposit: 2500,
        tenureOptions: [6, 12, 24],
        stock: 20,
        brand: "CoolTech",
        rating: 4.9,
        reviews: 89,
        isFeatured: true,
        specifications: {
            "Capacity": "250 Liters",
            "Type": "Double Door",
            "Energy Rating": "5 Star",
            "Cooling Type": "Frost Free"
        },
        features: ["Smart Inverter Compressor", "Multi Air Flow", "Deodorizer", "Moist Balance Crisper"]
    },
    {
        name: "Ergonomic Office Chair",
        description: "High-back mesh chair with adjustable lumbar support and headrest for long working hours.",
        category: "Furniture",
        subCategory: "Chair",
        images: ["https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=800"],
        rentPrice: 499,
        securityDeposit: 1000,
        tenureOptions: [3, 6, 12],
        stock: 50,
        brand: "WorkWell",
        rating: 4.7,
        reviews: 215,
        isFeatured: false,
        specifications: {
            "Material": "Mesh & Steel",
            "Color": "Black",
            "Adjustability": "Height & Tilt",
            "Base": "5-Point Nylon"
        },
        features: ["Adjustable Lumbar Support", "Breathable Mesh Back", "Padded Armrests", "360-Degree Swivel"]
    },
    {
        name: "4K Ultra HD Smart TV",
        description: "55-inch smart TV with HDR support and all major streaming apps built-in.",
        category: "Appliances",
        subCategory: "TV",
        images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800"],
        rentPrice: 1599,
        securityDeposit: 4000,
        tenureOptions: [6, 12, 24],
        stock: 12,
        brand: "VisionPlus",
        rating: 4.8,
        reviews: 67,
        isFeatured: true,
        specifications: {
            "Screen Size": "55 Inches",
            "Resolution": "4K Ultra HD",
            "OS": "Smart Android TV",
            "HDMI Ports": "3"
        },
        features: ["Crystal Processor 4K", "Built-in Alexa/Google", "HDR10+", "Ultra Slim Design"]
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to Atlas for seeding...');

        // Clear and Seed Products
        console.log('Cleaning up existing products...');
        await Product.deleteMany({});
        await Product.insertMany(products);
        console.log(`✅ ${products.length} products seeded with full details!`);

        console.log('Migration to Atlas Complete!');
        process.exit();
    } catch (error) {
        console.error('Error during Atlas migration:', error);
        process.exit(1);
    }
};

seedDatabase();
