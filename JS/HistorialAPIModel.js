document.addEventListener('DOMContentLoaded', function () {
  const cuerpoTabla = document.querySelector('.tabla__cuerpo');
  const modal = document.getElementById('modal');
  const btnAbrir = document.getElementById('btnNuevoHistorial');
  const btnCerrar = modal.querySelectorAll('.cerrar');
  const formHistorial = document.getElementById('form-historial');
  const selectPaciente = document.getElementById('idPaciente');

  const apiHistorial = 'http://127.0.0.1:8000/api/MedicalHistory/';
  const apiPacientes = 'http://127.0.0.1:8000/api/Patients/';

  // Cargar pacientes en el select
  function cargarPacientesEnSelect() {
    fetch(apiPacientes)
      .then(res => res.json())
      .then(data => {
        const pacientes = data.Record;
        selectPaciente.innerHTML = '<option value="">---------</option>';

        pacientes.forEach(p => {
          const option = document.createElement('option');
          option.value = p.Id;
          option.textContent = `${p.Code} (ID: ${p.Id})`;
          selectPaciente.appendChild(option);
        });
      })
      .catch(error => {
        console.error('Error al cargar pacientes:', error);
      });
  }

  // Cargar historial médico en la tabla
  function cargarHistorial() {
    fetch(apiHistorial)
      .then(res => res.json())
      .then(data => {
        const historiales = data.Record;
        cuerpoTabla.innerHTML = '';

        historiales.forEach(historial => {
          const fila = document.createElement('tr');
          fila.classList.add('tabla__fila');

          fila.innerHTML = `
            <td class="tabla__celda">${historial.IdPatient}</td>
            <td class="tabla__celda">${historial.Code}</td>
            <td class="tabla__celda">${historial.Diagnosis}</td>
            <td class="tabla__celda">${historial.Treatment}</td>
            <td class="tabla__celda">${historial.Prognosis}</td>
            <td class="tabla__celda">${historial.Date}</td>
            <td class="tabla__celda">${historial.Weight}</td>
            <td class="tabla__celda">${historial.Measure}</td>
          `;

          cuerpoTabla.appendChild(fila);
        });
      })
      .catch(error => {
        console.error('Error al cargar historial médico:', error);
      });
  }

  // Abrir modal
  btnAbrir.addEventListener('click', () => {
    modal.style.display = 'block';
    cargarPacientesEnSelect();
  });

  // Cerrar modal
  btnCerrar.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.style.display = 'none';
      formHistorial.reset();
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      formHistorial.reset();
    }
  });

  // Inicializar carga
  cargarHistorial();
});
