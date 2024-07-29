const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tdjlbxg.mongodb.net/?appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productsCollection = client
      .db("groceriesStore")
      .collection("products");
    const cartsCollection = client.db("groceriesStore").collection("carts");
    const wishlistsCollection = client
      .db("groceriesStore")
      .collection("wishlists");

    app.get("/products", async (req, res) => {
      const query = {};
      const categories = await productsCollection.find(query).toArray();
      res.send(categories);
    });
    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cartsCollection.insertOne(cartItem);
      res.send(result);
    });

    app.get("/carts", async (req, res) => {
      const result = await cartsCollection.find().toArray();
      console.log(result);
      res.send(result);
    });

    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/wishlists", async (req, res) => {
      const cartItem = req.body;
      const result = await wishlistsCollection.insertOne(cartItem);
      console.log(result);
      res.send(result);
    });
    app.get("/wishlists", async (req, res) => {
      const result = await wishlistsCollection.find().toArray();
      console.log(result);
      res.send(result);
    });
    app.delete("/wishlists/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await wishlistsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Online Groceries website server is running");
});

app.listen(port, () => {
  console.log(`Online Groceries website server is running on ${port} port`);
});
