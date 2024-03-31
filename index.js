const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URL = process.env.MONGODB_URI || "mongodb://localhost:27017/nodeapp";
console.log("Accually MongoDB URL is ===>" + MONGO_URL)

let MONGODB_URI = "mongodb://mongodb-service:27017/nodeapp";
console.log("kuberenates url :: "+MONGODB_URI)
// Connect to MongoDB
const connectdb = async () => {
    try{
        await mongoose.connect('mongodb://localhost:27017/nodeapp');
        console.log("database is connect ")
    }catch(e){
        console.log("Custom Error ::: "+e)
    }
}
connectdb();

// Create a Mongoose model
const Email = mongoose.model('Email', {
    email: String,
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/add-email', async (req, res) => {
    const { email } = req.body;
    try {
        const newEmail = new Email({ email });
        await newEmail.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error adding email');
    }
});

app.get('/emails', async (req, res) => {
    try {
        const emails = await Email.find({});
        res.json(emails);
    } catch (error) {
        res.status(500).send('Error fetching emails');
    }
});

app.get('/exit', (req, res) => {
    // Perform actions to stop the server or any other desired actions
    res.send('Server stopped');
    process.exit(0); // This stops the server (not recommended in production)
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});