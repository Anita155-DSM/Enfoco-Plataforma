import User from '../models/User.js';
import crypto from 'crypto';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';
import { sendVerificationEmail } from '../config/nodemailConfig.js';
//funciona perrooooo
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
                // Validación básica de campos vacíos al principio
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }


        let user = await User.findOne({ where: { email } });
        if (user) {
            return res.status(400).json({ message: 'Ya existe una cuenta con este email.' });
        }

        user = await User.findOne({ where: { username } });
        if (user) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');

        const newUser = await User.create({
            username,
            email,
            password,
            verificationToken,
            isVerified: false,
        });

        await sendVerificationEmail(newUser.email, verificationToken);

        res.status(201).json({
            message: 'Registro exitoso. Por favor, verifica tu correo electrónico para activar tu cuenta.',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                isVerified: newUser.isVerified
            }
        });

    } catch (error) {
         if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            console.error('Error de validación de Sequelize (consola interna):', errors); 
            return res.status(400).json({ message: 'Error de validación:', errors });
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
             return res.status(400).json({ message: 'El usuario o correo electrónico ya existen.' });
        }

        // Manejo para cualquier otro tipo de error no esperado
        console.error('Error interno inesperado al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar usuario.' });
    }
};

const confirmEmail = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ where: { verificationToken: token } });

        if (!user) {
            return res.status(400).send('Token de verificación no válido o expirado.');
        }

        if (user.isVerified) {
            return res.status(200).send('Tu cuenta ya ha sido verificada.');
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).send('¡Cuenta verificada exitosamente! Ahora puedes iniciar sesión.');

    } catch (error) {
        console.error('Error al confirmar correo:', error);
        res.status(500).send('Error interno del servidor al confirmar correo.');
    }
};

const loginUser = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({ 
            where: { 
                [Op.or]:[// Esto dice: busca si el 'identifier' es el email O el username
                   {email: identifier },
                   {username: identifier}
            ]
         }
    });
 // Si no se encuentra un usuario ni por email ni por username
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Si la contraseña no coincide
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        // Verifica si la cuenta está verificada
        if (!user.isVerified) {
            return res.status(403).json({ message: 'Tu cuenta no ha sido verificada. Por favor, revisa tu correo electrónico.' });
        }

        // Si todo lo anterior es exitoso, genera el token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expira en 1 hora
        );

        // Envía la respuesta de éxito
        res.status(200).json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
    }
};
export {
    registerUser,
    confirmEmail,
    loginUser,
};