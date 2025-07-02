// Este código se ejecutará una vez que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el formulario de registro por su ID
    const registroForm = document.getElementById('registroForm');

    // Asegurarse de que el formulario de registro existe en esta página
    if (registroForm) {
        // Añadir un "event listener" para cuando se envíe el formulario
        registroForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Evita que la página se recargue al enviar el formulario

            // Obtener los valores de los campos de entrada
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Hacer la petición POST al endpoint de registro de tu backend
                // ¡Asegúrate de que la URL sea la correcta para tu backend!
                const response = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // Indicar que el cuerpo de la petición es JSON
                    },
                    body: JSON.stringify({ username, email, password }) // Convertir los datos a una cadena JSON
                });

                const data = await response.json(); // Parsear la respuesta JSON del servidor

                if (response.ok) { // Si la respuesta HTTP es 2xx (ej. 201 Created)
                    console.log('Registro exitoso:', data.message);
                    alert('¡Registro exitoso! Por favor, inicia sesión.');
                    // Redirigir al usuario a la página de login después de un registro exitoso
                    // Asegúrate de que la ruta sea correcta
                    window.location.href = '/EnFoco-FrontEnd/login.html'; 
                } else {
                    // Si la respuesta no es 2xx (ej. 400 Bad Request, 409 Conflict)
                    console.error('Error de registro:', data.message);
                    alert('Error de registro: ' + (data.message || 'Ocurrió un error.'));
                }
            } catch (error) {
                // Manejar errores de red o del servidor que impidan la respuesta
                console.error('Error en la conexión con el servidor:', error);
                alert('No se pudo conectar con el servidor. Por favor, intenta de nuevo más tarde.');
            }
        });
    }
});