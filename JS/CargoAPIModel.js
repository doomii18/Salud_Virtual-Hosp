document.addEventListener('DOMContentLoaded', function () {
  const cuerpoTabla = document.querySelector('.tabla__cuerpo');
  const modal = document.getElementById('modal');
  const btnAbrir = document.getElementById('btnNuevaCargos');
  const btnCerrar = modal.querySelectorAll('.cerrar');
  const formCargo = document.getElementById('form-cargo');

  const apiCargos = 'http://127.0.0.1:8000/api/Charges/';

function cargarCargos() {
    fetch(apiCargos)
      .then(res => res.json())
      .then(data => {
        const cargos = data.Record;
        cuerpoTabla.innerHTML = '';

        for (const cargo of cargos) {
          const fila = document.createElement('tr');
          fila.classList.add('tabla__fila-cargo');
          fila.innerHTML = `
            <td class="tabla__dato">${cargo.CodeCharge}</td>
            <td class="tabla__dato">${cargo.NameCharges}</td>
          `;
          cuerpoTabla.appendChild(fila);
        }
      })
      .catch(error => {
        console.error('Error al cargar cargos:', error);
      });
  }



  // Abrir modal
  btnAbrir.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  // Cerrar modal
  btnCerrar.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.style.display = 'none';
      formCargo.reset();
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      formCargo.reset();
    }
  });

  // Cargar cargos al iniciar
  cargarCargos();
});