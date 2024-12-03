import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import clientRoutes from "./routes/client.js";
import generalRoutes from "./routes/general.js";
import managementRoutes from "./routes/management.js";
import salesRoutes from "./routes/sales.js";
import omanToTZSRoutes from "./routes/omanToTZSRoutes.js";
import tzsToOMRRoutes from "./routes/tzaToOmanRoutes.js";
import AccountDetailsOMR from "./routes/AccountDetailsOMR.js";
import AccountDetailsTZS from "./routes/AccountDetailsTZS.js";
import  AddBankAccount  from './routes/AddAccount.js';
import  AddTransection  from './routes/AddTransection.js';

// data imports
import User from "./models/User.js";
import Product from "./models/Product.js";
import ProductStat from './models/ProductStat.js';
import Transaction from './models/Transaction.js';
import OverallStat from './models/OverallStat.js';
import AffiliateStat from './models/AffiliateStat.js';

import {
    dataUser, dataProduct, dataProductStat, dataTransaction, dataOverallStat, dataAffiliateStat
  } from "./data/index.js";

/* CONFIGURATION */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API");
});



app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes); 
// Use the separate routes
app.use('/omanToTZS', omanToTZSRoutes);
app.use('/tzsToOMR', tzsToOMRRoutes);
app.use("/AccountDetailsOMR", AccountDetailsOMR);
app.use("/AccountDetailsTZS", AccountDetailsTZS);
app.use("/accounts", AddBankAccount);
app.use("/transactions", AddTransection);


 
/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5002;
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true,useUnifiedTopology: true,}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    console.log('Connected to MongoDB');
     /* ONLY ADD DATA ONE TIME */
    // AffiliateStat.insertMany(dataAffiliateStat);
    // OverallStat.insertMany(dataOverallStat);
    // Transaction.insertMany(dataTransaction);
    // Product.insertMany(dataProduct);
    // ProductStat.insertMany(dataProductStat);
    // User.insertMany(dataUser);

}).catch((error) => console.log(`${error} did not connect`));


export default app;