document.addEventListener('DOMContentLoaded', function () {
  const cuerpoTabla = document.querySelector('.tabla__cuerpo');
  const modal = document.getElementById('modal');
  const btnAbrir = document.getElementById('btnNuevoPaciente');
  const btnCerrar = modal.querySelectorAll('.cerrar');
  const formPaciente = document.getElementById('form-paciente');

  const apiPacientes = 'http://127.0.0.1:8000/api/Patients/';
  const apiPersonas = 'http://127.0.0.1:8000/api/Person/';

  // Cargar pacientes a la tabla
  function cargarPacientes() {
    fetch(apiPacientes)
      .then(res => res.json())
      .then(async data => {
        const pacientes = data.Record;
        cuerpoTabla.innerHTML = '';

        for (const paciente of pacientes) {
          try {
            const resPersona = await fetch(`${apiPersonas}${paciente.IdPerson}/`);
            const personaData = await resPersona.json();
            const persona = personaData.Record;

            const fila = document.createElement('tr');
            fila.classList.add('tabla__fila-paciente');
            fila.innerHTML = `
              <td class="tabla__dato">${paciente.Code}</td>
              <td class="tabla__dato">${persona.Firstname}</td>
              <td class="tabla__dato">${persona.Middlename || ''}</td>
              <td class="tabla__dato">${persona.Surnames}</td>
              <td class="tabla__dato">${paciente.Allergy || ''}</td>
              <td class="tabla__dato">${persona.Birthdate || ''}</td>
              <td class="tabla__dato">${persona.Sexo}</td>
              <td class="tabla__dato">${persona.Age}</td>
            `;
            cuerpoTabla.appendChild(fila);
          } catch (error) {
            console.error('Error al cargar persona:', error);
          }
        }
      })
      .catch(error => {
        console.error('Error al cargar pacientes:', error);
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
      formPaciente.reset();
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      formPaciente.reset();
    }
  });

  // Cargar pacientes al iniciar
  cargarPacientes();
});