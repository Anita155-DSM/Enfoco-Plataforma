document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const canvas = document.getElementById('roulette-canvas');
    const ctx = canvas.getContext('2d');
    const spinButton = document.getElementById('spin-button');
    const resultDisplay = document.getElementById('result-display').querySelector('p');

    const newTaskInput = document.getElementById('new-task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const tasksList = document.getElementById('tasks-list');
    
    // Modal de edición
    const modal = document.getElementById('edit-modal');
    const closeButton = document.querySelector('.close-button');
    const editTaskInput = document.getElementById('edit-task-input');
    const saveEditButton = document.getElementById('save-edit-button');
    let editingIndex = null;

    // Estado inicial de la aplicación
    let responsibilities = [
        "Leer Capítulo 3", "Hacer Resumen", "Preparar Exposición", 
        "Resolver Guía", "Estudiar Parcial", "Ver Videoclase"
    ];
    const segmentColors = ['#567C8D', '#C8D9E6']; // --teal y --sky-blue
    let currentRotation = 0;
    let isSpinning = false;

    // --- FUNCIONES DE LA RULETA ---

    // Dibuja la ruleta en el canvas
    const drawRoulette = () => {
        const numSegments = responsibilities.length;
        if (numSegments === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        };

        const anglePerSegment = (2 * Math.PI) / numSegments;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = canvas.width / 2 - 10;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '16px Poppins, sans-serif';
        
        responsibilities.forEach((task, index) => {
            const startAngle = index * anglePerSegment;
            const endAngle = startAngle + anglePerSegment;
            
            // Dibuja el segmento
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = segmentColors[index % segmentColors.length];
            ctx.fill();
            ctx.stroke();

            // Dibuja el texto
            ctx.save();
            ctx.fillStyle = '#1f2a38'; // --dark-navy
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + anglePerSegment / 2);
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(task.length > 20 ? task.substring(0, 18) + '...' : task, radius - 15, 0);
            ctx.restore();
        });
    };

    // Gira la ruleta
    const spinRoulette = () => {
        if (isSpinning || responsibilities.length < 2) {
            if (responsibilities.length < 2) {
                Swal.fire({
                    icon: 'warning',
                    title: '¡Pocas opciones!',
                    text: 'Añade al menos dos responsabilidades para poder girar la ruleta.',
                    confirmButtonColor: '#2F4156'
                });
            }
            return;
        }

        isSpinning = true;
        resultDisplay.textContent = 'Girando...';
        
        const randomSpins = Math.floor(Math.random() * 5) + 5;
        const randomAngle = Math.random() * 360;
        const totalRotation = randomSpins * 360 + randomAngle;

        currentRotation += totalRotation;
        canvas.style.transform = `rotate(${currentRotation}deg)`;

        setTimeout(() => {
            const finalRotation = currentRotation % 360;
            const numSegments = responsibilities.length;
            const anglePerSegment = 360 / numSegments;
            
            // --- CÁLCULO CORREGIDO ---
            // Se calcula el ángulo efectivo en la posición del puntero (270 grados o arriba).
            const effectiveAngle = (360 - finalRotation + 270) % 360;
            const winnerIndex = Math.floor(effectiveAngle / anglePerSegment);
            // --- FIN DE LA CORRECCIÓN ---
            
            const winner = responsibilities[winnerIndex];
            resultDisplay.textContent = `Responsabilidad: ${winner}`;

            Swal.fire({
                icon: 'success',
                title: '¡Responsabilidad asignada!',
                text: `${winner}`,
                confirmButtonColor: '#567C8D'
            });

            isSpinning = false;
        }, 5000); // Coincide con la duración de la transición en CSS
    };

    // --- FUNCIONES CRUD (Crear, Leer, Actualizar, Borrar) ---

    const renderTasksList = () => {
        tasksList.innerHTML = '';
        if (responsibilities.length === 0) {
            tasksList.innerHTML = '<li>No hay responsabilidades. ¡Añade una!</li>';
            return;
        }
        responsibilities.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task}</span>
                <div class="task-buttons">
                    <button class="edit-btn" data-index="${index}">✏️</button>
                    <button class="delete-btn" data-index="${index}">🗑️</button>
                </div>
            `;
            tasksList.appendChild(li);
        });
    };

    const addTask = () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            responsibilities.push(taskText);
            newTaskInput.value = '';
            updateApp();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Campo vacío',
                text: 'Por favor, escribe una responsabilidad.',
                confirmButtonColor: '#2F4156'
            });
        }
    };
    
    const openEditModal = (index) => {
        editingIndex = index;
        editTaskInput.value = responsibilities[index];
        modal.style.display = 'block';
    };

    const closeEditModal = () => {
        modal.style.display = 'none';
        editingIndex = null;
    };

    const saveTaskEdit = () => {
        const updatedText = editTaskInput.value.trim();
        if (updatedText && editingIndex !== null) {
            responsibilities[editingIndex] = updatedText;
            updateApp();
            closeEditModal();
        }
    };

    const deleteTask = (index) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Se eliminará la responsabilidad: "${responsibilities[index]}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#2F4156',
            cancelButtonColor: '#e6495b',
            confirmButtonText: 'Sí, ¡eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                responsibilities.splice(index, 1);
                updateApp();
                Swal.fire(
                    '¡Eliminada!',
                    'La responsabilidad ha sido eliminada.',
                    'success'
                );
            }
        });
    };

    const updateApp = () => {
        drawRoulette();
        renderTasksList();
    };

    // --- EVENT LISTENERS ---
    spinButton.addEventListener('click', spinRoulette);
    addTaskButton.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    tasksList.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        const index = parseInt(target.dataset.index, 10);
        if (target.classList.contains('edit-btn')) {
            openEditModal(index);
        } else if (target.classList.contains('delete-btn')) {
            deleteTask(index);
        }
    });

    closeButton.addEventListener('click', closeEditModal);
    saveEditButton.addEventListener('click', saveTaskEdit);
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            closeEditModal();
        }
    });

    // Inicialización
    updateApp();
});