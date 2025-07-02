document.addEventListener("DOMContentLoaded", () => {
  const formTarea = document.getElementById("formTarea");
  const inputTarea = document.getElementById("inputTarea");
  const listaTareas = document.getElementById("listaTareas");

  let tareas = [];

  formTarea?.addEventListener("submit", (e) => {
    e.preventDefault();

    const texto = inputTarea.value.trim();
    if (texto === "") return;

    const nueva = { texto, completada: false };
    tareas.push(nueva);
    inputTarea.value = "";

    renderTareas();
  });

  function renderTareas() {
    listaTareas.innerHTML = "";

    tareas.forEach((tarea, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item bg-dark text-light d-flex justify-content-between align-items-center";

      const texto = document.createElement("span");
      texto.textContent = tarea.texto;
      if (tarea.completada) texto.classList.add("tarea-completada");

      const botones = document.createElement("div");

      const btnCheck = document.createElement("button");
      btnCheck.className = "btn btn-success btn-sm me-2";
      btnCheck.textContent = "✔";
      btnCheck.addEventListener("click", () => {
        tarea.completada = !tarea.completada;
        renderTareas();
      });

      const btnDelete = document.createElement("button");
      btnDelete.className = "btn btn-danger btn-sm";
      btnDelete.textContent = "🗑";
      btnDelete.addEventListener("click", () => {
        tareas.splice(index, 1);
        renderTareas();
      });

      botones.appendChild(btnCheck);
      botones.appendChild(btnDelete);
      li.appendChild(texto);
      li.appendChild(botones);
      listaTareas.appendChild(li);
    });
  }
});
