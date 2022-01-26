const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;
// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a2vjp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("infinity_car");
    const carCollection = database.collection("car_collection");
    const usersCollection = database.collection("users_collection");
    const ordersCollection = database.collection("orders_collection");
    const reviewCollection = database.collection("review_collection");

    // POST API
    // post api for users info save to database

    app.post("/users", async (req, res) => {
      const user = req.body;
      const doc = {
        name: user.name,
        email: user.email,
      };
      const result = await usersCollection.insertOne(doc);
      res.json(result);
    });
    // put api for user admin role
    app.put("/users", async (req, res) => {
      const admin = req.body;
      const filter = { email: admin.email };
      // this option instructs the method to create a document if no documents match the filter
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    // get api for admin role
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = {email:email}
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if(user?.role === 'admin'){
          isAdmin=true;
      }
      
      res.json({admin:isAdmin});
    });
    // Post api
    // review post api
    app.post("/review", async (req, res) => {
      const feedback = req.body;
      const doc = {
        name: feedback.name,
        message: feedback.message,
        rating: feedback.rating,
      };
      const result = await reviewCollection.insertOne(doc);
      res.json(result);
    });
    // get api
    app.get("/review", async (req, res) => {
      const cursor = reviewCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // POST API
    // order post api
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const doc = {
        name: order.name,
        productName: order.productName,
        email: order.email,
        phone: order.phone,
        address: order.address,
      };

      const result = await ordersCollection.insertOne(doc);
      res.json(result);
    });

    // order get api
    // My orders get api

    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const filter = { email: email };
      const cursor = ordersCollection.find(filter);
      const result = await cursor.toArray();
      res.json(result);
    });
    // order delete api
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(filter);
      res.send(result);
    });
    // GET API
    // getting all products here
    app.get("/products", async (req, res) => {
      const cursor = carCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    // GET API
    // getting single products using id

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await carCollection.findOne(query);
      res.json(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("listing the port ", port);
});
