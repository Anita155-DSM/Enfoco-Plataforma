import { Objective } from "../models/Objective.model,js";

export const createObjective = async (req, res) => {
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
};

export const getTodayObjectives = async (req, res) => {
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
};

export const updateObjective = async (req, res) => {
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
};

export const deleteObjetive = async (req, res) => {
    try {
        await Objective.destroy({
            where: { id: req.params.id, userId: req.user.id }
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};