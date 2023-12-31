const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())






const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.stv3jdc.mongodb.net/?retryWrites=true&w=majority`;

// console.log(uri)

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
    // await client.connect();

    const techCollection = client.db("techDB").collection("tech")
    const cartCollection = client.db("techDB").collection("cart")

    // read

    app.get('/tech', async(req,res)=>{
        const cursor = techCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })


    app.get('/tech/:id',async(req,res)=>{
        const id=req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await techCollection.findOne(query);
        res.send(result)
    })

    // update

    app.put('/update/:id', async(req,res)=>{
        const id=req.params.id;
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true };
        const updateTech = req.body;
        const tech = {
            $set:{
                image : updateTech.image,
                name: updateTech.name,
                brand : updateTech.brand,
                type: updateTech.type,
                price: updateTech.price,
                rating: updateTech.rating,

            }
        }
        const result = await techCollection.updateOne(filter,tech,options)
        res.send(result)
    })

    

    // create

    app.post('/tech', async(req,res)=>{
        const addTech = req.body;
        const result =  await techCollection.insertOne(addTech)
        res.send(result)
    })


    // for cart

    app.post('/cart', async(req,res)=>{
        const details = req.body;
        console.log(details)
        const result = await cartCollection.insertOne(details)
        res.send(result)
        
    })

    app.get('/cart', async(req,res)=>{
        const cursor = cartCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })



    // delete

    app.delete('/cart/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await cartCollection.deleteOne(query)
        res.send(result)
    })




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("Server is running...")
})

app.listen(port,()=>{
    console.log(`Server is running on port:${port}`)
})