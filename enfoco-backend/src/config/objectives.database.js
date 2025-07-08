import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const objectiveSequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST || "localhost",
        dialect: process.env.DB_DIALECT || "mysql"
    }
);

export const startObjectiveDB = async () => {
    try {
        await objectiveSequelize.authenticate();
        console.log("Conexion exitosa con la base de datos");
        await objectiveSequelize.sync({force: true});
    } catch (error) {
        console.log("Error en la conexion con la base de datos", error)
    }
};
export default objectiveSequelize;