import express from 'express';
import authRoutes from './routes/auth.routes';
import receiptRoutes from './routes/receipt.routes';
import { errorHandler } from './middlewares/error_handler.middlewares';
import sequelize from "./config/database";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "*", // allow all origins (for development)
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use('/api/auth', authRoutes);
app.use('/api/receipts', receiptRoutes);
app.use(errorHandler);

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected");
    } catch (err) {
        console.error("DB connection failed", err);
        process.exit(1);
    }
})();


export default app;