document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("objetivoForm");
  const input = document.getElementById("nuevoObjetivo");
  const lista = document.getElementById("listaObjetivos");

  let objetivos = [];

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (objetivos.length >= 3) {
      alert("Solo podés agregar hasta 3 objetivos diarios.");
      return;
    }

    const texto = input.value.trim();
    if (texto === "") return;

    const obj = { texto, completado: false };
    objetivos.push(obj);
    input.value = "";

    renderObjetivos();
  });

  function renderObjetivos() {
    lista.innerHTML = "";
    objetivos.forEach((obj, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item";

      const texto = document.createElement("span");
      texto.textContent = obj.texto;
      if (obj.completado) texto.classList.add("objetivo-completado");

      const botones = document.createElement("div");

      const btnCheck = document.createElement("button");
      btnCheck.className = "btn btn-success btn-sm me-2";
      btnCheck.textContent = "✔";
      btnCheck.addEventListener("click", () => {
        obj.completado = !obj.completado;
        renderObjetivos();
      });

      const btnDelete = document.createElement("button");
      btnDelete.className = "btn btn-danger btn-sm";
      btnDelete.textContent = "🗑";
      btnDelete.addEventListener("click", () => {
        objetivos.splice(index, 1);
        renderObjetivos();
      });

      botones.appendChild(btnCheck);
      botones.appendChild(btnDelete);
      li.appendChild(texto);
      li.appendChild(botones);
      lista.appendChild(li);
    });
  }
});
