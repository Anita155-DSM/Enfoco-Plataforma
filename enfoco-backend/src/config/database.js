import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // carga las variables de entorno

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql', 
        logging: false,
        port:3307
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida correctamente.');
        await sequelize.sync({ alter: true });
        console.log('Modelos sincronizados con la base de datos.');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        process.exit(1);
    }
};

export default sequelize;