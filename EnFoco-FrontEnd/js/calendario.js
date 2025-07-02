document.addEventListener("DOMContentLoaded", () => {
  const horarios = [
    { dia: "lunes", hora: "08:00 - 10:00", materia: "Matemática" },
    { dia: "miércoles", hora: "08:00 - 10:00", materia: "Programación" },
    { dia: "martes", hora: "10:00 - 12:00", materia: "Base de Datos" },
    { dia: "viernes", hora: "10:00 - 12:00", materia: "Sistemas" },
    { dia: "jueves", hora: "14:00 - 16:00", materia: "Programación" }
  ];

  const dias = ["lunes", "martes", "miércoles", "jueves", "viernes"];
  const tabla = document.querySelector("tbody");

  if (!tabla) return;

  horarios.forEach(({ dia, hora, materia }) => {
    for (let fila of tabla.rows) {
      const horaFila = fila.cells[0].textContent.trim();
      if (horaFila === hora) {
        const colIndex = dias.indexOf(dia.toLowerCase()) + 1; // +1 porque th ocupa la primera
        fila.cells[colIndex].textContent = materia;
      }
    }
  });
});
