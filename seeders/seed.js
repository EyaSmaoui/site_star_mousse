require('dotenv').config();

const mongoose = require('mongoose');
const { connectToMongoDB } = require('../config/mongo.connection');

// models that we want to seed
const Product = require('../models/product.model');
const Category = require('../models/category.model');


async function clearData() {
  await Product.deleteMany({});
  await Category.deleteMany({});
  // add other models here if later required (orders, users, etc.)
}

async function createSampleData() {
  // only products and categories are created, no users/orders/reviews/paniers

  const mattresses = [
    { name: "Confort Plus", type: "Basique", variants: [
      { dimension: "90x190", price: 199 },
      { dimension: "120x190", price: 250 },
      { dimension: "140x190", price: 280 },
      { dimension: "160x200", price: 300 },
      { dimension: "180x200", price: 319 },
    ]},
    { name: "Venise Plus", type: "Orthopédique", variants: [
      { dimension: "90x190", price: 300 },
      { dimension: "120x190", price: 450 },
      { dimension: "140x190", price: 600 },
      { dimension: "160x200", price: 750 },
      { dimension: "180x200", price: 935 },
    ]},
    { name: "Soft Plus", type: "Orthopédique", variants: [
      { dimension: "90x190", price: 250 },
      { dimension: "120x190", price: 350 },
      { dimension: "140x190", price: 450 },
      { dimension: "160x200", price: 520 },
      { dimension: "180x200", price: 600 },
    ]},
    { name: "Medico Plus", type: "Orthomédicale", variants: [
      { dimension: "90x190", price: 420 },
      { dimension: "120x190", price: 650 },
      { dimension: "140x190", price: 950 },
      { dimension: "160x200", price: 1200 },
      { dimension: "180x200", price: 1530 },
    ]},
    { name: "Relax Plus", type: "Ergonomique", variants: [
      { dimension: "90x190", price: 510 },
      { dimension: "120x190", price: 750 },
      { dimension: "140x190", price: 1100 },
      { dimension: "160x200", price: 1500 },
      { dimension: "180x200", price: 1850 },
    ]},
    { name: "Tendresse", type: "Ergonomique", variants: [
      { dimension: "90x190", price: 700 },
      { dimension: "120x190", price: 1100 },
      { dimension: "140x190", price: 1600 },
      { dimension: "160x200", price: 2100 },
      { dimension: "180x200", price: 2555 },
    ]},
    { name: "Pillow Top Tendresse", type: "Pillow Top", variants: [
      { dimension: "90x190", price: 1120 },
      { dimension: "120x190", price: 1500 },
      { dimension: "140x190", price: 1900 },
      { dimension: "160x200", price: 2200 },
      { dimension: "180x200", price: 2550 },
    ]},
    { name: "Pillow Top Relax", type: "Pillow Top", variants: [
      { dimension: "90x190", price: 920 },
      { dimension: "120x190", price: 1200 },
      { dimension: "140x190", price: 1500 },
      { dimension: "160x200", price: 1700 },
      { dimension: "180x200", price: 1970 },
    ]},
    { name: "Pillow Top Medico", type: "Pillow Top", variants: [
      { dimension: "90x190", price: 770 },
      { dimension: "120x190", price: 1100 },
      { dimension: "140x190", price: 1350 },
      { dimension: "160x200", price: 1500 },
      { dimension: "180x200", price: 1750 },
    ]},
    { name: "Pillow Top Venise", type: "Pillow Top", variants: [
      { dimension: "90x190", price: 630 },
      { dimension: "120x190", price: 850 },
      { dimension: "140x190", price: 1050 },
      { dimension: "160x200", price: 1200 },
      { dimension: "180x200", price: 1350 },
    ]},
    { name: "Baby Venise", type: "Bébés", variants: [
      { dimension: "60x120", price: 230 },
      { dimension: "70x140", price: 287 },
    ]},
  ];

  // create categories for each unique type
  const typeMap = {};
  for (const mat of mattresses) {
    if (!typeMap[mat.type]) {
      const cat = await Category.create({ name: mat.type });
      typeMap[mat.type] = cat;
    }
  }

  const products = [];
  for (const mat of mattresses) {
    for (const variant of mat.variants) {
      const p = await Product.create({
        name: `${mat.name} ${variant.dimension}`,
        price: variant.price,
        category: typeMap[mat.type]._id,
        stock: 100, // default inventory count
      });
      products.push(p);
    }
  }
}

(async () => {
  try {
    await connectToMongoDB();
    console.log('clearing existing data');
    await clearData();
    console.log('inserting sample data');
    await createSampleData();
    console.log('seeding finished');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
})();
