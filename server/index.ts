import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import product from './route/product';
dotenv.config();

// Load environment variables from .env file
const port = process.env.PORT || 5000
const app = express();
const dbUrl = process.env.DB_URL as string

mongoose.connect(dbUrl)
    .then(() => console.log("DB CONNECTED"))
    .catch((err) => console.log("DB ERROR :: ", err));

app.use(cors({ origin: "*" }))
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', async (req, res) => {
    res.status(200).send("<h1>Welcome To DataNeuron Backend.</h1>")
})

app.use('/product', product)

app.listen(port, () => {
    console.log('Server is running on port : ' + port);
});