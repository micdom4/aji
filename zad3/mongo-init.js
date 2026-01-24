db = db.getSiblingDB('aji');

db.categories.drop();
db.products.drop();
db.statuses.drop();
db.orders.drop();
db.users.drop();

db.createCollection('categories');
db.createCollection('products');
db.createCollection('statuses');
db.createCollection('orders');
db.createCollection('users');

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

var laptop = {
  _id: ObjectId(),
  name: "Gaming Laptop",
  description: "High-performance laptop with RGB lighting",
  unitPrice: 1500,
  unitWeight: 2.5,
  category: {
    _id: electronicsId,
    name: "Electronics"
  }
};

var dumbbell = {
  _id: ObjectId(),
  name: "Heavy Dumbbell",
  description: "Cast iron hexagonal dumbbell",
  unitPrice: 50,
  unitWeight: 10,
  category: {
    _id: gymId,
    name: "Gym Equipment"
  }
};

var mouse = {
  _id: ObjectId(),
  name: "Wireless Mouse",
  description: "Ergonomic mouse for coding",
  unitPrice: 25.50,
  unitWeight: 1.2,
  category: {
    _id: electronicsId,
    name: "Electronics"
  }
};

db.products.insertMany([laptop, dumbbell, mouse]);

db.statuses.insertMany([
  { name: 'UNACCEPTED' },
  { name: 'ACCEPTED' },
  { name: 'CANCELED' },
  { name: 'REALIZED' }
]);

const canceledStatus = db.statuses.findOne({ name: 'canceled' });
const unacceptedStatus = db.statuses.findOne({ name: 'UNACCEPTED' });
const acceptedStatus = db.statuses.findOne({ name: 'ACCEPTED' });
const realizedStatus = db.statuses.findOne({ name: 'REALIZED' });


db.orders.insertMany([
  {
    date: new Date("2023-10-01T10:00:00Z"),
    username: "client",
    email: "john@example.com",
    phoneNumber: "555-0101",
    state: realizedStatus,
    productList: [laptop, mouse]
  },
  {
    date: new Date("2023-10-02T14:30:00Z"),
    username: "worker",
    email: "jane@example.com",
    phoneNumber: "555-0202",
    state: acceptedStatus,
    productList: [dumbbell, dumbbell]
  },
  {
    date: new Date("2023-10-05T09:15:00Z"),
    username: "worker",
    email: "bob@example.com",
    phoneNumber: "555-0303",
    state: realizedStatus,
    productList: [laptop]
  }
]);

db.users.insertMany([
  {
    username: "worker",
    password: "password",
    role: "WORKER",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    username: "client",
    password: "password",
    role: "CLIENT",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);
