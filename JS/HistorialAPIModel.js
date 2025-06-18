document.addEventListener('DOMContentLoaded', function () {
  const cuerpoTabla = document.querySelector('.tabla__cuerpo');
  const modal = document.getElementById('modal');
  const btnAbrir = document.getElementById('btnNuevoHistorial');
  const btnCerrar = modal.querySelectorAll('.cerrar');
  const formHistorial = document.getElementById('form-historial');
  const selectPaciente = document.getElementById('idPaciente');

  const apiHistorial = 'http://127.0.0.1:8000/api/MedicalHistory/';
  const apiPacientes = 'http://127.0.0.1:8000/api/Patients/';
    const apiPersonas = 'http://127.0.0.1:8000/api/Person/';

 // Cargar pacientes con nombres en el select
  async function cargarPacientesEnSelect() {
    try {
      const resPacientes = await fetch(apiPacientes);
      const dataPacientes = await resPacientes.json();
      const pacientes = dataPacientes.Record;

      selectPaciente.innerHTML = '<option value="">---------</option>';

      for (const paciente of pacientes) {
        try {
          const resPersona = await fetch(`${apiPersonas}${paciente.IdPerson}/`);
          const personaData = await resPersona.json();
          const persona = personaData.Record;

          const nombreCompleto = `${persona.Firstname} ${persona.Middlename || ''} ${persona.Surnames}`;
          const option = document.createElement('option');
          option.value = paciente.Id;
          option.textContent = `${nombreCompleto.trim()} - ${paciente.CodePatient}`; //carga del combobox ccon 
          selectPaciente.appendChild(option);
        } catch (error) {
          console.error('Error al cargar persona de paciente:', error);
        }
      }
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    }
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
            <td class="tabla__celda">${historial.IdPatients}</td>
            <td class="tabla__celda">${historial.CodeMedicalHistory}</td>
            <td class="tabla__celda">${historial.Diagnosis}</td>
            <td class="tabla__celda">${historial.Treatment}</td>
            <td class="tabla__celda">${historial.Forecast}</td>
            <td class="tabla__celda">${historial.Date}</td>
            <td class="tabla__celda">${historial.WeightPounds}</td>
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