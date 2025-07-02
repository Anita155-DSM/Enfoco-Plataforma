// server.js
import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import routerObjective from './src/routes/objectives.routes.js';
import { startObjectiveDB } from './src/config/objectives.database.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor de EnFoco corriendo en http://localhost:${PORT}`);
});