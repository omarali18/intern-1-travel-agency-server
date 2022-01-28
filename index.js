const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId
require('dotenv').config()
const cors = require("cors")
const app = express()


const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.av6mz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect()
        console.log("Database connected is");
        const database = client.db("internTourist");
        const experiencesCollection = database.collection("experiences");
        const usersCollection = database.collection("users")
        // const doctorCollection = database.collection("doctors")

        // get all experiences
        app.get("/experiences", async (req, res) => {
            const cursur = experiencesCollection.find({});
            const count = await cursur.count()
            const page = req.query.page
            const size = parseInt(req.query.size)
            let experiences

            if(page){
                experiences = await cursur.skip(page*size).limit(size).toArray()
            }
            else{
                experiences = await cursur.toArray();
            }
            
            res.json({count,experiences})
        })
        
        // get one experiences
        app.get("/experiences/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await experiencesCollection.findOne(query);
            res.json(result)
        });

        //post one experiences
        app.post("/experiences", async (req, res) => {
            console.log(req.body);
            const newProduct = req.body
            const result = await experiencesCollection.insertOne(newProduct)
            // console.log(result);
            res.json(result)
        })

        // user save in database
        app.post("/users", async (req, res) => {
            const user = req.body
            const result = await usersCollection.insertOne(user)
            res.json(result)

        })

        app.put("/users", async (req, res) => {
            const user = req.body
            const query = { email: user.email }
            const options = { upsert: true };
            const updateDoc = { $set: user }
            const result = await usersCollection.updateOne(query, updateDoc, options)
            res.json(result)

        });

        // make addmin 
        app.put("/users/admin", async (req, res) => {
            const user = req.body
            const filter = { email: user.email }
            const updateDoc = { $set: { role: "admin" } }
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result)
        })

        // check admin user
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email
            const filter = { email: email }
            const user = await usersCollection.findOne(filter)
            let isAdmin = false
            if (user?.role === "admin") {
                isAdmin = true
            }
            res.json({ admin: isAdmin })
        })

        // app.get("/appointments", async (req, res) => {
        //     const email = req.query?.email;
        //     const date = req.query?.date;
        //     const query = { email: email, date: date }
        //     const cursor = appointmentCollection.find(query)
        //     const appointment = await cursor.toArray()
        //     res.send(appointment)
        // });

        // app.post("/appointments", async (req, res) => {
        //     const appointment = req.body;
        //     console.log(appointment);
        //     const result = await appointmentCollection.insertOne(appointment)
        //     res.json(result)
        // });

                ////// this is complit///////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\
        // app.get("/appointments/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await appointmentCollection.findOne(query);
        //     res.json(result)
        // });

        // app.put("/appointments/:id", async (req, res) => {
        //     const id = req.params.id
        //     const payment = req.body
        //     const query = { _id: ObjectId(id) }
        //     const updateDoc = { $set: { payment: payment } }
        //     const result = await appointmentCollection.updateOne(query, updateDoc)
        //     res.json(result)
        // })

        //save doctor


                ////// this is complit///////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\
        // app.get("/doctors", async (req, res) => {
        //     const cursur = doctorCollection.find({});
        //     const doctors = await cursur.toArray();
        //     res.json(doctors)
        // })

        // app.post("/doctors", async (req, res) => {
        //     const name = req.body.name;
        //     const email = req.body.email;
        //     const pic = req.files.image;
        //     const picData = pic.data;
        //     const encodedPic = picData.toString("base64");
        //     const imageBuffer = Buffer.from(encodedPic, "base64")
        //     const doctor = {
        //         name,
        //         email,
        //         image: imageBuffer
        //     }
        //     console.log(doctor);
        //     const result = await doctorCollection.insertOne(doctor)
        //     res.json(result)

        // })

        // save user informaton
        // app.get("/users/:email", async (req, res) => {
        //     const email = req.params.email
        //     const filter = { email: email }
        //     const user = await usersCollection.findOne(filter)
        //     let isAdmin = false;
        //     if (user?.role === 'Admin') {
        //         isAdmin = true
        //     }
        //     res.json(isAdmin)
        // })

        // app.post("/users", async (req, res) => {
        //     const user = req.body;
        //     const result = await usersCollection.insertOne(user)
        //     res.json(result)
        // });

        // app.put("/users", async (req, res) => {
        //     const user = req.body;
        //     const filter = { email: user.email };
        //     const options = { upsert: true };
        //     const updateDoc = { $set: user }
        //     const result = await usersCollection.updateOne(filter, updateDoc, options)
        //     res.json(result)
        // });

        // app.put("/users/admin", verifyToken, async (req, res) => {
        //     const user = req.body;
        //     const requester = req.decodedEmail;
        //     if (requester) {
        //         const requesterAccount = await usersCollection.findOne({ email: requester })
        //         if (requesterAccount.role === "Admin") {
        //             const filter = { email: user.email }
        //             const updateDoc = { $set: { role: "Admin" } }
        //             const result = await usersCollection.updateOne(filter, updateDoc);
        //             res.json(result)
        //         }
        //     }
        //     else {
        //         res.status(403).json({ message: "You do not access to make admin." })
        //     }

        // })

        // app.post("/create-payment-intent", async (req, res) => {
        //     const paymentInfo = req.body
        //     const amount = paymentInfo.price * 100;
        //     const paymentIntent = await stripe.paymentIntents.create({
        //         currency: "USD",
        //         amount: amount,
        //         automatic_payment_methods: {
        //             enabled: true,
        //         },
        //     })
        //     res.send({
        //         clientSecret: paymentIntent.client_secret,
        //     });
        // })
    }
    finally {
        // await client.close();

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Listening to here ${port}`)
})