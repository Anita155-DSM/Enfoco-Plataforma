// server.js
import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor de EnFoco corriendo en http://localhost:${PORT}`);
});