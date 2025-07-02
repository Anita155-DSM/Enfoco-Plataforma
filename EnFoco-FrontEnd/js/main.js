//login
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const user = document.getElementById("usuario").value.trim();
      const pass = document.getElementById("clave").value.trim();

      if (user === "Usuario" && pass === "1234") {
        alert("¡Bienvenidx, Usuario!");
        window.location.href = "indexUser.html";
      } else {
        alert("Usuario o contraseña incorrectos.");
      }
    });
  }
});
