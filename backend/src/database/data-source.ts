import { DataSource } from "typeorm"
import { User } from "../entities/User"
import { WorkEntry } from "../entities/WorkEntry"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: true,
    entities: [User, WorkEntry],
    subscribers: [],
    migrations: [],
})