import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';

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
        type: DataTypes.STRING(255),
        allowNull: false
    },
    verificationToken: {
        type: DataTypes.STRING, // Tipo de datos para almacenar el token
        allowNull: true // Puede ser nulo hasta que se genere, y luego nulo de nuevo tras verificar
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'users',
    timestamps: true,// esto añade automáticamente createdAt y updatedAt
        hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => { // También es buena práctica para actualizaciones
            if (user.changed('password') && user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Este archivo define el modelo de datos 'User' para Sequelize.
export default User;