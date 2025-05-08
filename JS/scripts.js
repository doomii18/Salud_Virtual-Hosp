document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('pacienteForm');

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            // Generar código automáticamente
            const codigoGenerado = 'P-' + Date.now();

            const paciente = {
                codigo: codigoGenerado,
                primerNombre: document.getElementById('1nombre-paciente').value,
                segundoNombre: document.getElementById('2nombre-paciente').value,
                apellidos: document.getElementById('apellidos-paciente').value,
                fechaNacimiento: document.getElementById('fecha').value,
                edad: document.getElementById('edad').value,
                sexo: document.getElementById('sexo').value,
                alergias: document.getElementById('alergias').value
            };

            let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
            pacientes.push(paciente);
            localStorage.setItem('pacientes', JSON.stringify(pacientes));

            form.reset();
        });
    }
});

//Tabla Tutores

  
// Funciones para manejar el formulario de citas
const citaForm = document.getElementById('citaForm');
if (citaForm) {
    generarCodigoCita(); // Generar código de cita automáticamente (para mientras no tenemos Base de datos conectada)

    citaForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita el envío del formulario por defecto
        if (citaForm.checkValidity()) {
            agregarCitaATabla();
            alert('Cita agendada correctamente.');
            citaForm.reset(); // Reiniciar el formulario
            generarCodigoCita(); // Generar un nuevo código de cita
        } else {
            alert('Por favor, complete todos los campos requeridos.');
        }
    });
}

// Función para generar un código de cita
function generarCodigoCita() {
    const codigo = Math.random().toString(36).substring(2, 15).toUpperCase();
    document.getElementById('codigoCita').value = codigo;
}

// Funciones para manejar el formulario de pacientes
const pacienteForm = document.getElementById('pacienteForm');
if (pacienteForm) {
    generarCodigoPaciente(); // Generar código de paciente automáticamente

    pacienteForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (pacienteForm.checkValidity()) {
            agregarPacienteATabla();
            alert('Paciente registrado correctamente.');
            pacienteForm.reset(); 
            generarCodigoPaciente(); 
        } else {
            alert('Por favor, complete todos los campos requeridos.');
        }
    });
}

// Función para generar un código de paciente
function generarCodigoPaciente() {
    const codigo = Math.random().toString(36).substring(2, 15).toUpperCase();
    document.getElementById('codigoPaciente').value = codigo;
}


// Aumento de tamaño en los contenedores de misión y visión
const infoMContainer = document.querySelector('.infoM-container');
const infoVContainer = document.querySelector('.infoV-container');
const infoVVContainer = document.querySelector('.infoVV-container');

function scaleUp(container) {
    container.style.transform = 'scale(1.05)';
    container.style.transition = 'transform 0.3s';
}

function scaleDown(container) {
    container.style.transform = 'scale(1)';
}

// Agregar eventos de hover para los contenedores de misión y visión
if (infoMContainer) {
    infoMContainer.addEventListener('mouseover', function() {
        scaleUp(infoMContainer);
    });
    infoMContainer.addEventListener('mouseout', function() {
        scaleDown(infoMContainer);
    });
}

if (infoVContainer) {
    infoVContainer.addEventListener('mouseover', function() {
        scaleUp(infoVContainer);
    });
    infoVContainer.addEventListener('mouseout', function() {
        scaleDown(infoVContainer);
    });
}

if (infoVVContainer) {
    infoVVContainer.addEventListener('mouseover', function() {
        scaleUp(infoVVContainer);
    });
    infoVVContainer.addEventListener('mouseout', function() {
        scaleDown(infoVVContainer);
    });
}

// Ajustar el margen del footer al cargar la página
function ajustarMargenFooter() {
}




 // Cargar datos de localStorage y mostrarlos en la tabla
 window.onload = function() {
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const tabla = document.getElementById('tablaPacientes').getElementsByTagName('tbody')[0];

    pacientes.forEach((paciente, index) => {
        const nuevaFila = tabla.insertRow();
        nuevaFila.innerHTML = `
            <td>${paciente.codigo}</td>
            <td>${paciente.primerNombre}</td>
            <td>${paciente.segundoNombre}</td>
            <td>${paciente.apellidos}</td>
            <td>${paciente.fechaNacimiento}</td>
            <td>${paciente.edad}</td>
            <td>${paciente.sexo}</td>
            <td>${paciente.alergias}</td>
            <td>
                <button class="editar-btn" onclick="editarFila(${index})">Editar</button>
            </td>
            <td>
                <button class="eliminar-btn" onclick="eliminarFila(${index})">Eliminar</button>
            </td>
        `;
    });
};


function eliminarFila(index) {
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    pacientes.splice(index, 1); // Eliminar el paciente
    localStorage.setItem('pacientes', JSON.stringify(pacientes)); // Guardar cambios
    location.reload(); // Recargar la página para actualizar la tabla
}

function editarFila(index) {
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const paciente = pacientes[index]; // Obtener el paciente a editar

    // la lógica para editar el paciente(incompleto!!!!)
    const nuevoNombre = prompt("Editar Primer Nombre:", paciente.primerNombre);
    if (nuevoNombre !== null && nuevoNombre !== "") {
        paciente.primerNombre = nuevoNombre; // Actualizar el nombre
        localStorage.setItem('pacientes', JSON.stringify(pacientes)); // Guardar cambios
        location.reload(); // Recargar la página para actualizar la tabla
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('pacienteForm');
  
    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault(); // Evitar el envío del formulario
  
        // Obtener pacientes existentes
        let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
  
        // Generar código automático
        const nuevoCodigo = 'P' + String(pacientes.length + 1).padStart(4, '0');
  
        // Capturar datos del formulario
        const paciente = {
          codigo: nuevoCodigo,
          primerNombre: document.getElementById('1nombre-paciente').value,
          segundoNombre: document.getElementById('2nombre-paciente').value,
          apellidos: document.getElementById('apellidos-paciente').value,
          fechaNacimiento: document.getElementById('fecha').value,
          sexo: document.getElementById('sexo').value,
          alergias: document.getElementById('alergias').value
        };
  
        // Guardar paciente
        pacientes.push(paciente);
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
  
        // Limpiar el formulario
        form.reset();
  
        alert("Paciente registrado correctamente");
      });
    }
  });
  

/*dashboard*/
const ctxCitas = document.getElementById('citasChart').getContext('2d');
const citasChart = new Chart(ctxCitas, {
    type: 'bar',
    data: {
        labels: ['Semana', 'Mes', 'Año'],
        datasets: [{
            label: 'Solicitudes de Citas',
            data: [60, 260, 3120], 
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const ctxMayores = document.getElementById('mayoresChart').getContext('2d');
const mayoresChart = new Chart(ctxMayores, {
    type: 'line',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [{
            label: 'Promedio de Niños Mayores de 10 Años',
            data: [10, 15, 8, 20, 12], 
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 2,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});



const ctxMenores = document.getElementById('menoresChart').getContext('2d');
const menoresChart = new Chart(ctxMenores, {
    type: 'line',
    data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
        datasets: [{
            label: 'Total de Niños Menores de 10 Años',
            data: [12, 14, 20, 16, 11], 
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: true
        }] 
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const ctxUbicacion = document.getElementById('ubicacionChart').getContext('2d');
const ubicacionChart = new Chart(ctxUbicacion, {
    type: 'pie',
    data: {
        labels: ['Rural', 'Ciudad'],
        datasets: [{
            label: 'Distribución de Pacientes',
            data: [75, 63],
            backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 206, 86, 0.6)'],
            borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true
            }
        }
    }
});


