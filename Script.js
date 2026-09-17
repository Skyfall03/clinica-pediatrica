const formulario = document.getElementById('form-contacto');

formulario.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  const datos = {
    nombre: document.getElementById('nombre').value,
    telefono: document.getElementById('telefono').value,
    email: document.getElementById('email').value,
    mensaje: document.getElementById('mensaje').value
  };

  const respuesta = await fetch('/api/contacto', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });

  const resultado = await respuesta.json();

  alert(resultado.mensaje);
  formulario.reset();
});