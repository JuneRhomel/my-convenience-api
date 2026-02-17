import dotenv from "dotenv";

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    dbHost: string;
    dbName: string;
    dbPass: string;
    dbUser: string;
    jwtAccessSecret: string;
    jwtRefreshSecret: string;
    jwtAccessExpiry: string;
    jwtRefreshExpiry: string;
}

const config: Config = {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    dbHost: process.env.DB_HOST || "",
    dbName: process.env.DB_NAME || "",
    dbPass: process.env.DB_PASS || "",
    dbUser: process.env.DB_USER || "",
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
    jwtAccessExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
    jwtRefreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d"
};

export default config;