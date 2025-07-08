// server.js
import dotenv from 'dotenv';
dotenv.config();
import app from './src/app.js';
import routerObjective from './src/routes/objectives.routes.js';
import { startObjectiveDB } from './src/config/objectives.database.js';
import { connectDB } from './src/config/database.js';


const PORT = process.env.PORT || 3000;

connectDB().then(()=>{
    app.listen(PORT, ()=>{
        console.log("Escuchando en el puerto", PORT)
    })
})