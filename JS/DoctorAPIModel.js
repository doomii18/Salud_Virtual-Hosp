document.addEventListener('DOMContentLoaded', function () {
  const cuerpoTabla = document.querySelector('.tabla__cuerpo');
  const modal = document.getElementById('modal');
  const btnAbrir = document.getElementById('btnNuevoDoctor');
  const btnCerrar = modal.querySelectorAll('.cerrar');
  const formDoctor = document.getElementById('form-doctor');

  const apiDoctores = 'http://127.0.0.1:8000/api/MedicalStaff/';
  const apiPersonas = 'http://127.0.0.1:8000/api/Person/';
  const apiDependencia = 'http://127.0.0.1:8000/api/Dependency/';
  const apiCargo = 'http://127.0.0.1:8000/api/Charges/';

  // Cargar doctores a la tabla
  function cargarDoctores() {
    fetch(apiDoctores)
      .then(res => res.json())
      .then(async data => {
        const doctores = data.Record;
        cuerpoTabla.innerHTML = '';

        for (const doctor of doctores) {
          try {
            const resPersona = await fetch(`${apiPersonas}${doctor.IdPerson_id}/`);
            const personaData = await resPersona.json();
            const persona = personaData.Record;

            const resDependencia = await fetch(`${apiDependencia}${doctor.IdDependency_id}/`);
            const dependenciaData = await resDependencia.json();
            const dependencia = dependenciaData.Record;

            const resCargo = await fetch(`${apiCargo}${doctor.IdCharges_id}/`);
            const cargoData = await resCargo.json();
            const cargo = cargoData.Record;

            const fila = document.createElement('tr');
            fila.classList.add('tabla__fila-doctor');
            fila.innerHTML = `
              <td class="tabla__dato">${persona.IdentityCard}</td>
              <td class="tabla__dato">${doctor.CodeMedicalStaff}</td>
              <td class="tabla__dato">${persona.Firstname}</td>
              <td class="tabla__dato">${persona.Middlename || ''}</td>
              <td class="tabla__dato">${persona.Surnames}</td>
              <td class="tabla__dato">${persona.Sexo}</td>
              <td class="tabla__dato">${persona.Age}</td>
              <td class="tabla__dato">${persona.Phone}</td>
              <td class="tabla__dato">${persona.Email}</td>
              <td class="tabla__dato">${persona.Address}</td>
              <td class="tabla__dato">${dependencia.NameDependency || ''}</td>
              <td class="tabla__dato">${cargo.NameCharges || ''}</td>
            `;
            cuerpoTabla.appendChild(fila);
          } catch (error) {
            console.error('Error al cargar persona:', error);
          }
        }
      })
      .catch(error => {
        console.error('Error al cargar doctores:', error);
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
      formDoctor.reset();
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      formDoctor.reset();
    }
  });

  // Cargar doctores al iniciar
  cargarDoctores();
});