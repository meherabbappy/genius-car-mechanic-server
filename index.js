const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { json } = require('express');



const app = express();
const port = 5000;

//Middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r9qap.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanic');
        const serviceCollection = database.collection('services');

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET single Service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log("Getting Specific Service", id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })


        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log("Hit The Post Api", service);
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.send(result);
        });
        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })

    }

    finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Server');
});

app.listen(port, () => {
    console.log("Running Genius server on port", port)
})