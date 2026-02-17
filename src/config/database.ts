import { Sequelize } from "sequelize";
import config from "./config";

const sequelize = new Sequelize(
   config.dbName!,
   config.dbUser!,
   config.dbPass!,
    {
        host: config.dbHost,
        dialect: "mysql",
        logging: false
    }
);

export default sequelize;
