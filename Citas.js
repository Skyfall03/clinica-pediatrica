const inputFecha = document.getElementById('fecha');
const contenedorHorarios = document.getElementById('horarios-disponibles');
const formCita = document.getElementById('form-cita');
const resumenCita = document.getElementById('resumen-cita');

inputFecha.addEventListener('change', async function () {
  const fecha = inputFecha.value;

  const respuesta = await fetch('/api/horarios-disponibles?fecha=' + fecha);
  const datos = await respuesta.json();

  contenedorHorarios.innerHTML = '';
  formCita.style.display = 'none';

  if (datos.mensaje) {
    contenedorHorarios.textContent = datos.mensaje;
    return;
  }

  if (datos.disponibles.length === 0) {
    contenedorHorarios.textContent = 'No hay horarios disponibles ese día.';
    return;
  }

  datos.disponibles.forEach(function (hora) {
    const boton = document.createElement('button');
    boton.textContent = hora;
    boton.type = 'button';
    boton.addEventListener('click', function () {
      // Quitar la marca de "seleccionado" de todos los botones
      document.querySelectorAll('#horarios-disponibles button').forEach(function (b) {
        b.classList.remove('seleccionado');
      });
      // Marcar este botón como seleccionado
      boton.classList.add('seleccionado');

      document.getElementById('fecha-elegida').value = fecha;
      document.getElementById('hora-elegida').value = hora;
      resumenCita.textContent = 'Cita el ' + fecha + ' a las ' + hora;
      formCita.style.display = 'block';
    });
    contenedorHorarios.appendChild(boton);
  });
});

formCita.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  const datosCita = {
    nombre_paciente: document.getElementById('nombre-paciente').value,
    telefono: document.getElementById('telefono-paciente').value,
    fecha: document.getElementById('fecha-elegida').value,
    hora: document.getElementById('hora-elegida').value
  };

  const respuesta = await fetch('/api/citas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosCita)
  });

  const resultado = await respuesta.json();
  alert(resultado.mensaje);

  if (respuesta.ok) {
    formCita.reset();
    formCita.style.display = 'none';
    inputFecha.dispatchEvent(new Event('change')); // refresca los horarios disponibles
  }
});