import 'tsconfig-paths/register';
//Basic Express Server with TypeScript and nodejs with mongodb

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";    
import connectToDatabase from "@config/database";

//importing the routes
import Routes from "@routes/index";
import WebhookRoutes from "@routes/webhooks";
import ItemsRoutes from "@routes/items";
import logger from "@utils/logger";

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use('/', Routes);
app.use('/webhooks', WebhookRoutes);
app.use('/items', ItemsRoutes);

const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
    }
};

startServer();

