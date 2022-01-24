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
