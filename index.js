const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//config
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


//connection to mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqvcpai.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const touristSpotCollection = client.db("touristSpotDB").collection("touristSpot");
    const countriesCollection = client.db("touristSpotDB").collection("countries");

    // Get data from touristSpot
    app.get('/allTouristSpot', async (req, res) => {
      const cursor = touristSpotCollection.find();
      const results = await cursor.toArray();
      res.send(results);
    })

     //  Get data by id
    app.get('/allTouristSpot/:id', async (req, res) => {
      // console.log(req.params.id);
      const id = req.params.id;
      const results = await touristSpotCollection.findOne({ _id: new ObjectId(id) });
      console.log(results);
      res.send(results);
    });
    
    //  Get data by email holder
    app.get('/myList/:email', async (req, res) => {
      // console.log(req.params.email);
      const mail = req.params.email;
      const results = await touristSpotCollection.find({ email: mail }).toArray();
      res.send(results);
    });

   

    // Get data from Bangladesh    
    app.get('/southeastAsia/bangladesh', async (req, res) => {
      const cursor = countriesCollection.find();
      const results = await cursor.toArray();
      res.send(results);
    })

    // Post data
    app.post('/addTouristSpot', async (req, res) => {
      const newTouristSpot = req.body;
      console.log(newTouristSpot);
      const result = await touristSpotCollection.insertOne(newTouristSpot);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



//routes
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`server listening on port: ${port}`);
});