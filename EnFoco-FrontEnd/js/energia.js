document.addEventListener("DOMContentLoaded", () => {
  const energyCells = document.querySelectorAll('[data-energy]');

  energyCells.forEach(cell => {
    cell.addEventListener('click', () => {
      // Limpiar clases anteriores
      cell.classList.remove('energy-low', 'energy-medium', 'energy-high');

      // Obtener clase actual
      let current = cell.dataset.state || 'none';

      // Cambiar al siguiente estado
      let next;
      switch (current) {
        case 'none': next = 'low'; break;
        case 'low': next = 'medium'; break;
        case 'medium': next = 'high'; break;
        default: next = 'none'; break;
      }

      // Aplicar nueva clase
      cell.dataset.state = next;

      if (next === 'low') cell.classList.add('energy-low');
      if (next === 'medium') cell.classList.add('energy-medium');
      if (next === 'high') cell.classList.add('energy-high');
    });
  });
});
