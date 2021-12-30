const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require("cors");

const objectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
// MiddleWare
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpk1a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

//console.log(uri) // for checking user/pass is alright

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("birdInformation");
        const birdCollection = database.collection("birdCollection");
        //GET API ALL Bird

        app.get('/birdCollection', async (req, res) => {
            const cursor = birdCollection.find({});
            const bird = await cursor.toArray();
            res.send(bird)
        })

        // GET SINGLE Bird API

        app.get('/birdCollection/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: objectId(id) };
            console.log(query)
            const bird = await birdCollection.findOne(query);
            res.json(bird);
        })


        // POST API Bird
        app.post('/birdCollection', async (req, res) => {
            const bird = req.body;

            console.log("Hitting the post", bird)
            const result = await birdCollection.insertOne(bird);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.send(result)
        })

        // //DELETE API BIRD


        app.delete('/birdCollection/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: objectId(id) };
            const result = await birdCollection.deleteOne(query);

            console.log('deleting bloodGroup with id ', result);

            res.json(result);
        })
    } finally {
        //await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Server Running')
})


app.listen(port, () => {
    console.log("Running at port", port)
})












