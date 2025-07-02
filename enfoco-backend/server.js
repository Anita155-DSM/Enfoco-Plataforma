// server.js
import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import routerObjective from './src/routes/objectives.routes.js';

const PORT = process.env.PORT || 3000;
app.use('api/objectives', routerObjective);
app.listen(PORT, () => {
    console.log(`Servidor de EnFoco corriendo en http://localhost:${PORT}`);
});