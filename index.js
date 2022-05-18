const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion , ObjectId } = require('mongodb');
require('dotenv').config();

//middleware



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f7v8c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const taskCollection = client.db('todo-server').collection('task');
        app.post('/task', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
          });

          app.get('/task', async (req, res) => {

            const query = {};
            const cursor = taskCollection.find(query);
            const task = await cursor.toArray();
            res.send(task);
          });
          app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
          });

    }
    finally{

    }
}
run().catch(console.dir);




app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello todo')
});

app.listen(port, () => {
  console.log(`todo app running on port ${port}`)
});


