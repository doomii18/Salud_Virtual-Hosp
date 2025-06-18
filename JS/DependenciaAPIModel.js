document.addEventListener('DOMContentLoaded', function () {
  //Elementos del DOM
  const cuerpoTabla = document.querySelector('#tablaDependencias tbody');
  const modal = document.getElementById('modal');
  const btnAbrir = document.getElementById('btnNuevaDependencia');
  const btnCerrar = document.querySelectorAll('.cerrar');
  const formDependencia = document.getElementById('form-dependencia');
  const apiDependencias = 'http://127.0.0.1:8000/api/Dependency/';

  // Variables de estado
  let dependenciaEditando = null;

  // Función para generar código (6 dígitos)
  function generarCodigo() {
    return Math.floor(10000 + Math.random() * 90000);
  }

  // Cargar dependencias desde la API
  async function cargarDependencias() {
    try {
      const response = await fetch(apiDependencias);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Verifica la estructura de la respuesta
      console.log('Datos recibidos:', data);
      
      // Ajusta según la estructura de la  API
      const dependencias = data.Record || data; 
      
      cuerpoTabla.innerHTML = '';
      
      dependencias.forEach(dependencia => {
        const fila = document.createElement('tr');
        fila.className = 'tabla__fila';
        
        fila.innerHTML = `
          <td class="tabla__dato">${dependencia.CodeDependency || dependencia.codigo}</td>
          <td class="tabla__dato">${dependencia.NameDependency || dependencia.nombre}</td>
          <td class="tabla__dato">
            <button class="btn-edit" data-id="${dependencia.id || dependencia.id}">
              <i class="bx bx-edit"></i>
            </button>
          </td>
          <td class="tabla__dato">
            <button class="btn-delete" data-id="${dependencia.id || dependencia.id}">
              <i class="bx bx-trash"></i>
            </button>
          </td>
        `;
        
        cuerpoTabla.appendChild(fila);
      });
      
      // Asignar eventos a los botones después de crearlos
      document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', editarDependencia);
      });
      
      document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', eliminarDependencia);
      });
      
    } catch (error) {
      console.error('Error al cargar dependencia:', error);
      cuerpoTabla.innerHTML = `
        <tr>
          <td colspan="4" class="error">Error al cargar los datos. ${error.message}</td>
        </tr>
      `;
    }
  }

  // Funciones para abrir/cerrar modal
  function abrirModal(editar = false, dependencia = null) {
    dependenciaEditando = editar ? dependencia : null;
    
    // Configurar el modal según sea edición o nuevo
    if (editar && dependencia) {
      document.querySelector('.modal__titulo').textContent = 'Editar dependencia';
      document.getElementById('codigoDependencia').value = dependencia.CodeDependency || dependencia.codigo;
      document.getElementById('nombre-dependencia').value = dependencia.NameDependency || dependencia.nombre;
      document.getElementById('estado').value = dependencia.estado || '1';
    } else {
      document.querySelector('.modal__titulo').textContent = 'Nueva dependencia';
      document.getElementById('codigoDependencia').value = generarCodigo();
      document.getElementById('nombre-dependencia').value = '';
      document.getElementById('estado').value = '1';
    }
    
    modal.style.display = 'flex';
    document.getElementById('nombre-dependencia').focus();
  }

  function cerrarModal() {
    modal.style.display = 'none';
    formDependencia.reset();
    dependenciaEditando = null;
  }

  // Funciones CRUD
  async function editarDependencia(event) {
    const id = event.currentTarget.getAttribute('data-id');
    try {
      const response = await fetch(`${apiDependencias}${id}/`);
      if (!response.ok) throw new Error('Error al obtener dependencia');
      
      const dependencia = await response.json();
      abrirModal(true, dependencia);
    } catch (error) {
      console.error('Error al editar dependencia:', error);
      alert('No se pudo cargar el dependencia para editar');
    }
  }

  async function eliminarDependencia(event) {
    const id = event.currentTarget.getAttribute('data-id');
    if (!confirm('¿Está seguro de eliminar esta dependencia?')) return;
    
    try {
      const response = await fetch(`${apiDependencias}${id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 'X-CSRFToken': getCSRFToken() 
        }
      });
      
      if (!response.ok) throw new Error('Error al eliminar');
      
      cargarDependencias();
      alert('dependencia eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar dependencia:', error);
      alert('No se pudo eliminar la dependencia');
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

  formDependencia.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const codigo = document.getElementById('codigoDependencia').value;
    const nombre = document.getElementById('nombre-dependencia').value;
    const estado = document.getElementById('estado').value;
    
    if (!nombre.trim()) {
      alert('El nombre de la dependencia es obligatorio');
      return;
    }
    
    const payload = {
      CodeDependency: codigo,
      NameDependency: nombre,
      estado: estado
    };
    
    try {
      let response;
      
      if (dependenciaEditando) {
        // Edición
        response = await fetch(`${apiDependencias}${dependenciaEditando.Id || dependenciaEditando.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // 'X-CSRFToken': getCSRFToken()
          },
          body: JSON.stringify(payload)
        });
      } else {
        // Nueva dependencia
        response = await fetch(apiDependencias, {
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
      cargarDependencias();
      alert(`Dependencia ${dependenciaEditando ? 'actualizado' : 'creado'} correctamente`);
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    }
  });

  //inicialización
  cargarDependencias();
});


function getCSRFToken() {
  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  return cookieValue || '';
}