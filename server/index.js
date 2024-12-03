// Import necessary modules
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

// Route imports
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
import omanToTZSRoutes from "./routes/omanToTZSRoutes.js";
import tzsToOMRRoutes from "./routes/tzaToOmanRoutes.js";
import AccountDetailsOMR from "./routes/AccountDetailsOMR.js";
import AccountDetailsTZS from "./routes/AccountDetailsTZS.js";
import AddBankAccount from './routes/AddAccount.js';
import AddTransection from './routes/AddTransection.js';

// Model imports
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from './models/ProductStat.js';
import Transaction from './models/Transaction.js';
import OverallStat from './models/OverallStat.js';
import AffiliateStat from './models/AffiliateStat.js';

// Data imports
import {
    dataUser, dataProduct, dataProductStat, dataTransaction, 
    dataOverallStat, dataAffiliateStat
} from "./data/index.js";

/* CONFIGURATION */
dotenv.config();
const app = express();
const __dirname = path.resolve();

// Define allowed origins
const allowedOrigins = [
    'http://localhost:3000',
    'https://currency-exchnage-6itw.vercel.app',
    'https://currency-exchnage-6itw.vercel.app/',
    'https://currency-exchange.vercel.app',
    'https://currency-exchange.vercel.app/'
];

/* MIDDLEWARE */
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Enhanced CORS configuration
const cors = require('cors');
app.use(cors({
    origin: allowedOrigins,// use your actual domain name (or localhost), using * is not recommended
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
}))

// Static file serving
app.use(express.static(path.join(__dirname, "public")));
/* ROUTES */
app.get("/", (req, res) => {
    res.send("Welcome to the Currency Exchange API");
});

// API routes
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);
app.use('/omanToTZS', omanToTZSRoutes);
app.use('/tzsToOMR', tzsToOMRRoutes);
app.use("/AccountDetailsOMR", AccountDetailsOMR);
app.use("/AccountDetailsTZS", AccountDetailsTZS);
app.use("/accounts", AddBankAccount);
app.use("/transactions", AddTransection);

/* ERROR HANDLING */
// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5002;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error('MONGO_URL is not defined in environment variables');
    process.exit(1);
}

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on Port: ${PORT}`);
        console.log('Connected to MongoDB');
    });
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

export default app;