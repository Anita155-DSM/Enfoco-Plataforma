// Este código se ejecutará una vez que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el formulario de login por su ID
    const loginForm = document.getElementById('loginForm');

    // Asegurarse de que el formulario de login existe en esta página
    if (loginForm) {
        // Añadir un "event listener" para cuando se envíe el formulario
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita que la página se recargue al enviar el formulario

            // Obtener los valores de los campos de entrada usando los IDs correctos (identifier y password)
            const identifier = document.getElementById('identifier').value; // Usar el ID correcto
            const password = document.getElementById('password').value;     // Usar el ID correcto

            try {
                // Hacer la petición POST al endpoint de login de tu backend
                // ¡Asegúrate de que la URL sea la correcta para tu backend!
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Indicar que el cuerpo de la petición es JSON
                    },
                    body: JSON.stringify({ identifier, password }) // Convertir los datos a una cadena JSON
                });

                const data = await response.json(); // Parsear la respuesta JSON del servidor

                if (response.ok) { // Si la respuesta HTTP es 2xx (ej. 200 OK)
                    console.log('Login exitoso:', data.message);
                    console.log('Token JWT:', data.token);

                    // **Paso clave: Almacenar el token JWT**
                    // Guarda el token en localStorage para usarlo en futuras peticiones a rutas protegidas.
                    localStorage.setItem('authToken', data.token);

                    // Redirigir al usuario a la página de dashboard u otra página después del login exitoso
                    // Asegúrate de que la ruta sea correcta, ej. /EnFoco-FrontEnd/dashboard.html
                    window.location.href = '/EnFoco-FrontEnd/dashboard.html'; 
                } else {
                    // Si la respuesta no es 2xx (ej. 400 Bad Request, 401 Unauthorized)
                    console.error('Error de login:', data.message);
                    alert('Error de login: ' + (data.message || 'Credenciales inválidas.'));
                }
            } catch (error) {
                // Manejar errores de red o del servidor que impidan la respuesta
                console.error('Error en la conexión con el servidor:', error);
                alert('No se pudo conectar con el servidor. Por favor, intenta de nuevo más tarde.');
            }
        });
    }

    // Aquí podrías añadir lógica para otras interacciones globales si main.js es para eso,
    // por ejemplo, para el botón de "Registrate" si fuera un botón y no un enlace.
    // const registerLink = document.querySelector('a[href="/EnFoco-FrontEnd/registro.html"]');
    // if (registerLink) {
    //     registerLink.addEventListener('click', (e) => {
    //         // Si quieres hacer algo antes de la navegación
    //         // e.preventDefault(); // Descomenta si quieres manejar la navegación manualmente
    //         // window.location.href = e.target.href;
    //     });
    // }
});