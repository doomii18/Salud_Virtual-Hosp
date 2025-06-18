document.addEventListener('DOMContentLoaded', function () {
  const apiCitas = 'http://127.0.0.1:8000/api/PediatricAppointment/';
  const apiPacientes = 'http://127.0.0.1:8000/api/Patients/';
  const apiPersonas = 'http://127.0.0.1:8000/api/Person/';
  const apiCargos = 'http://127.0.0.1:8000/api/Charges/';

  const cuerpoTabla = document.querySelector('.tabla__cuerpo');
  const modal = document.getElementById('modal');
  const btnAbrirModal = document.getElementById('btnAbrirModalCita');
  const btnCerrarModal = document.querySelector('.modal__cerrar');
  const formCita = document.getElementById('form-cita');
  const selectPaciente = document.getElementById('idPacienteCita');
  const selectPersonal = document.getElementById('personal-medico');
  const inputCodigo = document.getElementById('codigoCita');

  let citaEditandoId = null;

  function generarCodigoCita() {
    const ahora = new Date();
    return '000-' + ahora.getTime();
  }

  async function cargarPacientes() {
    try {
      const resPacientes = await fetch(apiPacientes);
      const dataPacientes = await resPacientes.json();
      const pacientes = dataPacientes.Record;

      selectPaciente.innerHTML = '<option value="">Seleccione un paciente</option>';

      for (const paciente of pacientes) {
        const resPersona = await fetch(`${apiPersonas}${paciente.IdPerson}/`);
        const dataPersona = await resPersona.json();
        const persona = dataPersona.Record;

        const nombreCompleto = `${persona.Firstname} ${persona.Middlename || ''} ${persona.Surnames}`.trim();
        const option = document.createElement('option');
        option.value = paciente.Id;
        option.textContent = `${nombreCompleto} - ${paciente.CodePatient}`;
        selectPaciente.appendChild(option);
      }
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    }
  }

  async function cargarPersonalMedico() {
    try {
      const resCargos = await fetch(apiCargos);
      const dataCargos = await resCargos.json();
      const cargos = dataCargos.Record;
      const cargoPediatra = cargos.find(c => c.Name.toLowerCase() === 'Pediatra');

      if (!cargoPediatra) {
        console.warn('No se encontró el cargo "Pediatra"');
        return;
      }

      const idPediatra = cargoPediatra.Id;

      const resPersonas = await fetch(apiPersonas);
      const dataPersonas = await resPersonas.json();
      const personas = dataPersonas.Record;

      selectPersonal.innerHTML = '<option value="">Seleccione un médico</option>';

      personas.forEach(persona => {
        if (persona.IdCharges === idPediatra) {
          const nombre = `${persona.Firstname} ${persona.Middlename || ''} ${persona.Surnames}`.trim();
          const option = document.createElement('option');
          option.value = persona.Id;
          option.textContent = nombre;
          selectPersonal.appendChild(option);
        }
      });

    } catch (error) {
      console.error('Error al cargar personal médico:', error);
    }
  }

  async function cargarCitas() {
    try {
      const resCitas = await fetch(apiCitas);
      const data = await resCitas.json();
      const citas = data.Record;
      cuerpoTabla.innerHTML = '';

      for (const cita of citas) {
        const fila = document.createElement('tr');
        fila.classList.add('tabla__fila-citam');
        fila.innerHTML = `
          <td class="tabla__celda">${cita.id}</td>
          <td class="tabla__celda">${cita.MedicalStaffId}</td>
          <td class="tabla__celda">${cita.CodePediatricAppointment}</td>
          <td class="tabla__celda">${cita.IdPatients}</td>
          <td class="tabla__celda">${cita.Reason}</td>
          <td class="tabla__celda">${cita.State}</td>
          <td class="tabla__celda">${cita.DateTime} ${cita.Time || ''}</td>
          <td class="tabla__celda"><button class="btn-editar" data-id="${cita.id}">Editar</button>
      </td>
          <td class="tabla__celda"><button class="btn-eliminar" data-id="${cita.id}">Eliminar</button>
      </td>
        `;
        cuerpoTabla.appendChild(fila);
      }
    } catch (error) {
      console.error('Error al cargar citas:', error);
    }
  }

  btnAbrirModal.addEventListener('click', () => {
    modal.style.display = 'block';
    inputCodigo.value = generarCodigoCita();
    cargarPacientes();
    cargarPersonalMedico();
  });

  btnCerrarModal.addEventListener('click', () => {
    modal.style.display = 'none';
    formCita.reset();
    citaEditandoId = null;
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      formCita.reset();
      citaEditandoId = null;
    }
  });

  formCita.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nuevaCita = {
      MedicalStaffId: selectPersonal.value,
      CodePediatricAppointment: inputCodigo.value,
      IdPatients: selectPaciente.value,
      Reason: document.getElementById('razon').value,
      State: document.getElementById('estado').value,
      DateTime: document.getElementById('fecha').value,
      Time: document.getElementById('hora').value,
    };

    try {
      const res = await fetch(
        citaEditandoId ? `${apiCitas}${citaEditandoId}/` : apiCitas,
        {
          method: citaEditandoId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevaCita),
        }
      );

      if (!res.ok) throw new Error('Error al guardar cita');

      await cargarCitas();
      formCita.reset();
      modal.style.display = 'none';
      citaEditandoId = null;
    } catch (error) {
      console.error('Error al guardar cita:', error);
    }
  });

  cuerpoTabla.addEventListener('click', async function (e) {
    if (e.target.classList.contains('btn-editar-cita')) {
      const id = e.target.dataset.id;
      try {
        const res = await fetch(`${apiCitas}${id}/`);
        const data = await res.json();
        const cita = data.Record;

        citaEditandoId = id;
        inputCodigo.value = cita.CodePediatricAppointment;
        document.getElementById('razon').value = cita.Reason;
        document.getElementById('estado').value = cita.State;
        document.getElementById('fecha').value = cita.DateTime;
        document.getElementById('hora').value = cita.Time;

        await cargarPacientes();
        await cargarPersonalMedico();
        selectPaciente.value = cita.IdPatients;
        selectPersonal.value = cita.MedicalStaffId;

        modal.style.display = 'block';
      } catch (error) {
        console.error('Error al cargar cita para editar:', error);
      }
    }

    if (e.target.classList.contains('btn-eliminar-cita')) {
      const id = e.target.dataset.id;
      if (confirm('¿Deseas cancelar esta cita?')) {
        try {
          const res = await fetch(`${apiCitas}${id}/`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ State: 'Cancelado' }),
          });
          if (!res.ok) throw new Error('Error al cancelar la cita');
          await cargarCitas();
        } catch (error) {
          console.error('Error al cancelar cita:', error);
        }
      }
    }
  });

  cargarCitas();
});
