document.addEventListener('DOMContentLoaded', function () {
  const cuerpoTabla = document.querySelector('.tabla__cuerpo');
  const modal = document.getElementById('modal');
  const btnAbrir = document.getElementById('btnNuevoDoctor');
  const btnCerrar = modal.querySelectorAll('.cerrar');
  const formDoctor = document.getElementById('form-doctor');

  const inputCodigo = document.getElementById('codigoDoctor');
  const inputNombre = document.getElementById('1nombre-doctor');
  const inputSegundo = document.getElementById('2nombre-doctor');
  const inputApellidos = document.getElementById('apellidos-doctor');
  const inputSexo = document.getElementById('sexo');
  const inputEdad = document.getElementById('edad');
  const inputTelefono = document.getElementById('telefono');
  const inputEmail = document.getElementById('email');
  const inputDireccion = document.getElementById('direccion');
  const inputDependencia = document.getElementById('dependencia');
  const inputCargo = document.getElementById('cargo');

  const apiDoctores = 'http://127.0.0.1:8000/api/MedicalStaff/';
  const apiPersonas = 'http://127.0.0.1:8000/api/Person/';
  const apiDependencia = 'http://127.0.0.1:8000/api/Dependency/';
  const apiCargo = 'http://127.0.0.1:8000/api/Charges/';

  let doctoresLocal = [];
  let modoEdicion = false;
  let doctorEditIndex = null;

  // Guardar LocalStorage
  function guardarLocalStorage() {
    localStorage.setItem('doctores', JSON.stringify(doctoresLocal));
  }

  function cargarLocalStorage() {
    const data = localStorage.getItem('doctores');
    doctoresLocal = data ? JSON.parse(data) : [];
  }

  function generarCodigoDoctor() {
    const num = doctoresLocal.length + 1;
    return `MED${String(num).padStart(3, '0')}`;
  }

  function crearFilaDoctor(doc, index, isAPI = false) {
    const fila = document.createElement('tr');
    fila.classList.add('tabla__fila-doctor');
    fila.innerHTML = `
      <td class="tabla__dato">${doc.Code || doc.CodeMedicalStaff || '-'}</td>
      <td class="tabla__dato">${doc.IdentityCard || ''}</td>
      <td class="tabla__dato">${doc.Firstname || ''}</td>
      <td class="tabla__dato">${doc.Middlename || ''}</td>
      <td class="tabla__dato">${doc.Surnames || ''}</td>
      <td class="tabla__dato">${doc.Sexo || ''}</td>
      <td class="tabla__dato">${doc.Age || ''}</td>
      <td class="tabla__dato">${doc.Phone || ''}</td>
      <td class="tabla__dato">${doc.Email || ''}</td>
      <td class="tabla__dato">${doc.Address || ''}</td>
      <td class="tabla__dato">${doc.NameDependency || doc.Dependencia || ''}</td>
     <td class="tabla__dato">${doc.NameCharges || doc.Cargo || ''}</td>
    <td class="tabla__dato">
      <button class="btn-editar" data-index="${index ?? ''}" data-api="${isAPI}">Editar</button>
    </td>
    <td class="tabla__dato">
      <button class="btn-eliminar" data-index="${index ?? ''}" data-api="${isAPI}">Eliminar</button>
    </td>
  `;
  return fila;
}
  // Cargar Doctores de API
  async function cargarDoctoresAPI() {
    try {
      const res = await fetch(apiDoctores);
      const { Record: doctores } = await res.json();

      for (const doc of doctores) {
        try {
          const [personaRes, dependenciaRes, cargoRes] = await Promise.all([
            fetch(`${apiPersonas}${doc.IdPerson}/`),
            fetch(`${apiDependencia}${doc.IdDependency}/`),
            fetch(`${apiCargo}${doc.IdCharges}/`)
          ]);

          const persona = (await personaRes.json()).Record;
          const dependencia = (await dependenciaRes.json()).Record;
          const cargo = (await cargoRes.json()).Record;

          const filaAPI = crearFilaDoctor({
            ...persona,
            CodeMedicalStaff: doc.CodeMedicalStaff,
            NameDependency: dependencia.NameDependency,
            NameCharges: cargo.NameCharges
          }, null, true);

          cuerpoTabla.appendChild(filaAPI);
        } catch (error) {
          console.error('Error en datos relacionados:', error);
        }
      }
    } catch (error) {
      console.error('Error al cargar doctores API:', error);
    }
  }

  // Cargar Doctores Locales
  function cargarDoctoresLocal() {
    cargarLocalStorage();
    doctoresLocal.forEach((doc, index) => {
      const fila = crearFilaDoctor(doc, index);
      cuerpoTabla.appendChild(fila);
    });
  }

  // Cargar ambos conjuntos
  function cargarDoctores() {
    cuerpoTabla.innerHTML = '';
    cargarDoctoresAPI().then(() => cargarDoctoresLocal());
  }

  // Abrir modal
  btnAbrir.addEventListener('click', () => {
    modoEdicion = false;
    doctorEditIndex = null;
    formDoctor.reset();
    inputCodigo.value = generarCodigoDoctor();
    modal.style.display = 'block';
  });

  // Cerrar modal
  btnCerrar.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.style.display = 'none';
      formDoctor.reset();
    });
  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
      formDoctor.reset();
    }
  });

  // Guardar doctor
  formDoctor.addEventListener('submit', e => {
    e.preventDefault();

    const nuevoDoctor = {
      Code: inputCodigo.value,
      Firstname: inputNombre.value.trim(),
      Middlename: inputSegundo.value.trim(),
      Surnames: inputApellidos.value.trim(),
      Sexo: inputSexo.value,
      Age: inputEdad.value,
      Phone: inputTelefono.value.trim(),
      Email: inputEmail.value.trim(),
      Address: inputDireccion.value.trim(),
      Dependencia: inputDependencia.value.trim(),
      Cargo: inputCargo.value.trim(),
      IdentityCard: `TEMP-${Date.now()}`
    };

    if (modoEdicion) {
      doctoresLocal[doctorEditIndex] = nuevoDoctor;
    } else {
      doctoresLocal.push(nuevoDoctor);
    }

    guardarLocalStorage();
    // Solo recarga los doctores locales, sin borrar los de la API
    cargarDoctores();
    modal.style.display = 'none';
    formDoctor.reset();
  });

  // Editar / Eliminar local
 cuerpoTabla.addEventListener('click', e => {
  const target = e.target;

  if (target.classList.contains('btn-editar')) {
    const index = target.dataset.index;
    const isAPI = target.dataset.api === 'true';

    if (isAPI) {
      alert('Este registro viene de la API y no puede editarse localmente.');
      return;
    }

    const doc = doctoresLocal[index];

    inputCodigo.value = doc.Code;
    inputNombre.value = doc.Firstname;
    inputSegundo.value = doc.Middlename;
    inputApellidos.value = doc.Surnames;
    inputSexo.value = doc.Sexo;
    inputEdad.value = doc.Age;
    inputTelefono.value = doc.Phone;
    inputEmail.value = doc.Email;
    inputDireccion.value = doc.Address;
    inputDependencia.value = doc.Dependencia;
    inputCargo.value = doc.Cargo;

    modoEdicion = true;
    doctorEditIndex = index;
    modal.style.display = 'block';
  }

  if (target.classList.contains('btn-eliminar')) {
    const index = target.dataset.index;
    const isAPI = target.dataset.api === 'true';

    if (isAPI) {
      alert('Este registro viene de la API y no puede eliminarse localmente.');
      return;
    }

    if (confirm('¿Eliminar este doctor local?')) {
      doctoresLocal.splice(index, 1);
      guardarLocalStorage();
      cargarDoctores();
    }
  }
});


  // Inicializar
  cargarDoctores();
});
