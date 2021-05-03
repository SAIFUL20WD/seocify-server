const express = require('express')
const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qnwxy.mongodb.net/seocify?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const servicesCollection = client.db("seocify").collection("services");
  const reviewsCollection = client.db("seocify").collection("reviews");
  const adminsCollection = client.db("seocify").collection("admins");
  const ordersCollection = client.db("seocify").collection("orders");

  app.get('/services', (req, res) => {
    servicesCollection.find({}).toArray( (err, documents) => {
      res.send(documents)
    })
  }) 

  app.post('/addService', (req, res) => {
    const serviceDetail = req.body
    servicesCollection.insertOne(serviceDetail)
    .then( result => {
      res.send(result.insertedCount > 0)
    })
    .catch(error => console.log(error))
  })

  app.get('/reviews', (req, res) => {
    reviewsCollection.find({}).toArray( (err, documents) => {
      res.send(documents)
    })
  })  

  app.post('/addReview', (req, res) => {
    const reviewDetail = req.body
    reviewsCollection.insertOne(reviewDetail)
    .then( result => {
      res.send(result.insertedCount > 0)
    })
    .catch(error => console.log(error))
  })

  app.delete('/deleteService/:id', (req, res) => {
    const serviceId = ObjectID(req.params.id)
    servicesCollection.findOneAndDelete({_id: serviceId})
    .then( result => {
      res.send(result.deletedCount > 0);
    })
    .catch(error => console.log(error))
  })

  app.post('/addAdmin', (req, res) => {
    const adminDetail = req.body
    adminsCollection.insertOne(adminDetail)
    .then( result => {
      res.send(result.insertedCount > 0)
    })
    .catch(error => console.log(error))
  })

    app.post('/isAdmin', (req, res) => {
    const email = req.body.email;
    adminsCollection.find({ email: email })
        .toArray((err, result) => {
            res.send(result.length > 0);
        })

    })

    app.get('/service/:id', (req, res) => {
        const serviceId = ObjectID(req.params.id)
        servicesCollection.findOne({_id: serviceId})
        .then(result => res.send(result))
        .catch(error => console.log(error))
    })

    app.post('/placeOrder', (req, res) => {
        const orderDetail = req.body
        ordersCollection.insertOne(orderDetail)
        .then( result => {
          res.send(result.insertedCount > 0)
        })
        .catch(error => console.log(error))
    })
    
    app.get('/orders', (req, res) => {
    const userEmail = req.query.email
    ordersCollection.find({email: userEmail}).toArray( (err, documents) => {
        res.send(documents)
        })
    })

    app.get('/allOrders', (req, res) => {
    ordersCollection.find({}).toArray( (err, documents) => {
      res.send(documents)
    })
  }) 

})

app.listen(port)