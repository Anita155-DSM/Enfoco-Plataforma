import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(55),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true // validación simple de email
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // verificationToken: {
    //     type: DataTypes.STRING, // Tipo de datos para almacenar el token
    //     allowNull: true // Puede ser nulo hasta que se genere, y luego nulo de nuevo tras verificar
    // },
    // isVerified: {
    //     type: DataTypes.BOOLEAN,
    //     defaultValue: false
    // }
});

// Este archivo define el modelo de datos 'User' para Sequelize.
export default User;