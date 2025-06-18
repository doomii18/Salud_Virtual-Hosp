document.addEventListener('DOMContentLoaded', function () {
  const cuerpoTabla = document.querySelector('.tabla__cuerpo');
  const modal = document.getElementById('modal');
  const btnAbrir = document.getElementById('btnNuevo');
  const btnCerrar = modal.querySelectorAll('.cerrar');
  const formTutor = document.getElementById('formTutor');

  const inputIdentidad = document.getElementById('identidad');
  const inputNombre = document.getElementById('nombre');
  const inputSegundo = document.getElementById('segundo');
  const inputApellido = document.getElementById('apellido');
  const inputSexo = document.getElementById('sexo');
  const inputEdad = document.getElementById('edad');
  const inputTelefono = document.getElementById('telefono');
  const inputEmail = document.getElementById('email');
  const inputDireccion = document.getElementById('direccion');
  const inputOcupacion = document.getElementById('ocupacion');

  const apiTutores = 'http://127.0.0.1:8000/api/Tutors/';
  const apiPersonas = 'http://127.0.0.1:8000/api/Person/';

  let tutoresLocal = [];
  let modoEdicion = false;
  let tutorEditIndex = null;

  // ------------------- LocalStorage -------------------
  function guardarLocalStorage() {
    localStorage.setItem('tutores', JSON.stringify(tutoresLocal));
  }

  function cargarLocalStorage() {
    const data = localStorage.getItem('tutores');
    tutoresLocal = data ? JSON.parse(data) : [];
  }

  // ------------------- Crear fila -------------------
  function crearFilaTutor(tutor, index, isAPI = false) {
    const fila = document.createElement('tr');
    fila.classList.add('tabla__fila-tutor');

    fila.innerHTML = `
      <td class="tabla__dato">${tutor.IdentityCard}</td>
      <td class="tabla__dato">${tutor.Firstname}</td>
      <td class="tabla__dato">${tutor.Middlename || ''}</td>
      <td class="tabla__dato">${tutor.Surnames}</td>
      <td class="tabla__dato">${tutor.Sexo}</td>
      <td class="tabla__dato">${tutor.Age}</td>
      <td class="tabla__dato">${tutor.Phone}</td>
      <td class="tabla__dato">${tutor.Email}</td>
      <td class="tabla__dato">${tutor.Address}</td>
      <td class="tabla__dato">${tutor.Occupation}</td>
      <td class="tabla__dato">
        <button class="btn-editar" data-index="${index}" data-api="${isAPI}">Editar</button>
      </td>
      <td class="tabla__dato">
        <button class="btn-eliminar" data-index="${index}" data-api="${isAPI}">Eliminar</button>
      </td>
    `;

    return fila;
  }

  // ------------------- Renderizar tabla -------------------
  async function cargarTutores() {
    cuerpoTabla.innerHTML = '';

    // Mostrar tutores desde la API
    try {
      const res = await fetch(apiTutores);
      const data = await res.json();
      const tutores = data.Record;

      for (const tutor of tutores) {
        try {
          const resPersona = await fetch(`${apiPersonas}${tutor.IdPerson}/`);
          const personaData = await resPersona.json();
          const persona = personaData.Record;

          const filaAPI = crearFilaTutor({
            ...persona,
            Occupation: tutor.Occupation,
          }, null, true);

          cuerpoTabla.appendChild(filaAPI);
        } catch (error) {
          console.error('Error al cargar persona del tutor:', error);
        }
      }
    } catch (error) {
      console.error('Error al cargar tutores:', error);
    }

    // Mostrar tutores desde localStorage
    cargarLocalStorage();
    tutoresLocal.forEach((tutor, index) => {
      const fila = crearFilaTutor(tutor, index, false);
      cuerpoTabla.appendChild(fila);
    });
  }

  // ------------------- Abrir / cerrar modal -------------------
  btnAbrir.addEventListener('click', () => {
    modoEdicion = false;
    tutorEditIndex = null;
    formTutor.reset();
    modal.style.display = 'block';
  });

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

  // ------------------- Guardar Tutor (crear o editar) -------------------
  formTutor.addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevoTutor = {
      IdentityCard: inputIdentidad.value.trim(),
      Firstname: inputNombre.value.trim(),
      Middlename: inputSegundo.value.trim(),
      Surnames: inputApellido.value.trim(),
      Sexo: inputSexo.value,
      Age: inputEdad.value,
      Phone: inputTelefono.value,
      Email: inputEmail.value.trim(),
      Address: inputDireccion.value.trim(),
      Occupation: inputOcupacion.value.trim(),
    };

    if (modoEdicion) {
      tutoresLocal[tutorEditIndex] = nuevoTutor;
    } else {
      tutoresLocal.push(nuevoTutor);
    }

    guardarLocalStorage();
    cargarTutores();
    modal.style.display = 'none';
    formTutor.reset();
  });

  // ------------------- Editar / Eliminar -------------------
  cuerpoTabla.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('btn-editar')) {
      const index = target.dataset.index;
      const esAPI = target.dataset.api === 'true';

      if (esAPI) {
        alert('Editar registros de la API no está implementado.');
        return;
      }

      const tutor = tutoresLocal[index];
      modoEdicion = true;
      tutorEditIndex = index;

      inputIdentidad.value = tutor.IdentityCard;
      inputNombre.value = tutor.Firstname;
      inputSegundo.value = tutor.Middlename;
      inputApellido.value = tutor.Surnames;
      inputSexo.value = tutor.Sexo;
      inputEdad.value = tutor.Age;
      inputTelefono.value = tutor.Phone;
      inputEmail.value = tutor.Email;
      inputDireccion.value = tutor.Address;
      inputOcupacion.value = tutor.Occupation;

      modal.style.display = 'block';

    } else if (target.classList.contains('btn-eliminar')) {
      const index = target.dataset.index;
      const esAPI = target.dataset.api === 'true';

      if (esAPI) {
        alert('Eliminar registros de la API no está implementado.');
        return;
      }

      if (confirm('¿Desea eliminar este tutor local?')) {
        tutoresLocal.splice(index, 1);
        guardarLocalStorage();
        cargarTutores();
      }
    }
  });

  // Inicializar
  cargarTutores();
});
