document.addEventListener('DOMContentLoaded', function () {
  const cuerpoTabla = document.querySelector('.tabla__cuerpo');
  const modal = document.getElementById('modal');
  const btnAbrir = document.getElementById('btnNuevo');
  const btnCerrar = modal.querySelectorAll('.cerrar');
  const formTutor = document.getElementById('formTutor');

  const apiTutores = 'http://127.0.0.1:8000/api/Tutors/';
  const apiPersonas = 'http://127.0.0.1:8000/api/Person/';

  // Cargar tutores a la tabla
  function cargarTutores() {
    fetch(apiTutores)
      .then(res => res.json())
      .then(async (data) => {
        console.log('Respuesta de tutores:', data); // 
        const tutores = data.Record;
        cuerpoTabla.innerHTML = '';

        for (const tutor of tutores) {
          try {
            const resPersona = await fetch(`${apiPersonas}${tutor.IdPerson}/`);
            const personaData = await resPersona.json();
            const persona = personaData.Record;

            const fila = document.createElement('tr');
            fila.classList.add('tabla__fila-tutor');
            fila.innerHTML = `
              <td class="tabla__dato">${persona.IdentityCard}</td>
              <td class="tabla__dato">${persona.Firstname}</td>
              <td class="tabla__dato">${persona.Middlename || ''}</td>
              <td class="tabla__dato">${persona.Surnames}</td>
              <td class="tabla__dato">${persona.Sexo}</td>
              <td class="tabla__dato">${persona.Age}</td>
              <td class="tabla__dato">${persona.Phone}</td>
              <td class="tabla__dato">${persona.Email}</td>
              <td class="tabla__dato">${persona.Address}</td>
              <td class="tabla__dato">${tutor.Occupation}</td>
            `;
            cuerpoTabla.appendChild(fila);
          } catch (error) {
            console.error('Error al cargar persona del tutor:', error);
          }
        }
      })
      .catch(error => {
        console.error('Error al cargar tutores:', error);
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
      formTutor.reset();
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      formTutor.reset();
    }
  });

  // Cargar tutores al iniciar
  cargarTutores();
});
