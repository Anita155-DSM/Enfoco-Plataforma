// server.js
import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import { connectDB } from './src/config/database.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB(); 
        app.listen(PORT, () => {
            console.log(`Servidor de EnFoco corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        // Si la conexión a la base de datos falla, salimos del proceso
        process.exit(1);
    }
};

startServer(); //inico