document.addEventListener('DOMContentLoaded', function () {
  const cuerpoTabla = document.querySelector('.tabla__cuerpo');
  const modal = document.getElementById('modal');
  const btnAbrir = document.getElementById('btnNuevaDependencia');
  const btnCerrar = modal.querySelectorAll('.cerrar');
  const formDependencia = document.getElementById('form-dependencia');

  const apiDependencias = 'http://127.0.0.1:8000/api/Dependency/';

function cargarDependencias() {
    fetch(apiDependencias)
      .then(res => res.json())
      .then(data => {
        const dependencias = data.Record;
        cuerpoTabla.innerHTML = '';

        for (const dependencia of dependencias) {
          const fila = document.createElement('tr');
          fila.classList.add('tabla__fila-dependencia');
          fila.innerHTML = `
            <td class="tabla__dato">${dependencia.CodeDependency}</td>
            <td class="tabla__dato">${dependencia.NameDependency}</td>
          `;
          cuerpoTabla.appendChild(fila);
        }
      })
      .catch(error => {
        console.error('Error al cargar dependencias:', error);
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
      formDependencia.reset();
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      formDependencia.reset();
    }
  });

  // Cargar dependencia al iniciar
  cargarDependencias();
});