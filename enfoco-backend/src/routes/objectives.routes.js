import express from 'express';
import { createObjective, deleteObjetive, getTodayObjectives, updateObjective } from '../controllers/objective.controllers.js';

const routerObjective = express.Router();

// GET /api/objectives/today
routerObjective.get('/objetivos/today', getTodayObjectives); 

// POST /api/objectives
routerObjective.post('/objetivos', createObjective);

// PUT /api/objectives/:id
routerObjective.put('/objetivos/:id', updateObjective);

// DELETE /api/objectives/:id
routerObjective.delete('/objetivos/:id', deleteObjetive);

export default routerObjective;