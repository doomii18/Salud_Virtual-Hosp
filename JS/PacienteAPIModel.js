// Espera que todo el DOM se cargue antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function () {
  // Elementos del DOM utilizados
  const cuerpoTabla = document.querySelector('.tabla__cuerpo');
  const modal = document.getElementById('modal');
  const btnAbrir = document.getElementById('btnNuevoPaciente');
  const btnCerrar = modal.querySelectorAll('.cerrar');
  const formPaciente = document.getElementById('form-paciente');

  // Campos del formulario
  const inputCodigo = document.getElementById('codigoPaciente');
  const inputNombre = document.getElementById('1nombre-paciente');
  const inputSegundoNombre = document.getElementById('2nombre-paciente');
  const inputApellidos = document.getElementById('apellidos-paciente');
  const inputAlergias = document.getElementById('alergias');
  const inputFecha = document.getElementById('fecha');
  const inputSexo = document.getElementById('sexo');
  const inputEdad = document.getElementById('edad');

  // Rutas de las APIs
  const apiPacientes = 'http://127.0.0.1:8000/api/Patients/';
  const apiPersonas = 'http://127.0.0.1:8000/api/Person/';

  // Datos en memoria
  let pacientesLocal = []; // Pacientes almacenados localmente
  let pacientesAPI = [];   // Pacientes cargados desde API

  // Estado de edición
  let modoEdicion = false;
  let modoEdicionAPI = false;
  let pacienteEditIndex = null;     // Índice de edición local
  let pacienteEditIdAPI = null;     // Índice de edición desde API

  // Genera código numérico incremental para pacientes locales (ej. 0016)
  function generarCodigo() {
    let maxCodigo = 15; // Código mínimo por defecto
    for (const p of pacientesLocal) {
      const num = parseInt(p.CodePatient, 10);
      if (!isNaN(num) && num > maxCodigo) maxCodigo = num;
    }
    const siguiente = maxCodigo + 1;
    return siguiente.toString().padStart(4, '0');
  }

  // Cargar pacientes desde la API
  async function cargarPacientesAPI() {
    try {
      const res = await fetch(apiPacientes);
      const data = await res.json();
      return data.Record || [];
    } catch (error) {
      console.error('Error al cargar pacientes API:', error);
      return [];
    }
  }

  // Cargar datos personales desde la API
  async function cargarPersonaAPI(idPerson) {
    try {
      const res = await fetch(`${apiPersonas}${idPerson}/`);
      const data = await res.json();
      return data.Record || {};
    } catch (error) {
      console.error('Error al cargar persona API:', error);
      return {};
    }
  }

  // Guardar pacientes en localStorage
  function guardarLocalStorage() {
    localStorage.setItem('pacientes', JSON.stringify(pacientesLocal));
  }

  // Cargar pacientes desde localStorage
  function cargarLocalStorage() {
    const data = localStorage.getItem('pacientes');
    pacientesLocal = data ? JSON.parse(data) : [];
  }

  // Crea una fila de la tabla con botones de editar y eliminar
  function crearFilaPaciente(paciente, index, isAPI = false) {
    const fila = document.createElement('tr');
    fila.classList.add('tabla__fila-paciente');

    fila.innerHTML = `
      <td class="tabla__dato">${paciente.CodePatient}</td>
      <td class="tabla__dato">${paciente.Firstname}</td>
      <td class="tabla__dato">${paciente.Middlename || ''}</td>
      <td class="tabla__dato">${paciente.Surnames || ''}</td>
      <td class="tabla__dato">${paciente.Allergies || ''}</td>
      <td class="tabla__dato">${paciente.Birthdate || ''}</td>
      <td class="tabla__dato">${paciente.Sexo || ''}</td>
      <td class="tabla__dato">${paciente.Age || ''}</td>
      <td class="tabla__dato">
        <button class="btn-editar" data-index="${index}" data-api="${isAPI}">Editar</button>
      </td>
      <td class="tabla__dato">
        <button class="btn-eliminar" data-index="${index}" data-api="${isAPI}">Eliminar</button>
      </td>
    `;
    return fila;
  }

  // Renderiza los datos en la tabla
  async function renderizarTabla() {
    cuerpoTabla.innerHTML = '';

    // Primero los pacientes cargados desde la API
    for (let i = 0; i < pacientesAPI.length; i++) {
      const paciente = pacientesAPI[i];
      const persona = await cargarPersonaAPI(paciente.IdPerson);
      const filaAPI = crearFilaPaciente({
        CodePatient: paciente.CodePatient,
        Firstname: persona.Firstname || '',
        Middlename: persona.Middlename || '',
        Surnames: persona.Surnames || '',
        Allergies: paciente.Allergies || '',
        Birthdate: paciente.Birthdate || '',
        Sexo: persona.Sexo || '',
        Age: persona.Age || '',
      }, i, true);
      cuerpoTabla.appendChild(filaAPI);
    }

    // Luego los pacientes locales (más nuevos arriba)
    const pacientesOrdenados = [...pacientesLocal].sort((a, b) =>
      parseInt(b.CodePatient) - parseInt(a.CodePatient)
    );
    pacientesOrdenados.forEach(paciente => {
      const index = pacientesLocal.findIndex(p => p.CodePatient === paciente.CodePatient);
      const filaLocal = crearFilaPaciente(paciente, index, false);
      cuerpoTabla.appendChild(filaLocal);
    });
  }

  // Abrir el modal para nuevo paciente local
  btnAbrir.addEventListener('click', () => {
    modoEdicion = false;
    modoEdicionAPI = false;
    pacienteEditIndex = null;
    pacienteEditIdAPI = null;
    formPaciente.reset();
    inputCodigo.value = generarCodigo();
    modal.style.display = 'block';
  });

  // Cerrar modal al hacer clic en botón o fuera del modal
  btnCerrar.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.style.display = 'none';
      formPaciente.reset();
      modoEdicion = modoEdicionAPI = false;
      pacienteEditIndex = pacienteEditIdAPI = null;
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      formPaciente.reset();
      modoEdicion = modoEdicionAPI = false;
      pacienteEditIndex = pacienteEditIdAPI = null;
    }
  });

  // Guardar paciente (nuevo o editado localmente)
  formPaciente.addEventListener('submit', (e) => {
    e.preventDefault();

    if (modoEdicionAPI) {
      alert('Editar pacientes de la API no está implementado en este demo.');
      modal.style.display = 'none';
      formPaciente.reset();
      modoEdicionAPI = false;
      pacienteEditIdAPI = null;
      return;
    }

    const nuevoPaciente = {
      CodePatient: inputCodigo.value,
      Firstname: inputNombre.value.trim(),
      Middlename: inputSegundoNombre.value.trim(),
      Surnames: inputApellidos.value.trim(),
      Allergies: inputAlergias.value.trim(),
      Birthdate: inputFecha.value,
      Sexo: inputSexo.value,
      Age: inputEdad.value,
    };

    if (modoEdicion) {
      pacientesLocal[pacienteEditIndex] = nuevoPaciente;
    } else {
      pacientesLocal.push(nuevoPaciente);
    }

    guardarLocalStorage();
    modal.style.display = 'none';
    formPaciente.reset();
    modoEdicion = false;
    pacienteEditIndex = null;
    renderizarTabla();
  });

  // Delegación de eventos para editar o eliminar
  cuerpoTabla.addEventListener('click', (e) => {
    const target = e.target;

    // Editar paciente
    if (target.classList.contains('btn-editar')) {
      const index = target.dataset.index;
      const esAPI = target.dataset.api === 'true';

      if (esAPI) {
        // Editar paciente desde API (no funcional)
        modoEdicionAPI = true;
        pacienteEditIdAPI = index;
        const paciente = pacientesAPI[index];

        cargarPersonaAPI(paciente.IdPerson).then(persona => {
          inputCodigo.value = paciente.CodePatient || '';
          inputNombre.value = persona.Firstname || '';
          inputSegundoNombre.value = persona.Middlename || '';
          inputApellidos.value = persona.Surnames || '';
          inputAlergias.value = paciente.Allergies || '';
          inputFecha.value = paciente.Birthdate || '';
          inputSexo.value = persona.Sexo || '';
          inputEdad.value = persona.Age || '';
          modal.style.display = 'block';
        });

      } else {
        // Editar paciente local
        modoEdicion = true;
        pacienteEditIndex = parseInt(index, 10);
        const paciente = pacientesLocal[pacienteEditIndex];
        inputCodigo.value = paciente.CodePatient;
        inputNombre.value = paciente.Firstname;
        inputSegundoNombre.value = paciente.Middlename;
        inputApellidos.value = paciente.Surnames;
        inputAlergias.value = paciente.Allergies;
        inputFecha.value = paciente.Birthdate;
        inputSexo.value = paciente.Sexo;
        inputEdad.value = paciente.Age;
        modal.style.display = 'block';
      }

    } else if (target.classList.contains('btn-eliminar')) {
      // Eliminar paciente
      const index = target.dataset.index;
      const esAPI = target.dataset.api === 'true';

      if (esAPI) {
        // Eliminar paciente API (no funcional)
        if (confirm('¿Está seguro que desea eliminar este paciente de la API? (Funcionalidad no implementada)')) {
          alert('Eliminar paciente API no implementado en este demo.');
        }
      } else {
        // Eliminar paciente local
        if (confirm('¿Está seguro que desea eliminar este paciente local?')) {
          pacientesLocal.splice(parseInt(index, 10), 1);
          guardarLocalStorage();
          renderizarTabla();
        }
      }
    }
  });

  // Inicialización: cargar datos y mostrar tabla
  async function inicializar() {
    pacientesAPI = await cargarPacientesAPI();
    cargarLocalStorage();
    renderizarTabla();
  }

  inicializar();
});
