import isEmail from 'validator/lib/isEmail.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

// Función auxiliar para validar el formato del email de forma más estricta
const isValidEmail = (email) => {
    const emailRegex = new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return emailRegex.test(email);
};

// Controlador para registrar un nuevo usuario
const registerUser = async (req, res) => {

    //Quitarle espacios extra a los datos
    for(const key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
        }
    }

    console.log(req.body)
    
    const { username, email, password} = req.body;
    // const trimmedUsername = username;
    // const trimmedEmail = email.trim();
    // const trimmedPassword = password.trim();
    // const trimmedConfirmPassword = confirmPassword.trim();

    // console.log('--- Proceso de Registro (Contraseña Plana) ---');
    // console.log('Datos recibidos (req.body):', req.body);
    // console.log('Username (trimmed):', trimmedUsername);
    // console.log('Email (trimmed):', trimmedEmail);
    // console.log('Password (plana - trimmed):', trimmedPassword);
    // console.log('ConfirmPassword (trimmed):', trimmedConfirmPassword);

    try {
        if (!username|| !email|| !password) {
            console.log('Error: Campos obligatorios faltantes.');
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        // if (password !== confirmPassword) {
        //     console.log('Error: Las contraseñas no coinciden.');
        //     return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
        // }

        if (!isValidEmail(email)) {
            console.log('Error: Formato de email no válido.');
            return res.status(400).json({ message: 'El formato del email no es válido. Por favor, introduce un email real.' });
        }

        let user = await User.findOne({ where: { email: email } });
        if (user) {
            console.log('Error: Email ya registrado.');
            return res.status(400).json({ message: 'Ya existe una cuenta con este email.' });
        }

        user = await User.findOne({ where: { username: username } });
        if (user) {
            console.log('Error: Nombre de usuario ya en uso.');
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso.' });
        }

        // *** CAMBIO CLAVE PARA CONTRASEÑA PLANA EN REGISTRO ***
        // Comentamos la línea de hasheo
        // const hashedPassword = await bcrypt.hash(trimmedPassword, 10);
        // Y usamos la contraseña plana directamente
        const newUser = await User.create({
            username: username,
            email: email,
            password: password, // <-- GUARDANDO CONTRASEÑA PLANA
        });

        console.log('Usuario registrado exitosamente (contraseña plana):', newUser.username);
        res.status(201).json({
            message: 'Registro exitoso.',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            }
        });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.error('Error de Sequelize (Unique Constraint):', error.message);
            return res.status(400).json({ message: 'El usuario o correo electrónico ya existen.' });
        }
        console.error('Error interno inesperado al registrar usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar usuario.' });
    }
};

// Controlador para iniciar sesión de un usuario
const loginUser = async (req, res) => {
    //Quitarle espacios extra a los datos
    for(const key in req.body) {
        if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
        }
    }
    console.log(req.body)


    const { identifier, password } = req.body;
    // const trimmedIdentifier = identifier.trim();
    // const trimmedPassword = password.trim();

    console.log('--- Proceso de Login (Contraseña Plana) ---');
    console.log('Datos recibidos (req.body):', req.body);
    console.log('Identifier (email/username - trimmed):', identifier);
    console.log('Password (recibida para comparar - trimmed):', password);

    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: identifier },
                    { username: identifier }
                ]
            }
        });

        if (!user) {
            console.log('Login Fallido: Usuario no encontrado para identifier:', identifier);
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        console.log('Usuario encontrado:', user.username);
        console.log('Contraseña en DB (plana):', user.password);

        // *** CAMBIO CLAVE PARA CONTRASEÑA PLANA EN LOGIN ***
        // Comparamos directamente la contraseña recibida con la almacenada (plana)
        // const isMatch = await bcrypt.compare(trimmedPassword, user.password); // Comentamos esta línea
        const isMatch = (password === user.password); // <-- COMPARANDO CONTRASEÑA PLANA

        console.log('Resultado de comparación (isMatch):', isMatch);

        if (!isMatch) {
            console.log('Login Fallido: Contraseña no coincide para usuario:', user.username);
            return res.status(400).json({ message: 'Credenciales inválidas.' });
        }

        console.log('Inicio de sesión exitoso para usuario:', user.username);
        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor al iniciar sesión.' });
    }
};

export {
    registerUser,
    loginUser,
};