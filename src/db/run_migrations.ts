import sequelize from "../config/database";
import * as createUsers from "./migrations/20250131100000_create_users";
import * as createRefreshTokens from "./migrations/20250131110000_create_refresh_tokens";
import * as createReceipts from "./migrations/20250216100000_create_receipts";
async function runMigrations(): Promise<void> {
    const queryInterface = sequelize.getQueryInterface();
    try {
        await createUsers.up(queryInterface);
        console.log("Migration 20250131100000_create_users completed.");
        await createRefreshTokens.up(queryInterface);
        console.log("Migration 20250201150000_create_meter_readings completed.");
        await createReceipts.up(queryInterface);
        console.log("Migration 20250216100000_create_receipts completed.");
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

runMigrations();
