document.addEventListener('DOMContentLoaded', function () {
  //Elementos del DOM
  const cuerpoTabla = document.querySelector('#tablaCargos tbody');
  const modal = document.getElementById('modal');
  const btnAbrir = document.getElementById('btnNuevaCargos');
  const btnCerrar = document.querySelectorAll('.cerrar');
  const formCargo = document.getElementById('form-cargo');
  const apiCargos = 'http://127.0.0.1:8000/api/Charges/';

  // Variables de estado
  let cargoEditando = null;

  // Función para generar código (6 dígitos)
  function generarCodigo() {
    return Math.floor(10000 + Math.random() * 90000);
  }

  // Cargar cargos desde la API
  async function cargarCargos() {
    try {
      const response = await fetch(apiCargos);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Verifica la estructura de la respuesta
      console.log('Datos recibidos:', data);
      
      // Ajusta según la estructura de la  API
      const cargos = data.Record || data; 
      
      cuerpoTabla.innerHTML = '';
      
      cargos.forEach(cargo => {
        const fila = document.createElement('tr');
        fila.className = 'tabla__fila';
        
        fila.innerHTML = `
          <td class="tabla__dato">${cargo.CodeCharge || cargo.codigo}</td>
          <td class="tabla__dato">${cargo.NameCharges || cargo.nombre}</td>
          <td class="tabla__dato">
            <button class="btn-edit" data-id="${cargo.id || cargo.id}">
              <i class="bx bx-edit"></i>
            </button>
          </td>
          <td class="tabla__dato">
            <button class="btn-delete" data-id="${cargo.id || cargo.id}">
              <i class="bx bx-trash"></i>
            </button>
          </td>
        `;
        
        cuerpoTabla.appendChild(fila);
      });
      
      // Asignar eventos a los botones después de crearlos
      document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', editarCargo);
      });
      
      document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', eliminarCargo);
      });
      
    } catch (error) {
      console.error('Error al cargar cargos:', error);
      cuerpoTabla.innerHTML = `
        <tr>
          <td colspan="4" class="error">Error al cargar los datos. ${error.message}</td>
        </tr>
      `;
    }
  }

  // Funciones para abrir/cerrar modal
  function abrirModal(editar = false, cargo = null) {
    cargoEditando = editar ? cargo : null;
    
    // Configurar el modal según sea edición o nuevo
    if (editar && cargo) {
      document.querySelector('.modal__titulo').textContent = 'Editar Cargo';
      document.getElementById('codigoCargo').value = cargo.CodeCharge || cargo.codigo;
      document.getElementById('nombre-cargo').value = cargo.NameCharges || cargo.nombre;
      document.getElementById('estado').value = cargo.estado || '1';
    } else {
      document.querySelector('.modal__titulo').textContent = 'Nuevo Cargo';
      document.getElementById('codigoCargo').value = generarCodigo();
      document.getElementById('nombre-cargo').value = '';
      document.getElementById('estado').value = '1';
    }
    
    modal.style.display = 'flex';
    document.getElementById('nombre-cargo').focus();
  }

  function cerrarModal() {
    modal.style.display = 'none';
    formCargo.reset();
    cargoEditando = null;
  }

  // Funciones CRUD
  async function editarCargo(event) {
    const id = event.currentTarget.getAttribute('data-id');
    try {
      const response = await fetch(`${apiCargos}${id}/`);
      if (!response.ok) throw new Error('Error al obtener cargo');
      
      const cargo = await response.json();
      abrirModal(true, cargo);
    } catch (error) {
      console.error('Error al editar cargo:', error);
      alert('No se pudo cargar el cargo para editar');
    }
  }

  async function eliminarCargo(event) {
    const id = event.currentTarget.getAttribute('data-id');
    if (!confirm('¿Está seguro de eliminar este cargo?')) return;
    
    try {
      const response = await fetch(`${apiCargos}${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 'X-CSRFToken': getCSRFToken() 
        }
      });
      
      if (!response.ok) throw new Error('Error al eliminar');
      
      cargarCargos();
      alert('Cargo eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar cargo:', error);
      alert('No se pudo eliminar el cargo');
    }
  }

  //Event Listeners
  btnAbrir.addEventListener('click', () => abrirModal(false));
  
  btnCerrar.forEach(btn => {
    btn.addEventListener('click', cerrarModal);
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) cerrarModal();
  });

  formCargo.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const codigo = document.getElementById('codigoCargo').value;
    const nombre = document.getElementById('nombre-cargo').value;
    const estado = document.getElementById('estado').value;
    
    if (!nombre.trim()) {
      alert('El nombre del cargo es obligatorio');
      return;
    }
    
    const payload = {
      CodeCharge: codigo,
      NameCharges: nombre,
      estado: estado
    };
    
    try {
      let response;
      
      if (cargoEditando) {
        // Edición
        response = await fetch(`${apiCargos}${cargoEditando.IdCharge || cargoEditando.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // 'X-CSRFToken': getCSRFToken()
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Nuevo cargo
        response = await fetch(apiCargos, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'X-CSRFToken': getCSRFToken()
          },
          body: JSON.stringify(payload)
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la operación');
      }
      
      cerrarModal();
      cargarCargos();
      alert(`Cargo ${cargoEditando ? 'actualizado' : 'creado'} correctamente`);
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  });

  //inicialización
  cargarCargos();
});


function getCSRFToken() {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue || '';
}