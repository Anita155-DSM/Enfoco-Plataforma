import express from 'express';
import { createObjective, deleteObjetive, getTodayObjectives, updateObjective } from '../controllers/objective.controllers.js';

const routerObjective = express.Router();

// GET /api/objectives/today
routerObjective.get('/today', getTodayObjectives); 

// POST /api/objectives
routerObjective.post('/', createObjective);

// PUT /api/objectives/:id
routerObjective.put('/:id', updateObjective);

// DELETE /api/objectives/:id
routerObjective.delete('/:id', deleteObjetive);

export default routerObjective;