const express = require('express');
const db = require('./db');
const { horarioSemanal, DURACION_CITA_MINUTOS } = require('./horario');
const app = express();

app.use(express.json());
app.use(express.static('.'));

app.post('/api/contacto', (req, res) => {
  const { nombre, telefono, email, mensaje } = req.body;

  const guardar = db.prepare(
    'INSERT INTO contactos (nombre, telefono, email, mensaje) VALUES (?, ?, ?, ?)'
  );
  guardar.run(nombre, telefono, email, mensaje);

  console.log('Guardado en la base de datos:', nombre);

  res.json({ mensaje: 'Mensaje recibido correctamente' });
});

app.get('/api/contactos', (req, res) => {
  const filas = db.prepare('SELECT * FROM contactos').all();
  res.json(filas);
});
app.get('/api/horarios-disponibles', (req, res) => {
  const fecha = req.query.fecha; // ej: "2026-09-20"

  const diaSemana = new Date(fecha + 'T00:00:00').getDay();
  const horarioDelDia = horarioSemanal[diaSemana];

  if (!horarioDelDia) {
    return res.json({ disponibles: [], mensaje: 'La clínica no atiende ese día' });
  }

  // 1. Generar todos los horarios posibles del día
  const todosLosHorarios = [];
  let [horaActual, minActual] = horarioDelDia.inicio.split(':').map(Number);
  const [horaFin, minFin] = horarioDelDia.fin.split(':').map(Number);

  while (horaActual < horaFin || (horaActual === horaFin && minActual < minFin)) {
    const horaTexto = String(horaActual).padStart(2, '0') + ':' + String(minActual).padStart(2, '0');
    todosLosHorarios.push(horaTexto);

    minActual += DURACION_CITA_MINUTOS;
    if (minActual >= 60) {
      minActual -= 60;
      horaActual += 1;
    }
  }

  // 2. Buscar qué horas ya están ocupadas ese día
  const ocupadas = db.prepare('SELECT hora FROM citas WHERE fecha = ?').all(fecha);
  const horasOcupadas = ocupadas.map(fila => fila.hora);

  // 3. Filtrar: solo dejar las que NO están ocupadas
  const disponibles = todosLosHorarios.filter(hora => !horasOcupadas.includes(hora));

  res.json({ disponibles });
});
app.post('/api/citas', (req, res) => {
  const { nombre_paciente, telefono, fecha, hora } = req.body;

  try {
    const guardar = db.prepare(
      'INSERT INTO citas (nombre_paciente, telefono, fecha, hora) VALUES (?, ?, ?, ?)'
    );
    guardar.run(nombre_paciente, telefono, fecha, hora);

    res.json({ mensaje: 'Cita agendada correctamente' });
  } catch (error) {
    res.status(409).json({ mensaje: 'Esa hora ya fue tomada, elige otra' });
  }
});
const PUERTO = process.env.PORT || 3000;

app.listen(PUERTO, () => {
  console.log('Servidor corriendo en el puerto ' + PUERTO);
});