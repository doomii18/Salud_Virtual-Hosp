// ===========LOGIN============

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  const loginForm = document.getElementById("loginForm");

  function mostrarMensaje(texto, tipo = "error") {
    const mensaje = document.getElementById("mensaje");
    if (!mensaje) return;

    mensaje.textContent = texto;
    mensaje.className = "auth__mensaje";

    if (tipo === "error") {
      mensaje.classList.add("auth__mensaje--error");
    } else {
      mensaje.classList.add("auth__mensaje--success");
    }

    mensaje.style.display = "block";

    setTimeout(() => {
      mensaje.style.display = "none";
    }, 4000);
  }

  // === Registro ===
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const user = document.getElementById("userRegistro").value.trim();
      const email = document.getElementById("emailRegistro").value.trim();
      const pass = document.getElementById("passwordRegistro").value.trim();
      const confirm = document.getElementById("confirmRegistro").value.trim();

      if (pass !== confirm) {
        mostrarMensaje("Las contraseñas no coinciden.");
        return;
      }

      let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      const existeUsuario = usuarios.some(
        (u) => u.user.toLowerCase() === user.toLowerCase()
      );

      if (existeUsuario) {
        mostrarMensaje("El usuario ya existe. Elige otro.");
        return;
      }

      usuarios.push({ user, email, password: pass });
      localStorage.setItem("usuarios", JSON.stringify(usuarios));

      mostrarMensaje("¡Registro exitoso!", "success");

      setTimeout(() => {
        localStorage.setItem("usuarioActual",user);
        window.location.href = "../paginas/home.html";
      }, 1500);
    });
  }

  // === Inicio de sesión ===
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const user = document.getElementById("userLogin").value.trim();
      const pass = document.getElementById("passwordLogin").value.trim();

      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

      const usuarioValido = usuarios.find(
        (u) => u.user.toLowerCase() === user.toLowerCase() && u.password === pass
      );

      if (usuarioValido) {
        mostrarMensaje("Inicio de sesión exitoso", "success");
        setTimeout(() => {
          localStorage.setItem("usuarioActual", user)
          window.location.href = "../paginas/home.html";
        }, 1500);
      } else {
        mostrarMensaje("Usuario o contraseña incorrectos.");
      }
    });
  }
});



//=================AQUI TERMINA=========================


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





//====================INICIO DEL DASHBOARD======================
// Citas completadas 
new Chart(document.getElementById('completedTrend'), {
  type: 'line',
  data: {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [
      {
        label: 'Promedio de Niños Menores de 10 Años',
        data: [138, 1290, 357, 768, 1534],
        borderColor: '#4f46e5',
        fill: false
      },
      {
        label: 'Promedio de Niños Mayores de 10 Años',
        data: [435, 565, 1500, 700, 376 ],
        borderColor: '#10b981',
        fill: false
      }
    ]
  }
});

// CITAS ATENDIDAS
new Chart(document.getElementById('avgDuration'), {
  type: 'line',
  data: {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
    datasets: [{
      label: 'Atendidas',
      data: [990, 422, 894,248,1603],
      backgroundColor: '#C2410C',
      borderColor: '#F97316',
      fill: false
    }]
  }
});

// barra de los resultados de los pacientes con alergias 
new Chart(document.getElementById('Alergias'), {
  type: 'bar',
  data: {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo',],
    datasets: [{
      label: 'Resultados de los pacientes alergicos',
      data: [2, 6, 4, 3, 2],
      backgroundColor: '#60a5fa',
      borderWidth: 1,
      data: [2,6,4,3,2]
    }]
  }
});
