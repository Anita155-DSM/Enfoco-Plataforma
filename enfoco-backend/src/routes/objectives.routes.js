import express from 'express';
import { Op } from 'sequelize';
import { Objective } from '../models/Objective.js';

const routerObjective = express.Router();

// GET /api/objectives/today
routerObjective.get('/today', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const objectives = await Objective.findAll({
            where: {
                date: today,
                userId: req.user.id // Asumiendo autenticación
            },
            order: [['priority', 'ASC'], ['createdAt', 'ASC']]
        });
        res.json(objectives);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/objectives
routerObjective.post('/', async (req, res) => {
    try {
        const { title, description, priority } = req.body;
        const today = new Date().toISOString().split('T')[0];

        // Validar máximo 3 objetivos por día
        const count = await Objective.count({
            where: { date: today, userId: req.user.id }
        });

        if (count >= 3) {
            return res.status(400).json({
                error: 'Máximo 3 objetivos por día permitidos'
            });
        }

        const objective = await Objective.create({
            title,
            description,
            priority,
            date: today,
            userId: req.user.id
        });

        res.status(201).json(objective);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/objectives/:id
routerObjective.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        await Objective.update(updates, {
            where: { id, userId: req.user.id }
        });

        const objective = await Objective.findByPk(id);
        res.json(objective);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/objectives/:id
routerObjective.delete('/:id', async (req, res) => {
    try {
        await Objective.destroy({
            where: { id: req.params.id, userId: req.user.id }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default routerObjective;