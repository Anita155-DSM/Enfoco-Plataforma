import { DataTypes } from "sequelize";
import { objectiveSequelize } from "../config/objectives.database";

const Objetivos = objectiveSequelize.define(
    "Objetivos",
    {
        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        prioridad: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        completado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        fecha: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        }
    }
);

export default Objetivos;