import app from './app';
import config from './config/config';
import sequelize from "./config/database";
const http = require("http");




const server = http.createServer(app);

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected");
    } catch (err) {
        console.error("DB connection failed", err);
        process.exit(1);
    }
})();


server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});