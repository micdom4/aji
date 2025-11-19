db = db.getSiblingDB('aji');

db.categories.drop();
db.products.drop();

db.createCollection('categories');
db.createCollection('products');

var electronicsId = ObjectId();
var gymId = ObjectId();

db.categories.insertMany([
  {
    _id: electronicsId,
    name: "Electronics"
  },
  {
    _id: gymId,
    name: "Gym Equipment"
  }
]);

db.products.insertMany([
  {
    name: "Gaming Laptop",
    description: "High-performance laptop with RGB lighting",
    unitPrice: 1500,
    unitWeight: 2.5,
    category: {
      _id: electronicsId,
      name: "Electronics"
    }
  },
  {
    name: "Heavy Dumbbell",
    description: "Cast iron hexagonal dumbbell",
    unitPrice: 50,
    unitWeight: 10,
    category: {
      _id: gymId,
      name: "Gym Equipment"
    }
  },
  {
    name: "Wireless Mouse",
    description: "Ergonomic mouse for coding",
    unitPrice: 25.50,
    unitWeight: 1.2,
    category: {
      _id: electronicsId,
    }
  }
]);
